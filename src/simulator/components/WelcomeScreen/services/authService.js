import { BACKEND_URL } from "../constants";

export const fetchUserTheme = async (username) => {
  const cleanName = username.trim();
  if (cleanName.length < 3) return null;

  const res = await fetch(`${BACKEND_URL}/api/auth/theme/${cleanName}`);
  if (!res.ok) throw new Error("Theme not found");
  const data = await res.json();
  return data;
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
};

export const registerUser = async ({ username, password, avatar, selectedClass }) => {
  const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      avatar,
      selectedClass
    })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }
  return data;
};
