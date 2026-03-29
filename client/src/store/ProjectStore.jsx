import { create } from "zustand"
// importing all the api

import { createProject, getProjects, getProject, updateProject, deleteProject } from "../components/api/projectApi"


const useProjectStore = create((set) => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,

    // GET all projects in a workspace
    fetchProjects: async (ws_id) => {
        set({ loading: true });
        try {
            const data = await getProjects(ws_id);
            set({ projects: data.projects, loading: false, error: null });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // POST create a new project in a workspace
    createProject: async (ws_id, name, description) => {
        set({ loading: true });
        try {
            const data = await createProject(ws_id, name, description);
            set((state) => ({
                projects: [...state.projects, data],
                loading: false,
                error: null,
            }));
            return data;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    // GET single project (with tasks)
    fetchProject: async (project_id) => {
        set({ loading: true });
        try {
            const data = await getProject(project_id);
            set({ currentProject: data, loading: false, error: null });
            return data;
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // PATCH update project details
    updateProject: async (project_id, updatedData) => {
        set({ loading: true });
        try {
            const data = await updateProject(project_id, updatedData);
            set((state) => ({
                projects: state.projects.map((p) =>
                    p.proj_id === project_id ? { ...p, ...data } : p
                ),
                currentProject:
                    state.currentProject?.proj_id === project_id
                        ? { ...state.currentProject, ...data }
                        : state.currentProject,
                loading: false,
                error: null,
            }));
            return data;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    // DELETE project
    deleteProject: async (project_id) => {
        set({ loading: true });
        try {
            await deleteProject(project_id);
            set((state) => ({
                projects: state.projects.filter((p) => p.proj_id !== project_id),
                currentProject:
                    state.currentProject?.proj_id === project_id
                        ? null
                        : state.currentProject,
                loading: false,
                error: null,
            }));
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },
}));

export default useProjectStore;
