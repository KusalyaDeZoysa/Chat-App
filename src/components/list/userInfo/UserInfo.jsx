import { useSelector } from 'react-redux';
import './userInfo.css'

export default function UserInfo() {

    const { currentUser } = useSelector((state) => state.user);
    const displayName = currentUser.username;
    const firstLetter = displayName.charAt(0).toUpperCase();

    const getColor = () => {
        const colors = ["#FF6B6B", "#6B5BFF", "#FFD93D", "#4ECDC4", "#FF8C42", "#45B7D1"];
        return colors[displayName.length % colors.length];
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
                <img src="./more.png" alt='' img />
                <img src="./video.png" alt='' img />
                <img src="./edit.png" alt='' img />
            </div>
        </div>
    )
}