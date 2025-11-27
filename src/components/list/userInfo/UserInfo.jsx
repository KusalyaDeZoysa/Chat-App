import './userInfo.css'

export default function UserInfo() {
    return (
        <div className="user-info">
            <div className='user'>
                <img src="./avatar.png" alt=''img/>
                <p>John Doe</p>
            </div>
            <div className='icons'>
                <img src="./more.png" alt=''img/>
                <img src="./video.png" alt=''img/>
                <img src="./edit.png" alt=''img/>
            </div>
        </div>
    )
}