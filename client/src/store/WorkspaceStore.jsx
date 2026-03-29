import { create } from "zustand";
import {
  createWorkspace,
  getWorkspace,
  invitePeople,
  getWorkspaceMembers as apiGetWorkspaceMembers,
} from "../components/api/workspaceApi";

const useWorkSpaceStore = create((set) => ({
  workspaces: [],
  members: [],
  loading: false,
  error: null,

  fetchWorkspaces: async () => {
    console.log("in fetchWworkspace");
    set({ loading: true });
    try {
      const data = await getWorkspace();
      set({ workspaces: data, loading: false });
      console.log("got data successfully");
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createWorkspace: async (name) => {
    set({ loading: true });
    try {
      const data = await createWorkspace(name);

      const newWorkspace = {
        ws_id: data.ws_id,
        name: data.name,
        owner_name: "You",
        role: "Owner",
        created_at: data.created_at,
      };

      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
      }));

      set({ error: null, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  invitePeople: async (ws_id, email) => {
    set({ loading: true });
    try {
      await invitePeople(ws_id, email);
      set({ loading: false, error: null });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getWorkspaceMembers: async (ws_id) => {
    set({ loading: true });
    try {
      const data = await apiGetWorkspaceMembers(ws_id);
      set({ members: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useWorkSpaceStore;
