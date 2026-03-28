import { createSignal, ParentComponent, useContext } from "solid-js";
import { createContext } from "solid-js";
import { APIClient } from "../../api/APIClient";
import { User } from "../../api/User";
import { Accessor } from "solid-js";
import { redirect, useLocation, useNavigate } from "@solidjs/router";

type AuthContextType = {
  api: APIClient;
  user: Accessor<User | undefined>
}

export const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth: cannot find an AuthContext");
  return context;
}
export const ensureAuth = () => {
  const context = useAuth();
  if (!context.api.authenticated) {
    const location = useLocation();
    useNavigate()("/login?r=" + location.pathname);
  }
  return context;
}

const AuthProvider: ParentComponent = (props) => {
  const client = new APIClient();
  const [user, setUser] = createSignal<User | undefined>(undefined);
  client.connect("499d07b8bee68980f9ce25f98496ee9e", "MN7Y8VQYH15YHEXSV1I").then((success) => {
    console.log(success, client.user);
    setUser(client.user);
  });

  return <AuthContext.Provider value={{
    api: client,
    user
  }}>
    {props.children}
  </AuthContext.Provider>
}

export default AuthProvider;
