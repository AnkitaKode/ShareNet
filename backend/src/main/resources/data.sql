-- Insert default user if not exists
INSERT IGNORE INTO users (id, name, email, password, credit_points, latitude, longitude) 
VALUES (1, 'Default User', 'default@sharenet.com', 'password123', 100.0, 0.0, 0.0);

-- Insert test user if not exists  
INSERT IGNORE INTO users (id, name, email, password, credit_points, latitude, longitude) 
VALUES (2, 'Test User', 'test@sharenet.com', 'test123', 50.0, 0.0, 0.0);

INSERT IGNORE INTO items (id, name, description, price_per_day, image_url, is_available, owner_id) 
VALUES (1, 'Canon DSLR Camera', 'Great for travel and portraits', 15.0, 'https://example.com/canon-dslr.jpg', true, 1);