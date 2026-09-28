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
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO service_projects
        (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

export {
    getAllProjects, getUpcomingProjects, getProjectDetails,
    createProject
};