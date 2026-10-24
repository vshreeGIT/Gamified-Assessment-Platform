const API_BASE_URL = "http://localhost:8080/api";

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Unable to parse server response. Please ensure backend is running.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Invalid email or password");
  }

  if (!data.token) {
    throw new Error("Login succeeded, but the server did not return an authentication token.");
  }

  localStorage.setItem("skillquest_token", data.token);
  localStorage.setItem("skillquest_user", JSON.stringify(data));

  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorMsg = "Registration failed";
    try {
      const data = await response.json();
      errorMsg = data.message || (data.errors ? Object.values(data.errors).join(", ") : errorMsg);
    } catch {
      const text = await response.text();
      if (text) errorMsg = text;
    }
    throw new Error(errorMsg);
  }

  const resultText = await response.text();
  return resultText;
}

export function logoutUser() {
  localStorage.removeItem("skillquest_token");
  localStorage.removeItem("skillquest_user");
}

export function getToken() {
  return localStorage.getItem("skillquest_token");
}

export function getCurrentUser() {
  const userStr = localStorage.getItem("skillquest_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}