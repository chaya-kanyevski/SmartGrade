import { FormEvent, useContext, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserReducer";
import { login } from "../../services/userService";
import LoginWithGoogle from "./loginWithGoogle";
import LoadingButton from "../ui/LoadingButton";

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim();
    const password = passwordRef.current?.value.trim();
    if (!email || !password) {
      setError("יש למלא את כל השדות");
      return;
    }
    setIsLoading(true);
    try {
      const response = await login(email, password);
      const { token, user: serverUser } = response;
      localStorage.setItem("token", token);
      userDispatch({ type: "LOGIN", data: serverUser });
      navigate("/dashboard");
    } catch (error) {
      setError("התחברות נכשלה, בדוק את הנתונים ונסה שוב.");
      console.error("התחברות נכשלה", error);
    }finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">התחברות</h2>
        <form onSubmit={handleSumbit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1 text-right">אימייל</label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1 text-right">סיסמה</label>
            <input
              type="password"
              id="password"
              ref={passwordRef}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <LoadingButton type="submit" isLoading={isLoading} className="w-full">
          התחבר
          </LoadingButton>

        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          אין לך חשבון?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            הרשם כאן
          </Link>
        </p>

        <div className="mt-6">
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
};

export default Login;