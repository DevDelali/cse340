import db from './db.js';

const getAllOrganizations = async () => {
  const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization;
    `;

  const result = await db.query(query);
  return result.rows;
};

const getOrganizationById = async (id) => {
  const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        WHERE organization_id = $1
    `, [id]);

  return result.rows[0];
};

const getProjectsByOrganization = async (organizationId) => {
  const result = await db.query(`
        SELECT project_id, title, project_date, location
        FROM service_projects
        WHERE organization_id = $1
        ORDER BY project_date
    `, [organizationId]);

  return result.rows;
};
const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
  const query = `
    UPDATE organization
    SET name = $1, description = $2, contact_email = $3, logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;

  const queryParams = [name, description, contactEmail, logoFilename, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Organization not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated organization with ID:', organizationId);
  }

  return result.rows[0].organization_id;
};

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {number} The id of the newly created organization record.
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
  const query = `
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id
    `;

  const result = await db.query(query, [name, description, contactEmail, logoFilename]);

  if (result.rows.length === 0) {
    throw new Error('Failed to create organization');
  }

  return result.rows[0].organization_id;
};

const showEditProjectForm = async (req, res, next) => {
  try {
    const project = await getProjectDetails(req.params.id);

    if (!project) {
      const error = new Error('Project not found');
      error.status = 404;
      return next(error);
    }

    const organizations = await getAllOrganizations();

    res.render('update-project', {
      title: 'Edit Service Project',
      project,
      organizations
    });
  } catch (error) {
    next(error);
  }
};

const processEditProjectForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash('error', error.msg));
    return res.redirect(`/edit-project/${req.params.id}`);
  }

  try {
    const { title, description, location, date, organizationId } = req.body;

    const projectId = await updateProject(
      req.params.id,
      title,
      description,
      location,
      date,
      organizationId
    );

    req.flash('success', 'Project updated successfully.');
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganization,
  createOrganization,
  updateOrganization,
  showEditProjectForm,
  processEditProjectForm
};