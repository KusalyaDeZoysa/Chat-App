import { toast } from 'react-toastify';
import './login.css'
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        toast.success('Login successful');
    }

    return (
        <div className="login">
            <h1>Welcome back</h1>
            <form className='login-form' onSubmit={handleLogin}>
                <input type="text" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
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