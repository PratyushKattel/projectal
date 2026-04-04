import { apiFetch } from "./apiFetch";

export const getUserActivity = async () => {
  return await apiFetch("api/user/activities/");
};