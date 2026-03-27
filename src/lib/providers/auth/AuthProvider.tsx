import { ParentComponent } from "solid-js";
import { createContext } from "solid-js";
import { APIClient } from "../../api/APIClient";

type AuthContextType = {

}

const AuthContext = createContext<AuthContextType>();

const AuthProvider: ParentComponent = (props) => {
  const client = new APIClient();
  client.connect("499d07b8bee68980f9ce25f98496ee9e", "MN7Y8VQYH15YHEXSV1I").then((success) => {
    console.log(success, client.userId);
  })

  return <AuthContext.Provider value={{

  }}>
    {props.children}
  </AuthContext.Provider>
}

export default AuthProvider;
