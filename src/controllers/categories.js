import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategory,
    getCategoriesForProject,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesForProject(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export { categoriesPage, categoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };