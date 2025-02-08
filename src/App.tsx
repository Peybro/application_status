import { ApplicationsList } from "./components/Applications-List.component";

import "@picocss/pico/css/pico.min.css";
import "./App.css";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "./firebase";

const auth = getAuth(app);

function App() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [user, loading, error] = useAuthState(auth);
  const login = () => {
    signInWithEmailAndPassword(auth, userName, password);
  };

  return (
    <main className="container-fluid">
      {!user && (
        <div>
          <h1>Thomas' Bewerbungen</h1>
          <input
            type="text"
            placeholder="Benutzername"
            value={userName}
            onChange={(e) => setUserName(e.currentTarget.value)}
          ></input>
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          ></input>
          <button
            onClick={() => login()}
            disabled={userName === "" || password === ""}
          >
            Login
          </button>
        </div>
      )}
      {error && <span>Falscher Benutzer oder Passwort</span>}
      {loading && <span>Logge ein...</span>}
      {user && <ApplicationsList></ApplicationsList>}
    </main>
  );
}

export default App;
