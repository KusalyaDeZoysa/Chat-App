import './detail.css'

export default function Detail() {
    return (
        <div className="detail">
            <div className='user'>
                <img src="./avatar.png" alt="" />
                <p>John Doe</p>
            </div>
            <button className='block'>Block User</button>
            <button className='logout'>Logout</button>
        </div>
    )
}