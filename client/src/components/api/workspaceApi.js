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

export const invitePeople = async (ws_id,email) => {
    return await apiFetch(`api/workspaces/${ws_id}/members/invite/`,{
        method:"POST",
        body:JSON.stringify({email})
    })
}
