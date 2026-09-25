import express from 'express';

import { homePage } from './controllers/index.js';
import {
    organizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    organizationsPage
} from './controllers/organizations.js';
import { projectsPage, projectDetailsPage } from './controllers/projects.js';
import { categoriesPage, categoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', homePage);
router.get('/organizations', organizationsPage);
router.get('/organization/:id', organizationDetailsPage);
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/projects', projectsPage);
router.get('/project/:id', projectDetailsPage);
router.get('/categories', categoriesPage);
router.get('/category/:id', categoryDetailsPage);
router.get('/test-error', testErrorPage);

export default router;
