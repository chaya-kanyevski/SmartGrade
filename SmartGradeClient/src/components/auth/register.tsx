import { FormEvent, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/userService";
import { UserContext } from "../../context/UserReducer";

const Register = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { userDispatch } = useContext(UserContext);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const name = nameRef.current?.value.trim();
        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();
        if (!email || !password || !name) {
            setError("יש למלא את כל השדות");
            return;
        }
        try {
            const response = await register(name, email, password, "User");
            const { token, user } = response;
            console.log('tttt' + token);
            console.log('uuuu', user);
            localStorage.setItem("token", token);

            userDispatch({
                type: "REGISTER",
                data: user,
            });
            navigate("/");
        } catch (error) {
            setError("ההרשמה נכשלה, בדוק את הנתונים ונסה שוב.");
            console.error("ההרשמה נכשלה", error);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "20px auto" }}>
            <h2>הרשמה</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>שם:</label>
                    <input type="text" id="name" ref={nameRef} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
                </div>
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
                    הרשם
                </button>
            </form>
        </div>
    );
};

export default Register;