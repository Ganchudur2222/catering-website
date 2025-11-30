import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import emailjs from '@emailjs/browser';
import { Trash2, Send } from 'lucide-react';

const OrderForm = ({ orderItems, setOrderItems }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        guests: '',
        notes: ''
    });
    const [status, setStatus] = useState('');

    const total = orderItems.reduce((sum, item) => sum + item.price, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const orderDetails = orderItems.map(item => `${item.name} - ${item.price}₮`).join('\n');
        const totalPrice = `${total.toLocaleString()}₮`;

        try {
            // 1. Save to Supabase
            const { error } = await supabase
                .from('orders')
                .insert([
                    {
                        customer_name: formData.name,
                        phone: formData.phone,
                        date: formData.date,
                        guests: formData.guests,
                        notes: formData.notes,
                        total_price: totalPrice,
                        order_details: orderDetails,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;

            // 2. Send Email (Optional - keep existing logic or uncomment real EmailJS)
            // ... (EmailJS logic here)

            setStatus('success');
            setOrderItems([]);
            setFormData({ name: '', phone: '', date: '', guests: '', notes: '' });
            alert('Захиалга амжилттай илгээгдлээ!');

        } catch (error) {
            console.error('Error saving order:', error);
            setStatus('error');
            alert('Захиалга илгээхэд алдаа гарлаа. Та утсаар холбогдоно уу.');
        }
    };

    const removeItem = (index) => {
        const newItems = [...orderItems];
        newItems.splice(index, 1);
        setOrderItems(newItems);
    };

    return (
        <section id="order-form" className="section">
            <div className="container">
                <h2 className="section-title">Захиалга өгөх</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* Order Summary */}
                    <div style={{ backgroundColor: 'var(--color-light-gray)', padding: '2rem', borderRadius: '1rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Таны сагсанд</h3>
                        {orderItems.length === 0 ? (
                            <p style={{ color: 'var(--color-text-light)' }}>Сагс хоосон байна. Цэснээс сонгоно уу.</p>
                        ) : (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                    {orderItems.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>{item.price.toLocaleString()}₮</div>
                                            </div>
                                            <button onClick={() => removeItem(index)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    <span>Нийт дүн:</span>
                                    <span>{total.toLocaleString()}₮</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Таны нэр</label>
                            <input
                                type="text"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Утасны дугаар</label>
                            <input
                                type="tel"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Огноо</label>
                                <input
                                    type="date"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Зочдын тоо</label>
                                <input
                                    type="number"
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                    value={formData.guests}
                                    onChange={e => setFormData({ ...formData, guests: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Нэмэлт тэмдэглэл</label>
                            <textarea
                                rows="4"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-secondary"
                            disabled={status === 'sending' || orderItems.length === 0}
                            style={{ marginTop: '1rem', opacity: (status === 'sending' || orderItems.length === 0) ? 0.7 : 1 }}
                        >
                            {status === 'sending' ? 'Илгээж байна...' : 'Захиалга илгээх'}
                            <Send size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default OrderForm;
