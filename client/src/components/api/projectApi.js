import { apiFetch } from "./apiFetch";

// POST api/workspaces/:ws_id/projects/ - Create a new project in a workspace
export const createProject = async (ws_id, name, description = "") => {
    return await apiFetch(`api/workspaces/${ws_id}/projects/`, {
        method: "POST",
        body: JSON.stringify({ name, description }),
    });

}

// GET api/workspaces/:ws_id/projects/ - Get all projects in a workspace
export const getProjects = async (ws_id) => {
    return await apiFetch(`api/workspaces/${ws_id}/projects/`);
}

// GET api/workspaces/projects/:project_id/ - Get single project (with tasks)
export const getProject = async (project_id) => {
    return await apiFetch(`api/workspaces/projects/${project_id}/`);
}

// PATCH api/workspaces/projects/:project_id/ - Update project details
export const updateProject = async (project_id, data) => {
    return await apiFetch(`api/workspaces/projects/${project_id}/`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// DELETE api/workspaces/projects/:project_id/ - Delete project
export const deleteProject = async (project_id) => {
    return await apiFetch(`api/workspaces/projects/${project_id}/`, {
        method: "DELETE",
    });
}