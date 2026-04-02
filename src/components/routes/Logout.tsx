import { Component } from "solid-js";
import { ensureAuth } from "../../lib/providers/auth/AuthProvider";

const Logout: Component = () => {
  const { logout } = ensureAuth();
  logout(); // ensureAuth should handle the redirect
  return <>

  </>
}

export default Logout;
