-- Seed data for menu_items based on legacy site categories

-- Optional: Clear existing items (uncomment if you want to start fresh)
-- DELETE FROM menu_items;

INSERT INTO menu_items (name, price, category, description, image) VALUES
('Buffet Set A', 45000, 'Buffet', 'Assorted hot and cold dishes suitable for large gatherings.', 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800'),
('Box Catering Premium', 35000, 'Box catering', 'Individual premium meal box with main course, side, and dessert.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800'),
('Finger Food Platter', 55000, 'Finger foods', 'Variety of bite-sized appetizers.', 'https://images.unsplash.com/photo-1605493666454-922446f63353?auto=format&fit=crop&q=80&w=800'),
('Club Sandwich', 12000, 'Sandwich', 'Classic triple-decker sandwich with chicken, bacon, and egg.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800'),
('Coffee Break Standard', 15000, 'Coffee break', 'Coffee, tea, and assorted pastries.', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'),
('Event Package Gold', 85000, 'Event', 'Full service catering for special events.', 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&q=80&w=800'),
('Americano', 45000, 'Drink', 'Hot brewed coffee.', 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=800'),
('Green Tea', 3500, 'Drink', 'Refreshing hot green tea.', 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=800');
