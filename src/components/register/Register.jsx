import { useNavigate } from 'react-router-dom';
import './register.css'
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Register() {

    const navigate = useNavigate();

    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    }

    const handleRegister = (e) => {
        e.preventDefault();
        toast.success('Registered successfully');
    }

    return (
        <div className="register">
            <h1>Create new account</h1>
            <form className='register-form' onSubmit={handleRegister}>
                <input type="text" placeholder="Username" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <label htmlFor="file">
                    <img src={avatar.url || "./avatar.png"} alt="avatar" />
                    Upload an image
                </label>
                <input type="file" id="file" style={{ display: 'none' }} onChange={handleAvatarChange} />
                <button type="submit">Register</button>
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