import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Hero = () => {
    const [settings, setSettings] = useState({
        hero_image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1920',
        contact_name: 'ALL Catering'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (!error && data) {
            const newSettings = {};
            data.forEach(item => {
                newSettings[item.key] = item.value;
            });
            setSettings(prev => ({ ...prev, ...newSettings }));
        }
    };

    return (
        <section className="hero" style={{
            height: '80vh',
            background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${settings.hero_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            marginTop: '60px'
        }}>
            <div className="container">
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'white' }}>
                    {settings.contact_name}
                </h1>
                <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Бүх төрлийн арга хэмжээний Кейтеринг үйлчилгээ
                </p>
                <button
                    className="btn btn-secondary"
                    style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
                    onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
                >
                    Цэс үзэх
                </button>
            </div>
        </section>
    );
};

export default Hero;
