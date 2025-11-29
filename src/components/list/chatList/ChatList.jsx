import { useState } from "react"
import "./chatList.css"
import AddUser from "../../addUser/AddUser"

export default function ChatList() {
    const [addMode, setAddMode] = useState(false)
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
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div>
            <div className="item">
                <img src="./avatar.png" alt="" />
                <div className="info">
                    <span>John Doe</span>
                    <p>Last message</p>
                </div>
            </div>
            {addMode && <AddUser/>}
        </div>
    )
}
