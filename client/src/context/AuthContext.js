import { createContext } from "react";

function noop() {}
export const AuthContext = createContext({
  token: JSON.parse(localStorage.getItem("user")).token,
  userId: JSON.parse(localStorage.getItem("user")).userId,
  login: noop,
  logout: noop,
  isAuthenticated: false,
});
