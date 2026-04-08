// src/utils/auth.js

export const getToken = () => localStorage.getItem("st_token");

export const getUser  = () => {
  try { return JSON.parse(localStorage.getItem("st_user")); }
  catch { return null; }
};

export const saveAuth = (token, user) => {
  localStorage.setItem("st_token", token);
  localStorage.setItem("st_user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("st_token");
  localStorage.removeItem("st_user");
};

export const isLoggedIn = () => !!getToken();