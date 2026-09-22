import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganization
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

export { organizationsPage, organizationDetailsPage };