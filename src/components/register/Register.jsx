import { useNavigate } from 'react-router-dom';
import './register.css'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // const [avatar, setAvatar] = useState({
    //     file: null,
    //     url: "",
    // });

    // const handleAvatarChange = (e) => {
    //     if (e.target.files[0]) {
    //         setAvatar({
    //             file: e.target.files[0],
    //             url: URL.createObjectURL(e.target.files[0]),
    //         });
    //     }
    // }

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);

        if (!username || !email || !password) {
            toast.error('Please fill all fields');
            return;
        } else {
            try {
                setLoading(true);
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                await setDoc(doc(db, "users", userCredential.user.uid), {
                    username: username,
                    email: email,
                    id: userCredential.user.uid,
                    blocked: []
                })

                await setDoc(doc(db, "userchats", userCredential.user.uid), {
                    chats: []
                })

                toast.success('Registered successfully! Please login to continue');
                navigate('/');
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="register">
            <h1>Create new account</h1>
            <form className='register-form' onSubmit={handleRegister}>
                <input type="text" placeholder="Username" name="username" />
                <input type="email" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                {/* <label htmlFor="file">
                    <img src={avatar.url || "./avatar.png"} alt="avatar" />
                    Upload an image
                </label>
                <input type="file" id="file" style={{ display: 'none' }} onChange={handleAvatarChange} /> */}
                <button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
            </form>
            <p>Already have an account?
                <button
                    className='login-button'
                    onClick={() => navigate('/')}
                >
                    Login
                </button>
            </p>
        </div>
    )
}