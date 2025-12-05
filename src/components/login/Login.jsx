import { toast } from 'react-toastify';
import './login.css'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../../redux/slices/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

export default function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        console.log(currentUser);
    },[currentUser])

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const {email, password} = Object.fromEntries(formData);

        if (!email || !password) {
            toast.error('Please fill all fields');
            return;
        } else {
            try {
                dispatch(loginStart());
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                
                // Fetch user data from Firestore
                const userDocRef = doc(db, "users", userCredential.user.uid);
                const userDocSnap = await getDoc(userDocRef);
                
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    dispatch(loginSuccess({
                        id: userCredential.user.uid,
                        username: userData.username,
                        email: userData.email,
                        blocked: userData.blocked || [],
                    }))
                    toast.success('Login successful');
                } else {
                    throw new Error('User data not found');
                }
            } catch (error) {
                console.log(error);
                dispatch(loginFailure(error.message));
                toast.error(error.message);
            } 
        }
    }

    return (
        <div className="login">
            <h1>Welcome back</h1>
            <form className='login-form' onSubmit={handleLogin}>
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <button type="submit" disabled={isLoading}>{isLoading ? "Loading..." : "Login"}</button>
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