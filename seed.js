import { createClient } from '@supabase/supabase-js';
import { menuItems } from './src/data/menu.js';
import dotenv from 'dotenv';

// Load env vars (this script runs in node, so we need dotenv)
// Note: In this environment I can't easily run node with ES modules and dotenv without setup.
// Instead, I'll just use the hardcoded values for this one-off script since I have them.

const supabaseUrl = 'https://qmjkwsumdkufqbwwvxby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtamt3c3VtZGt1ZnFid3d2eGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODU5MjAsImV4cCI6MjA4MDA2MTkyMH0.tphhmoHpHMUlEsLIeLyzerm3aysDpvGjSCagHEkqHjE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Seeding menu items...');

    // Transform data to match table structure (remove id to let DB generate it, ensure types)
    const itemsToInsert = menuItems.map(({ id, ...item }) => item);

    const { data, error } = await supabase
        .from('menu_items')
        .insert(itemsToInsert);

    if (error) {
        console.error('Error seeding data:', error);
    } else {
        console.log('Success! Added items.');
    }
}

seed();
