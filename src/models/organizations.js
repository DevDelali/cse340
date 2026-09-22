import db from './db.js'

const getAllOrganizations = async () => {
  const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

  const result = await db.query(query);

  return result.rows;
}

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

export { getAllOrganizations, getOrganizationById, getProjectsByOrganization }