import db from './db.js'

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
}

export { getAllProjects }