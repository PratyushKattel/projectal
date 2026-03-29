import { apiFetch } from "./apiFetch";

export const createMessage = async (task_id, content) => {
  return await apiFetch(`api/tasks/${task_id}/messages/`, {
    method: "POST",
    body: JSON.stringify({ content })
  });
};

export const getMessages = async (task_id) => {
  return await apiFetch(`api/tasks/${task_id}/messages/`, {
    method: "GET"
  });
};

export const getMessage = async (message_id) => {
  return await apiFetch(`api/messages/${message_id}/`, {
    method: "GET"
  });
};

export const updateMessage = async (message_id, content) => {
  return await apiFetch(`api/messages/${message_id}/`, {
    method: "PATCH",
    body: JSON.stringify({ content })
  });
};

export const deleteMessage = async (message_id) => {
  return await apiFetch(`api/messages/${message_id}/`, {
    method: "DELETE"
  });
};