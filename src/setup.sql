-- Table for storing organization information
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert sample data into the organization table
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Table for storing project service information
-- Project service table 
CREATE TABLE service_projects (
    project_id      SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL
        REFERENCES organization(organization_id)
        ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    location        VARCHAR(255) NOT NULL,
    project_date    DATE NOT NULL
);

-- Sample data for service_projects table
INSERT INTO service_projects
    (organization_id, title, description, location, project_date)
VALUES
    (1, 'Park Cleanup', 'Join us to clean up local parks and make them beautiful.', 'Riverside Park', '2026-10-04'),
    (1, 'Food Drive', 'Help collect and distribute food to those in need.', 'Downtown Community Center', '2026-10-18'),
    (1, 'Community Tutoring', 'Volunteer to tutor students in various subjects.', 'Lincoln Elementary', '2026-11-02'),
    (1, 'Trail Restoration', 'Repair and clear hiking trails damaged by storms.', 'Cedar Ridge Trailhead', '2026-11-15'),
    (1, 'Winter Coat Drive', 'Collect and distribute winter coats to families in need.', 'Main Street Shelter', '2026-12-06'),
 
    (2, 'Beach Cleanup', 'Remove litter and debris from the shoreline.', 'Sunset Beach', '2026-10-11'),
    (2, 'Tree Planting Day', 'Plant native trees to restore local green space.', 'Greenfield Park', '2026-10-25'),
    (2, 'Recycling Awareness Booth', 'Educate the public on proper recycling practices.', 'Farmers Market', '2026-11-08'),
    (2, 'Community Garden Build', 'Help build raised beds for a new community garden.', 'Oakwood Lot', '2026-11-22'),
    (2, 'River Cleanup', 'Clear trash and invasive plants along the riverbank.', 'Willow Creek', '2026-12-13'),
 
    (3, 'Senior Center Visit Day', 'Spend time and provide company for senior residents.', 'Golden Years Senior Center', '2026-10-07'),
    (3, 'Health Screening Event', 'Assist with free community health screenings.', 'Community Health Clinic', '2026-10-21'),
    (3, 'Blood Drive', 'Help organize and support a community blood drive.', 'City Hall', '2026-11-04'),
    (3, 'Wellness Workshop', 'Assist in hosting a workshop on nutrition and wellness.', 'Public Library', '2026-11-18'),
    (3, 'Holiday Meal Distribution', 'Prepare and distribute holiday meals to families.', 'St. Andrew Community Kitchen', '2026-12-19');

-- Verify the inserted data
SELECT
    sp.project_id,
    sp.title,
    sp.project_date,
    o.name AS organization_name
FROM service_projects sp
JOIN organization o ON sp.organization_id = o.organization_id
ORDER BY sp.project_date;

--Table for storing categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE
);

-- Joining table for projects and categories
CREATE TABLE project_categories (
    project_id  INTEGER NOT NULL
        REFERENCES service_projects(project_id)
        ON DELETE CASCADE,
    category_id INTEGER NOT NULL
        REFERENCES categories(category_id)
        ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- Insert sample categories into the categories table
INSERT INTO categories (name) VALUES
    ('Environmental Conservation'),
    ('Education and Tutoring'),
    ('Food and Hunger Relief'),
    ('Healthcare and Wellness'),
    ('Community Development');

--Inserting sample data into the project_categories table to associate projects with categories
INSERT INTO project_categories (project_id, category_id) VALUES
    (1, 1),  -- Park Cleanup -> Environmental Conservation
    (2, 3),  -- Food Drive -> Food and Hunger Relief
    (3, 2),  -- Community Tutoring -> Education and Tutoring
    (4, 1),  -- Trail Restoration -> Environmental Conservation
    (5, 3),  -- Winter Coat Drive -> Food and Hunger Relief
    (6, 1),  -- Beach Cleanup -> Environmental Conservation
    (7, 1),  -- Tree Planting Day -> Environmental Conservation
    (8, 1),  -- Recycling Awareness Booth -> Environmental Conservation
    (9, 5),  -- Community Garden Build -> Community Development
    (10, 1), -- River Cleanup -> Environmental Conservation
    (11, 4), -- Senior Center Visit Day -> Healthcare and Wellness
    (12, 4), -- Health Screening Event -> Healthcare and Wellness
    (13, 4), -- Blood Drive -> Healthcare and Wellness
    (14, 4), -- Wellness Workshop -> Healthcare and Wellness
    (15, 3); -- Holiday Meal Distribution -> Food and Hunger Relief

-- Verify the inserted data in the project_categories table
SELECT
    sp.title,
    STRING_AGG(c.name, ', ') AS categories
FROM service_projects sp
JOIN project_categories pc ON sp.project_id = pc.project_id
JOIN categories c ON pc.category_id = c.category_id
GROUP BY sp.project_id, sp.title
ORDER BY sp.title;