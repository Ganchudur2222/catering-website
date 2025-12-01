// AdminDashboard.jsx – Fixed implementation
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit, X, Settings, CheckCircle, Clock } from 'lucide-react';
import { categories } from '../data/menu';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [settings, setSettings] = useState({ hero_image: '', contact_phone: '', contact_name: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: categories[0],
        image: '',
    });

    // Authentication (optional – uncomment to enforce login)
    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) navigate('/login');
    };

    // Data fetching
    const fetchOrders = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setOrders(data || []);
        else console.error('fetchOrders error:', error);
    };

    const fetchMenuItems = async () => {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('name');
        if (!error) setMenuItems(data || []);
        else console.error('fetchMenuItems error:', error);
    };

    const fetchSettings = async () => {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (!error && data) {
            const newSettings = {};
            data.forEach(item => { newSettings[item.key] = item.value; });
            setSettings(prev => ({ ...prev, ...newSettings }));
        } else if (error) console.error('fetchSettings error:', error);
    };

    useEffect(() => {
        // checkUser(); // Uncomment to require authentication
        fetchOrders();
        fetchMenuItems();
        fetchSettings();
    }, []);

    // Handlers
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const updateOrderStatus = async (id, newStatus) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
        if (error) alert('Error updating status: ' + error.message);
        else fetchOrders();
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        try {
            for (const [key, value] of Object.entries(settings)) {
                const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
                if (error) throw error;
            }
            alert('Settings saved successfully!');
        } catch (err) {
            alert('Error saving settings: ' + err.message);
        }
    };

    // Menu Management Functions
    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price,
                description: item.description,
                category: item.category,
                image: item.image,
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', price: '', description: '', category: categories[0], image: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        const itemData = { ...formData, price: Number(formData.price) };
        let error;
        if (editingItem) {
            const { error: upd } = await supabase.from('menu_items').update(itemData).eq('id', editingItem.id);
            error = upd;
        } else {
            const { error: ins } = await supabase.from('menu_items').insert([itemData]);
            error = ins;
        }
        if (error) alert('Error saving item: ' + error.message);
        else { fetchMenuItems(); closeModal(); }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const { error } = await supabase.from('menu_items').delete().eq('id', id);
            if (error) alert('Error deleting item: ' + error.message);
            else fetchMenuItems();
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const completedOrders = orders.filter(o => o.status === 'completed');

    // OrderCard component
    const OrderCard = ({ order, onUpdate, isHistory }) => (
        <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.5rem', backgroundColor: isHistory ? '#f8fafc' : 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>{order.customer_name}</span>
                <span style={{ color: order.status === 'pending' ? '#eab308' : '#22c55e', fontWeight: 'bold', textTransform: 'uppercase' }}>{order.status}</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                {order.phone} | {order.date} | {order.guests} guests
            </div>
            <div style={{ whiteSpace: 'pre-line', marginBottom: '1rem' }}>{order.order_details}</div>
            <div style={{ fontWeight: 'bold' }}>Total: {order.total_price}</div>
            <div style={{ marginTop: '1rem' }}>
                {!isHistory && (
                    <button onClick={() => onUpdate(order.id, 'completed')} className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                        Mark as Completed
                    </button>
                )}
                {isHistory && (
                    <button onClick={() => onUpdate(order.id, 'pending')} className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', border: '1px solid #cbd5e1' }}>
                        Mark as Pending
                    </button>
                )}
            </div>
        </div>
    );

    // Render
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-light-gray)' }}>
            <nav style={{ backgroundColor: 'white', padding: '1rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem' }}>Admin Dashboard</h2>
                    <button onClick={handleLogout} className="btn" style={{ color: '#ef4444', display: 'flex', gap: '0.5rem' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </nav>

            <div className="container" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    {['orders', 'history', 'menu', 'settings'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                backgroundColor: activeTab === tab ? 'var(--color-primary)' : 'white',
                                color: activeTab === tab ? 'white' : 'var(--color-text)',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                textTransform: 'capitalize',
                            }}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={20} /> Incoming Orders
                            </h3>
                            {pendingOrders.length === 0 ? <p>No pending orders.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {pendingOrders.map(order => (
                                        <OrderCard key={order.id} order={order} onUpdate={updateOrderStatus} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div>
                            <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={20} /> Order History
                            </h3>
                            {completedOrders.length === 0 ? <p>No completed orders.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {completedOrders.map(order => (
                                        <OrderCard key={order.id} order={order} onUpdate={updateOrderStatus} isHistory />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Menu Tab */}
                    {activeTab === 'menu' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3>Menu Items</h3>
                                <button className="btn btn-secondary" style={{ gap: '0.5rem' }} onClick={() => openModal()}>
                                    <Plus size={18} /> Add New Item
                                </button>
                            </div>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {menuItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '0.25rem' }} />
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{item.price.toLocaleString()}₮</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn" style={{ color: 'var(--color-text-light)' }} onClick={() => openModal(item)}>
                                                <Edit size={18} />
                                            </button>
                                            <button className="btn" style={{ color: '#ef4444' }} onClick={() => handleDeleteItem(item.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div>
                            <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Settings size={20} /> Site Settings
                            </h3>
                            <form onSubmit={handleSaveSettings} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hero Cover Image URL</label>
                                    <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                        value={settings.hero_image}
                                        onChange={e => setSettings({ ...settings, hero_image: e.target.value })} />
                                    {settings.hero_image && <img src={settings.hero_image} alt="Preview" style={{ marginTop: '0.5rem', height: '100px', borderRadius: '0.5rem' }} />}
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Name</label>
                                    <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                        value={settings.contact_name}
                                        onChange={e => setSettings({ ...settings, contact_name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Phone</label>
                                    <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                        value={settings.contact_phone}
                                        onChange={e => setSettings({ ...settings, contact_phone: e.target.value })} />
                                </div>
                                <button type="submit" className="btn btn-primary">Save Settings</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
                                <input type="text" required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price (₮)</label>
                                <input type="number" required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                                <select style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Image URL</label>
                                <input type="text" required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                                <textarea rows="3" required style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #cbd5e1' }}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Item</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
