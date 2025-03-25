import { FormEvent, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserReducer";
import { login } from "../../services/userService";

const Login = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { userDispatch } = useContext(UserContext); 
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleSumbit = async (e: FormEvent) => {
        e.preventDefault();
        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();
        if (!email || !password) {
            setError("יש למלא את כל השדות");
            return;
        }
        try {
            const response = await login(email, password); 
            const { token, user: serverUser } = response;  
            localStorage.setItem("token", token);
    
            userDispatch({
                type: "LOGIN",
                data: serverUser, 
            });
            navigate("/");
        } catch (error) {
            setError("התחברות נכשלה, בדוק את הנתונים ונסה שוב.");
            console.error("התחברות נכשלה", error);            
        }
    }

    return (
        <>
            <h2>התחברות</h2>
            <form onSubmit={handleSumbit}>
                <div>
                    <label htmlFor="email">אימייל:</label>
                    <input type="email" id="email" ref={emailRef} required />
                </div>
                <div>
                    <label htmlFor="password">סיסמה:</label>
                    <input type="password" id="password" ref={passwordRef} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">התחבר</button>
            </form>
        </>
    )
}

export default Login;
