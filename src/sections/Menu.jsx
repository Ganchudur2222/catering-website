import React, { useState, useEffect } from 'react';
import { categories } from '../data/menu';
import { supabase } from '../lib/supabaseClient';
import { Plus } from 'lucide-react';

const Menu = ({ addToOrder }) => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*');

            if (error) throw error;
            setMenuItems(data || []);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = activeCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    return (
        <section id="menu" className="section" style={{ backgroundColor: 'var(--color-light-gray)' }}>
            <div className="container">
                <h2 className="section-title">Манай Цэс</h2>

                {/* Categories */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '2rem',
                                border: '1px solid var(--color-primary)',
                                backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
                                color: activeCategory === cat ? 'white' : 'var(--color-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {filteredItems.map(item => (
                        <div key={item.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.2s'
                        }}>
                            <div style={{ height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                    <span style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>{item.price.toLocaleString()}₮</span>
                                </div>
                                <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    {item.description}
                                </p>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', gap: '0.5rem' }}
                                    onClick={() => addToOrder(item)}
                                >
                                    <Plus size={18} />
                                    Захиалах
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Menu;
