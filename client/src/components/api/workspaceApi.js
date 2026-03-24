import { apiFetch } from "./apiFetch";

export const getWorkspace = async () => {
    return await apiFetch("api/workspaces/");
}

export const createWorkspace = async (name) => {
    return await apiFetch("api/workspaces/",{
        method:"POST",
        body:JSON.stringify({name})
    });
}

