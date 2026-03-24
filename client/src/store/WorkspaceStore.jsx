import { create } from "zustand";
import { createWorkspace, getWorkspace } from "../components/api/workspaceApi";

const useWorkSpaceStore = create((set) => ({
  workspaces: [],
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
}));

export default useWorkSpaceStore;
