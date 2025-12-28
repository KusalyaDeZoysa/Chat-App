import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "../../addUser/AddUser"
import { useSelector, useDispatch } from "react-redux"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../../config/firebase"
import { changeChat } from "../../../redux/slices/chatSlice"

export default function ChatList() {
    const [addMode, setAddMode] = useState(false)
    const [chats, setChats] = useState([])
    const [input, setInput] = useState("")

    const { currentUser } = useSelector((state) => state.user)

    const dispatch = useDispatch()

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

                const user = { ...userDocSnap.data(), id: item.receiverId }

                return { ...item, user }
            })
            const chatData = await Promise.all(promisses)
            console.log("chatData...x", chatData)
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
        })
        return () => {
            unsub()
        }
    }, [currentUser.id])

    console.log("chats...y", chats)
    console.log("user...z", chats.user)

    const handleChatSelect = async (chat) => {

        const userChats = chats.map((item) => {
            const {user, ...rest} = item;
            return rest;
        });
        const chatIndex = userChats.findIndex(c => c.chatId === chat.chatId);
        userChats[chatIndex].isSeen = true;

        try {
            await updateDoc(doc(db, "userchats", currentUser.id), {
                chats: userChats
            });
            
            // Fetch fresh user data to get the latest blocked status
            const userDocRef = doc(db, "users", chat.user.id || chat.receiverId);
            const userDocSnap = await getDoc(userDocRef);
            const freshUserData = { ...userDocSnap.data(), id: chat.user.id || chat.receiverId };
            
            dispatch(changeChat({ currentUser, chatId: chat.chatId, user: freshUserData }));
        } catch (error) {
            console.log("Error updating isSeen status:", error);
        }
        console.log("selected chat...", chat)
    }

    const filteredChats = chats.filter((chat) =>
        chat.user.username.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className="chat-list">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)}/>
                </div>
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt=""
                    onClick={() => setAddMode(!addMode)}
                />
            </div>
            {filteredChats.map((chat) => (
                <div
                    className="item"
                    key={chat.chatId}
                    onClick={() => handleChatSelect(chat)}
                    style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "#bcf5ddaf",
                        cursor: "pointer"
                    }}
                >
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

            {addMode && <AddUser />}
        </div>
    )
}
