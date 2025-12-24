import { collection, query, where, getDocs } from 'firebase/firestore';
import './addUser.css'
import { db } from '../../config/firebase';
import { useState } from 'react';

export default function AddUser() {
    const [user, setUser] = useState(null);

    const getColor = (name) => {
        const colors = ["#FF6B6B", "#6B5BFF", "#FFD93D", "#4ECDC4", "#FF8C42", "#45B7D1"];
        return colors[name.length % colors.length];
    };

    const handleSearch = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target);
        const username = formData.get('username')

        try {
            const userRef = collection(db, "users")
            const q = query(userRef, where("username", "==", username))
            const querySnapshot = await getDocs(q)

            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
            }
        } catch (error) {
            console.log("Error searching user:", error)
        }
    }

    console.log("searched user:", user)
    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Username" name="username" />
                <button type="submit">Search</button>
            </form>
            {user && <div className='user'>
                <div className="detail">
                    <div
                        className="avatar-circle"
                        style={{ backgroundColor: getColor(user.username) }}
                    >
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <p>{user.username}</p>
                </div>
                <button>Add</button>
            </div>}
        </div>
    )
}