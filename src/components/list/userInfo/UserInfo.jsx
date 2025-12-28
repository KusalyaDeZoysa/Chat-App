import { useDispatch, useSelector } from 'react-redux';
import './userInfo.css'
import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { logout } from '../../../redux/slices/userSlice';
import { resetChat } from '../../../redux/slices/chatSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function UserInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser } = useSelector((state) => state.user);
    const displayName = currentUser.username;
    const firstLetter = displayName.charAt(0).toUpperCase();

    const getColor = () => {
        const colors = ["#FF6B6B", "#6B5BFF", "#FFD93D", "#4ECDC4", "#FF8C42", "#45B7D1"];
        return colors[displayName.length % colors.length];
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            dispatch(resetChat());
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="user-info">
            <div className='user'>
                <div
                    className="avatar-circle"
                    style={{ backgroundColor: getColor() }}
                >
                    {firstLetter}
                </div>
                <p>{displayName}</p>
            </div>
            <div className='icons'>
                <FontAwesomeIcon 
                    icon={faRightFromBracket} 
                    onClick={handleLogout} 
                    title="Logout" 
                    style={{ cursor: 'pointer', fontSize: '20px' }} 
                />
            </div>
        </div>
    )
}