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
            TO_CHAR(sp.project_date, 'YYYY-MM-DD') AS date,
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
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_projects
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ]);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};

const addProjectVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING
    `;

    await db.query(query, [userId, projectId]);
};

const removeProjectVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;

    await db.query(query, [userId, projectId]);
};

const getProjectsForVolunteer = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.project_date,
            sp.location,
            org.name AS organization_name
        FROM project_volunteers pv
        JOIN service_projects sp ON sp.project_id = pv.project_id
        JOIN organization org ON org.organization_id = sp.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date, sp.title
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
};

const isProjectVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
    `;

    const result = await db.query(query, [userId, projectId]);
    return result.rowCount > 0;
};

export {
    getAllProjects, getUpcomingProjects, getProjectDetails,
    createProject, updateProject, addProjectVolunteer,
    removeProjectVolunteer, getProjectsForVolunteer, isProjectVolunteer
};