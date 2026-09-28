import express from 'express';

import { homePage } from './controllers/index.js';
import {
    organizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation,
    organizationsPage
} from './controllers/organizations.js';
import {
    projectsPage,
    projectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation
} from './controllers/projects.js';
import { categoriesPage, categoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';

const router = express.Router();

router.get('/', homePage);
router.get('/organizations', organizationsPage);
router.get('/organization/:id', organizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailsPage);
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailsPage);
router.get('/test-error', testErrorPage);

export default router;
