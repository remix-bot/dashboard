import { createEffect, createSignal, ParentComponent, useContext } from "solid-js";
import { createContext } from "solid-js";
import { APIClient } from "../../api/APIClient";
import { User } from "../../api/User";
import { Accessor } from "solid-js";
import { redirect, useLocation, useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { Player, SerialisedChannel } from "../../api/Player";

type AuthContextType = {
  api: APIClient;
  user: Accessor<User | undefined>;
  authState: Accessor<AuthState>;
  channel: Accessor<SerialisedChannel | null>;
  createCode: (user: string) => Promise<string>;
  getExistingCode: () => Promise<string | null>;
  verifyLogin: () => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth: cannot find an AuthContext");
  return context;
}

export const ensureAuth = () => {
  const context = useAuth();
  const navigate = useNavigate();
  createEffect(() => {
    if (context.authState() === AuthState.UNAUTHORISED) {
      const location = useLocation();
      navigate((location.pathname !== "/logout") ? "/login?r=" + location.pathname : "/");
    }
  });
  return context;
}

export enum AuthState {
  UNAUTHORISED = "anon",
  CONNECTING = "connect",
  AUTHENTICATED = "auth"
}

const AuthProvider: ParentComponent = (props) => {
  const client = new APIClient();
  const [user, setUser] = createSignal<User | undefined>(undefined);
  const [state, setState] = createSignal<AuthState>(AuthState.CONNECTING);
  const [channel, setChannel] = createSignal<SerialisedChannel | null>(null);

  /*client.connect("499d07b8bee68980f9ce25f98496ee9e", "MN7Y8VQYH15YHEXSV1I").then((success) => {
    console.log(success, client.user);
    setUser(client.user);
  });
  */

  const connect = async (apiToken: string, tokenId: string) => {
    setState(AuthState.CONNECTING);
    const s = await client.connect(apiToken, tokenId);
    setState(s ? AuthState.AUTHENTICATED : AuthState.UNAUTHORISED);
    return s;
  }

  const token = localStorage.getItem("apiToken");
  const tokenId = localStorage.getItem("apiTokenId");
  if (token && tokenId) {
    connect(token, tokenId);
  } else {
    setState(AuthState.UNAUTHORISED);
  }

  client.on("authenticated", () => {
    console.log("authenticated");
    setUser(client.user);
  });

  createEffect(() => {
    const u = user();
    if (!u) return;
    u.on("join", (player: Player) => {
      setChannel(player.channel);
    });
  });

  const createCode = async (user: string) => {
    const code = await client.getLoginCode(user);
    return import.meta.env.VITE_COMMAND_PREFIX + "login " + code;
  }
  const getExistingCode = async () => {
    const res = await client.get("/login/code");
    if (!res.code) return null;
    return import.meta.env.VITE_COMMAND_PREFIX + "login " + res.code as string;
  }
  const verifyLogin = async () => {
    const tokens = await client.verifyCode();
    if (!tokens) return false;
    localStorage.setItem("apiToken", tokens.token);
    localStorage.setItem("apiTokenId", tokens.id);

    const s = await connect(tokens.token, tokens.id);
    if (s) return true;

    localStorage.removeItem("apiToken");
    localStorage.removeItem("apiTokenId");
    // TODO: display error message

    return false;
  }
  const logout = () => {
    localStorage.removeItem("apiToken");
    localStorage.removeItem("apiTokenId");
    setUser(undefined);
    setState(AuthState.UNAUTHORISED);
  }

  return <AuthContext.Provider value={{
    api: client,
    authState: state,
    user,
    channel,
    createCode,
    getExistingCode,
    verifyLogin,
    logout
  }}>
    {props.children}
  </AuthContext.Provider>
}

export default AuthProvider;
