import { create } from "zustand";
import { getUserActivity } from "../components/api/activityApi";

const useActivityStore = create((set) => ({
  activities: [],
  loading: false,
  error: null,

  fetchActivities: async () => {
    set({ loading: true });
    try {
      const data = await getUserActivity();

      set({
        activities: data.activities,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },
}));

export default useActivityStore;
