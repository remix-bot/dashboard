import { Component } from "solid-js";
import { ensureAuth } from "../../../lib/providers/auth/AuthProvider";

const Dashboard: Component = () => {
  const { user } = ensureAuth();
  console.log(user);
  console.log("rendering")
  return <>
    <h1>Dashboard</h1>
  </>
}

export default Dashboard;
