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
export const getWorkspaceMembers = async (ws_id) => {
    return await apiFetch(`api/workspaces/${ws_id}/members/`,{
        method:"GET"
    })
}

export const getWorkspaceDetail = async (ws_id) => {
    return await apiFetch(`api/workspaces/${ws_id}/`, {
        method: "GET"
    });
}

export const updateMemberRole = async (ws_id, user_id, role) => {
    return await apiFetch(`api/workspaces/${ws_id}/members/${user_id}/`, {
        method: "PATCH",
        body: JSON.stringify({ role })
    });
}
