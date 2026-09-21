import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesForProject } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const projectDetailsPage = async (req, res, next) => {
    const project = await getProjectDetails(req.params.id);

    if (!project) {
        const err = new Error('Project not found');
        err.status = 404;
        return next(err);
    }

    const categories = await getCategoriesForProject(project.project_id);
    const title = project.title;

    res.render('project', { title, project, categories });
};

export { projectsPage, projectDetailsPage };