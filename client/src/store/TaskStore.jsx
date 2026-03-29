import {create } from "zustand";
import { getTask,getTasks, createTask, updateTask, deleteTask } from "../components/api/taskApi";

const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

//   fetchTasks: async (proj_id, filters = {}) => {
//     set({ loading: true });
//     try {
//       const data = await getTasks(proj_id, filters);
//       set({ tasks: data.tasks || [], loading: false, error: null });
//       console.log("fetchTasks successful:", data);
//     } catch (err) {
//       set({ error: err.message, loading: false });
//       console.log("fetchTasks error:", err);
//     }
//   },

    fetchTasks: async (proj_id) => {
    set({ loading: true });
    try {
        const data = await getTasks(proj_id);
        set({ tasks: data.tasks || [], loading: false, error: null });
        console.log("fetchTasks successful:", data);
    } catch (err) {
        set({ error: err.message, loading: false });
        console.log("fetchTasks error:", err);
    }
    },

  // Create a new task
  createTask: async (proj_id, taskData) => {
    set({ loading: true });
    try {
      const data = await createTask(proj_id, taskData);
      set((state) => ({
        tasks: [...state.tasks, data],
        loading: false,
        error: null
      }));
      console.log("createTask successful:", data);
    } catch (err) {
      set({ error: err.message, loading: false });
      console.log("createTask error:", err);
    }
  },

  fetchTask: async (task_id) => {
    set({ loading: true });
    try {
      const data = await getTask(task_id);
      console.log("fetchTask successful:", data);
      set({ loading: false, error: null });
      return data; // return for immediate use if needed
    } catch (err) {
      set({ error: err.message, loading: false });
      console.log("fetchTask error:", err);
    }
  },

  // Update a task
  updateTask: async (task_id, updateData) => {
    set({ loading: true });
    try {
      const data = await updateTask(task_id, updateData);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.task_id === task_id ? { ...task, ...data } : task
        ),
        loading: false,
        error: null
      }));
      console.log("updateTask successful:", data);
    } catch (err) {
      set({ error: err.message, loading: false });
      console.log("updateTask error:", err);
    }
  },

  // Delete a task
  deleteTask: async (task_id) => {
    set({ loading: true });
    try {
      await deleteTask(task_id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.task_id !== task_id),
        loading: false,
        error: null
      }));
      console.log("deleteTask successful:", task_id);
    } catch (err) {
      set({ error: err.message, loading: false });
      console.log("deleteTask error:", err);
    }
  }
}));

export default useTaskStore;