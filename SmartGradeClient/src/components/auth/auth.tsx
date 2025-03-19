import { useNavigate } from "react-router-dom";

const Auth = () => {
    const navigate = useNavigate();
    return (
        <>
            <button onClick={() => navigate('/login')}>להתחברות</button>
            <button onClick={() => navigate('/register')}>להרשמה</button>
        </>
    )
} 
export default Auth