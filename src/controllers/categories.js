import {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    getProjectsByCategory,
    getCategoriesForProject,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

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

const categoryNameValidation = [
    body('name')
        .isString()
        .withMessage('Category name must be text')
        .bail()
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
        .bail()
        .custom(async (name, { req }) => {
            const existingCategory = await getCategoryByName(name);

            if (
                existingCategory &&
                String(existingCategory.category_id) !== String(req.params.id ?? '')
            ) {
                throw new Error('A category with this name already exists');
            }

            return true;
        })
];

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Create New Category' });
};

const processNewCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(req.body.name);
        req.flash('success', 'Category created successfully.');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        next(error);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const category = await getCategoryById(req.params.id);

        if (!category) {
            const error = new Error('Category not found');
            error.status = 404;
            return next(error);
        }

        res.render('edit-category', {
            title: 'Edit Category',
            category
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    try {
        const categoryId = await updateCategory(req.params.id, req.body.name);
        req.flash('success', 'Category updated successfully.');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        next(error);
    }
};

export {
    categoriesPage, categoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm,
    showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm,
    categoryNameValidation
};