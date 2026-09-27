import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganization,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { body, validationResult } from 'express-validator';

const organizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

const organizationDetailsPage = async (req, res, next) => {
    const organization = await getOrganizationById(req.params.id);

    if (!organization) {
        const err = new Error('Organization not found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByOrganization(organization.organization_id);

    res.render('organization', {
        title: organization.name,
        organization,
        projects
    });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

const processNewOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(contactEmail.trim())) {
        req.flash('error', 'Please enter a valid email address.');
        return res.redirect('/new-organization');
    }

    const logoFilename = 'placeholder-logo.png';
    const organizationId = await createOrganization(name, description, contactEmail.trim(), logoFilename);

    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationDetails = await getOrganizationById(req.params.id);

        if (!organizationDetails) {
            const error = new Error('Organization not found');
            error.status = 404;
            return next(error);
        }

        res.render('edit-organization', {
            title: 'Edit Organization',
            organizationDetails
        });
    } catch (error) {
        next(error);
    }
};

const processEditOrganizationForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-organization/${req.params.id}`);
    }

    try {
        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(
            req.params.id,
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization updated successfully.');
        res.redirect(`/organization/${req.params.id}`);
    } catch (error) {
        next(error);
    }
};

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .bail()
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .bail()
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),

    body('contactEmail')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .bail()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

export {
    organizationsPage,
    organizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};