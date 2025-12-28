import { useEffect, useRef, useState } from 'react';
import './chat.css'
import EmojiPicker from 'emoji-picker-react';
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from "../../config/firebase"
import { useSelector, useDispatch } from 'react-redux';
import { changeChat } from '../../redux/slices/chatSlice';

export default function Chat() {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState(null);

    const dispatch = useDispatch();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useSelector((state) => state.chat);
    const { currentUser } = useSelector((state) => state.user);

    console.log("testing user...", user?.id);
    console.log("testing currentuser...", currentUser?.id);

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView();
    }, []);

    useEffect(() => {
        if (!chatId) return;
        
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        }
    }, [chatId]);

    // Listen for real-time changes to the receiver's user document (for block status)
    useEffect(() => {
        if (!user?.id) return;

        const unSub = onSnapshot(doc(db, "users", user.id), (res) => {
            const updatedUser = { ...res.data(), id: user.id };
            // Re-dispatch changeChat to update block status
            dispatch(changeChat({ currentUser, chatId, user: updatedUser }));
        });

        return () => {
            unSub();
        }
    }, [user?.id, chatId, currentUser, dispatch]);

    console.log("chat data...", chat);

    const getColor = (name) => {
        const colors = ["#FF6B6B", "#6B5BFF", "#FFD93D", "#4ECDC4", "#FF8C42", "#45B7D1"];
        return colors[name.length % colors.length];
    };

    const handleEmojiClick = (emoji) => {
        setMessage(message + emoji.emoji);
        setShowEmojiPicker(false);
    }

    const handleSend = async () => {
        if (message.trim() === '') return;

        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text: message,
                    createdAt: new Date()
                }),
            });

            const userIds = [currentUser.id, user.id];

            userIds.forEach(async (id) => {
                console.log("updating chat for user...", id);
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);

                    userChatsData.chats[chatIndex].lastMessage = message;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats
                    });
                }
            });

        } catch (error) {
            console.log("Error sending message:", error);
        } finally {
            setMessage('');
        }
    }

    return (
        <div className="chat">
            <div className='top'>
                <div className='userInfo'>
                    <div
                        className="avatar-circle"
                        style={{ backgroundColor: getColor(user.username) }}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{user?.username}</span>
                </div>
                <div className='icons'>
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>

            <div className='center'>
                {chat?.messages?.map((msg) => (
                    <div className={`messages ${msg.senderId === currentUser.id ? 'own' : ''}`} key={msg.createdAt}>
                        <div
                            className="avatar-circle"
                            style={{ backgroundColor: getColor(msg.senderId === currentUser.id ? currentUser.username : user.username) }}
                        >
                            {(msg.senderId === currentUser.id ? currentUser.username : user.username).charAt(0).toUpperCase()}
                        </div>
                        <div className='text'>
                            <p>{msg.text}</p>
                            <span>12:00</span>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>

            <div className='bottom'>
                <div className='icons'>
                    <img src="./img.png" alt="" />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input
                    type="text"
                    placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send messages" : "Type your message here..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className='emoji'>
                    <img
                        src="./emoji.png"
                        alt=""
                        onClick={() => !(isCurrentUserBlocked || isReceiverBlocked) && setShowEmojiPicker(!showEmojiPicker)}
                        style={{ cursor: (isCurrentUserBlocked || isReceiverBlocked) ? 'not-allowed' : 'pointer', opacity: (isCurrentUserBlocked || isReceiverBlocked) ? 0.5 : 1 }}
                    />
                    <div className='emojiPicker'>
                        <EmojiPicker
                            open={showEmojiPicker && !(isCurrentUserBlocked || isReceiverBlocked)}
                            onEmojiClick={handleEmojiClick}
                        />
                    </div>
                </div>
                <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}