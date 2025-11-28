import './addUser.css'

export default function AddUser() {
    return (
        <div className="addUser">
            <form>
                <input type="text" placeholder="Username" name="username" />
                <button type="search">Search</button>
            </form>
            <div className='user'>
                <div className="detail">
                    <img src="./avatar.png" alt="" />
                    <p>John Doe</p>
                </div>
                <button>Add</button>
            </div>
        </div>
    )
}