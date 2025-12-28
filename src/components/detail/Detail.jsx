import { useDispatch, useSelector } from 'react-redux';
import './detail.css'
import { logout } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { changeBlock, resetChat } from '../../redux/slices/chatSlice';

export default function Detail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const { chat, user, isReceiverBlocked, isCurrentUserBlocked } = useSelector((state) => state.chat);

    const getColor = (name) => {
        const colors = ["#FF6B6B", "#6B5BFF", "#FFD93D", "#4ECDC4", "#FF8C42", "#45B7D1"];
        return colors[name.length % colors.length];
    };

    const handleBlocked = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
            });
            dispatch(changeBlock({ isReceiverBlocked }));
        } catch (error) {
            console.log("Error blocking user:", error)
        }
    }


    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase Auth
            dispatch(logout()); // Clear Redux user state
            dispatch(resetChat()); // Clear Redux chat state
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    return (
        <div className="detail">
            <div className='user'>
                <div
                    className="avatar-circle"
                    style={{ backgroundColor: getColor(user.username) }}
                >
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <p>{user?.username}</p>
            </div>
            <button 
                className='block' 
                onClick={handleBlocked}
                disabled={isCurrentUserBlocked}
                style={{ cursor: isCurrentUserBlocked ? 'not-allowed' : 'pointer' }}
            >
                {isCurrentUserBlocked
                    ? "You are blocked"
                    : isReceiverBlocked
                        ? "User Blocked"
                        : "Block User"
                }
            </button>
            <button className='logout' onClick={handleLogout}>Logout</button>
        </div>
    )
}