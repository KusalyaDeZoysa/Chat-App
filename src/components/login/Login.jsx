import { toast } from 'react-toastify';
import './login.css'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useState } from 'react';

export default function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);

        if (!email || !password) {
            toast.error('Please fill all fields');
            return;
        } else {
            setLoading(true);
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                toast.success('Login successful');
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="login">
            <h1>Welcome back</h1>
            <form className='login-form' onSubmit={handleLogin}>
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <button type="submit" disabled={loading}>{loading? "Loading..." : "Login"}</button>
            </form>
            <p>Don't have an account?
                <button
                    className='register-button'
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </p>
        </div>
    )
}