import { Routes, Route } from "react-router-dom"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import Register from "./components/register/Register"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "./config/firebase"
import { useSelector, useDispatch } from "react-redux"
import { loginSuccess, logout } from "./redux/slices/userSlice"
import { doc, getDoc } from "firebase/firestore"

function App() {
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unSub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is authenticated - fetch user data from Firestore and restore Redux state
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            dispatch(loginSuccess({
              id: firebaseUser.uid,
              username: userData.username,
              email: userData.email,
              blocked: userData.blocked || [],
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch(logout());
        }
      } else {
        // User is not authenticated - clear Redux state
        dispatch(logout());
      }
      setLoading(false);
    });

    // Cleanup function to unsubscribe from the auth state change listener
    return () => {
      unSub();
    }
  }, [dispatch])


  if (loading) {
    return <div>Loading...</div>; 
  }

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
