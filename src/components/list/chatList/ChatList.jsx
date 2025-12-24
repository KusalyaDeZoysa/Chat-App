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

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
            // const data = res.data()
            // setChats(data?.chats || [])

            const items = res.data()?.chats || []

            const promisses = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.recceiverId)
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
                    <img src="./avatar.png" alt="" />
                    <div className="info">
                        <span>John Doe</span>
                        <p>Last message</p>
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
