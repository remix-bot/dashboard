import { Component, createEffect, createSignal, Show } from "solid-js";
import { AuthState, useAuth } from "../../lib/providers/auth/AuthProvider";
import { useLocation, useNavigate } from "@solidjs/router";

const Login: Component = () => {
  const { authState } = useAuth();

  // redirect on successfull auth
  const redirect = useNavigate();
  const location = useLocation();
  const path = (location.query.r) ? location.query.r as string : "/";
  createEffect(() => {
    if (authState() === AuthState.AUTHENTICATED) redirect(path);
  });

  return <>

  </>
}

export default Login;
