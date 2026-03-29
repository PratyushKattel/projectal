import {create } from "zustand";
import { createMessage, getMessages, getMessage, updateMessage, deleteMessage } from "../components/api/messageApi";

export const useMessageStore = create((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  fetchMessages: async (task_id) => {
    set({ loading: true, error: null });
    try {
      const data = await getMessages(task_id);
      set({ messages: data.messages || [], loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch messages", loading: false });
    }
  },

  addMessage: async (task_id, content) => {
    set({ loading: true, error: null });
    try {
      const data = await createMessage(task_id, content);
      set((state) => ({
        messages: [...state.messages, data.message],
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to create message", loading: false });
    }
  },

  editMessage: async (message_id, content) => {
    set({ loading: true, error: null });
    try {
      const data = await updateMessage(message_id, content);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.message_id === message_id ? data.message : msg
        ),
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to update message", loading: false });
    }
  },

  removeMessage: async (message_id) => {
    set({ loading: true, error: null });
    try {
      await deleteMessage(message_id);
      set((state) => ({
        messages: state.messages.filter((msg) => msg.message_id !== message_id),
        loading: false
      }));
    } catch (err) {
      set({ error: err.message || "Failed to delete message", loading: false });
    }
  },

  fetchMessage: async (message_id) => {
    set({ loading: true, error: null });
    try {
      const data = await getMessage(message_id);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.message_id === message_id ? data.message : msg
        ),
        loading: false
      }));
      return data.message;
    } catch (err) {
      set({ error: err.message || "Failed to fetch message", loading: false });
      return null;
    }
  },
}));

