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

export {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganization,
  createOrganization
};