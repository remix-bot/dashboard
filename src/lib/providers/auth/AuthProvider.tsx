import { ParentComponent } from "solid-js";
import { createContext } from "solid-js";

type AuthContextType = {

}

const AuthContext = createContext<AuthContextType>();

const AuthProvider: ParentComponent = (props) => {
  return <AuthContext.Provider value={{

  }}>
    {props.children}
  </AuthContext.Provider>
}

export default AuthProvider;
