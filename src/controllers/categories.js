import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory
} from '../models/categories.js';

const categoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const categoryDetailsPage = async (req, res, next) => {
    const category = await getCategoryById(req.params.id);

    if (!category) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByCategory(category.category_id);
    const title = category.name;

    res.render('category', { title, category, projects });
};

export { categoriesPage, categoryDetailsPage };