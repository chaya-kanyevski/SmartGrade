import { FormEvent, useContext, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "20px auto" }}>
            <h2>התחברות</h2>
            <form onSubmit={handleSumbit}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>אימייל:</label>
                    <input type="email" id="email" ref={emailRef} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>סיסמה:</label>
                    <input type="password" id="password" ref={passwordRef} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
                {error && <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
                <button type="submit" style={{ width: "100%", padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    התחבר
                </button>
            </form>
            <p style={{ marginTop: "10px", textAlign: "center" }}>
                אין לך חשבון? <Link to="/register" style={{ color: "#007bff" }}>הרשם כאן</Link>
            </p>
        </div>
    );
};

export default Login;