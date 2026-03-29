import { create } from "zustand";
import {
  createWorkspace,
  getWorkspace,
  invitePeople,
  getWorkspaceMembers as apiGetWorkspaceMembers,
  getWorkspaceDetail,
  updateMemberRole as apiUpdateMemberRole,
} from "../components/api/workspaceApi";

const useWorkSpaceStore = create((set) => ({
  workspaces: [],
  members: [],
  currentWorkspace: null,
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

  fetchWorkspaceDetail: async (ws_id) => {
    set({ loading: true });
    try {
      const data = await getWorkspaceDetail(ws_id);
      set({ currentWorkspace: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateMemberRole: async (ws_id, user_id, role) => {
    set({ loading: true });
    try {
      await apiUpdateMemberRole(ws_id, user_id, role);
      set((state) => ({
        members: state.members.map((m) =>
          m.id === user_id ? { ...m, role } : m
        ),
        loading: false,
        error: null,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useWorkSpaceStore;
