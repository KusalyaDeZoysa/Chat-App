import { Routes, Route } from "react-router-dom"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import Register from "./components/register/Register"

function App() {
  const user = false

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
