import db from './db.js';

/**
 * Retrieves all service project categories.
 */
const getAllCategories = async () => {
    const result = await db.query(`
        SELECT category_id, name
        FROM categories
        ORDER BY name
    `);

    return result.rows;
};

const getCategoryById = async (id) => {
    const query = `
        SELECT category_id, name
        FROM categories
        WHERE category_id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

const getCategoriesForProject = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM categories c
        JOIN project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getProjectsByCategory = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            org.organization_id,
            org.name AS organization_name
        FROM service_projects sp
        JOIN project_categories pc ON sp.project_id = pc.project_id
        JOIN organization org ON sp.organization_id = org.organization_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesForProject,
    getProjectsByCategory,
    updateCategoryAssignments
};

