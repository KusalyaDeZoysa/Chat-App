import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "../../addUser/AddUser"
import { useSelector } from "react-redux"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "../../../config/firebase"

export default function ChatList() {
    const [addMode, setAddMode] = useState(false)
    const [chats, setChats] = useState([])

    const { currentUser } = useSelector((state) => state.user)

    const getColor = (name) => {
        const colors = ["#FF6B6B", "#6B5BFF", "#FFD93D", "#4ECDC4", "#FF8C42", "#45B7D1"];
        return colors[name.length % colors.length];
    };

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            // const data = res.data()
            // setChats(data?.chats || [])

            const items = res.data()?.chats || []

            const promisses = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId)
                const userDocSnap = await getDoc(userDocRef)

                const user = userDocSnap.data()
                
                return { ...item, user }
            })
            const chatData = await Promise.all(promisses)
            console.log("chatData...x", chatData)
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt) )
        })
        return () => {
            unsub()
        }
    }, [currentUser.id])

    console.log("chats...y", chats)
    console.log("user...z", chats.user)

    return (
        <div className="chat-list">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" />
                </div>
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt=""
                    onClick={() => setAddMode(!addMode)}
                />
            </div>
            {chats.map((chat) => (
                <div className="item" key={chat.chatId}>
                    <div
                        className="avatar-circle"
                        style={{ backgroundColor: getColor(chat.user.username) }}
                    >
                        {chat.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="info">
                        <span>{chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}

            {/* <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div> */}

            {addMode && <AddUser />}
        </div>
    )
}
