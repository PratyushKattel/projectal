import { apiFetch } from "./apiFetch";

export const createTask = async (proj_id, data) => {
    return await apiFetch(`api/projects/${proj_id}/tasks/`, {
        method: "POST",
        body: JSON.stringify(data)
    });
}

// // Get all tasks in a project (supports optional filters: status, priority, assigned_to)
// export const getTasks = async (proj_id, filters = {}) => {
//     const query = new URLSearchParams(filters).toString();
//     return await apiFetch(`api/projects/${proj_id}/tasks/${query ? '?' + query : ''}`, {
//         method: "GET"
//     });
// }

export const getTasks = async (proj_id) => {
    return await apiFetch(`api/projects/${proj_id}/tasks/`, {
        method: "GET"
    });
}

export const getTask = async (task_id) => {
    return await apiFetch(`api/tasks/${task_id}/`, {
        method: "GET"
    });
}

export const updateTask = async (task_id, data) => {
    return await apiFetch(`api/tasks/${task_id}/`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });
}

export const deleteTask = async (task_id) => {
    return await apiFetch(`api/tasks/${task_id}/`, {
        method: "DELETE"
    });
}