import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganization,
    createOrganization
} from '../models/organizations.js';

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
    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png';

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    res.redirect(`/organization/${organizationId}`);
};

export {
    organizationsPage,
    organizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};