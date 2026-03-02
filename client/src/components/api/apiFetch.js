const URL = "http://127.0.0.1:8000/";

export const apiFetch = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("API Error:", error);
    throw error; 
  }
};