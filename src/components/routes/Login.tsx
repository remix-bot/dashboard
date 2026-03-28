import { Component, createEffect } from "solid-js";
import { useAuth } from "../../lib/providers/auth/AuthProvider";
import { useLocation, useNavigate } from "@solidjs/router";

const Login: Component = () => {
  const { user } = useAuth();

  // redirect on successfull auth
  const redirect = useNavigate();
  const location = useLocation();
  const path = (location.query.r) ? location.query.r as string : "/";
  createEffect(() => {
    if (!!user()) redirect(path);
  });

  return <>

  </>
}

export default Login;
