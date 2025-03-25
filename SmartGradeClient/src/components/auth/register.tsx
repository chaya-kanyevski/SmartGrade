import { FormEvent, useContext, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../../services/userService"
import { UserContext } from "../../context/UserReducer"

const Register = () => {
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate();
    const { userDispatch } = useContext(UserContext);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e : FormEvent) => {
        e.preventDefault();

        const name = nameRef.current?.value.trim();
        const email = emailRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();
        if (!email || !password || !name) {
            setError("יש למלא את כל השדות");
            return;
        }
        try{
            const response = await register(name, email, password, "User"); 
            const { token, user } = response; 
            console.log('tttt'+token)
            console.log('uuuu', user);
            localStorage.setItem("token", token);
    
            userDispatch({
                type: "REGISTER",
                data: user,
            });
            navigate("/")
        }catch (error){
            setError("התחברות נכשלה, בדוק את הנתונים ונסה שוב.");
            console.error("התחברות נכשלה", error);            
        }
    }
    return (
        <>
        <h2>הרשמה</h2>
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="name">שם:</label>
            <input type="text" id="name" ref={nameRef} required />
        </div>
        <div>
            <label htmlFor="email">אימייל:</label>
            <input type="email" id="email" ref={emailRef} required />
        </div>
        <div>
            <label htmlFor="password">סיסמה:</label>
            <input type="password" id="password" ref={passwordRef} required />
        </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">הרשם</button>
        </form>
        </>
    )
}
export default Register