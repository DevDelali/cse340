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

export { getAllCategories };

