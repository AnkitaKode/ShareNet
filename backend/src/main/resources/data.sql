-- Insert default user if not exists
INSERT IGNORE INTO users (id, name, email, password, credit_points, latitude, longitude) 
VALUES (1, 'Default User', 'default@sharenet.com', 'password123', 100.0, 0.0, 0.0);

-- Insert test user if not exists  
INSERT IGNORE INTO users (id, name, email, password, credit_points, latitude, longitude) 
VALUES (2, 'Test User', 'test@sharenet.com', 'test123', 50.0, 0.0, 0.0);
