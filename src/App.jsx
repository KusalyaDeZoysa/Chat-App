import { Routes, Route } from "react-router-dom"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import Register from "./components/register/Register"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./config/firebase"

function App() {
  // const user = false;
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);
      }
    });

    // Cleanup function to unsubscribe from the auth state change listener
    return () => {
      unSub();
    }

  },[])

  if (user) {
    return (
      <div className="container">
        <List />
        <Chat />
        <Detail />
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Notification />
    </>
  )
}

export default App
