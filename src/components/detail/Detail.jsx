import { useDispatch } from 'react-redux';
import './detail.css'
import { logout } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function Detail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase Auth
            dispatch(logout()); // Clear Redux state
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    }

    return (
        <div className="detail">
            <div className='user'>
                <img src="./avatar.png" alt="" />
                <p>John Doe</p>
            </div>
            <button className='block'>Block User</button>
            <button className='logout'  onClick={handleLogout}>Logout</button>
        </div>
    )
}