import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT sp.project_id,
               sp.title,
               sp.description,
               sp.location,
               sp.project_date,
               org.name AS organization_name
        FROM service_projects sp
        JOIN organization org ON sp.organization_id = org.organization_id
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            org.organization_id,
            org.name AS organization_name
        FROM service_projects sp
        JOIN organization org ON sp.organization_id = org.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1
    `;

    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.location,
            org.organization_id,
            org.name AS organization_name
        FROM service_projects sp
        JOIN organization org ON sp.organization_id = org.organization_id
        WHERE sp.project_id = $1
    `;

    const result = await db.query(query, [id]);

    return result.rows[0];
};

export { getAllProjects, getUpcomingProjects, getProjectDetails };