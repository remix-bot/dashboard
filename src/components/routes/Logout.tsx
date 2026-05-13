import "../../styles/index.css";
import { Component } from "solid-js";
import { ensureAuth } from "../../lib/providers/auth/AuthProvider";

const Logout: Component = () => {
  const { logout } = ensureAuth();
  logout(); // ensureAuth should handle the redirect
  return <>
    <h1 style="text-align: center; font-size: 200%">Logging Out...</h1>
  </>
}

export default Logout;
