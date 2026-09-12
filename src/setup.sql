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