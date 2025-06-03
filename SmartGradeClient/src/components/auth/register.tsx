import { FormEvent, useContext, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserReducer";
import { register } from "../../services/userService";
import LoginWithGoogle from "./loginWithGoogle";

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
                navigate("/dashboard");
        } catch (error) {
                 setError("ההרשמה נכשלה, בדוק את הנתונים ונסה שוב.");
                 console.error("ההרשמה נכשלה", error);

            }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">הרשמה</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1 text-right">שם מלא</label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            הרשם
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          כבר יש לך חשבון?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            התחבר כאן
          </Link>
        </p>

        <div className="mt-6">
          <LoginWithGoogle />
        </div>
      </div>
    </div>
  );
};

export default Register;



// import { FormEvent, useContext, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { register } from "../../services/userService";
// import { UserContext } from "../../context/UserReducer";
// import LoginWithGoogle from "./loginWithGoogle";

// const Register = () => {
//     const nameRef = useRef<HTMLInputElement>(null);
//     const emailRef = useRef<HTMLInputElement>(null);
//     const passwordRef = useRef<HTMLInputElement>(null);
//     const navigate = useNavigate();
//     const { userDispatch } = useContext(UserContext);
//     const [error, setError] = useState<string | null>(null);

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();

//         const name = nameRef.current?.value.trim();
//         const email = emailRef.current?.value.trim();
//         const password = passwordRef.current?.value.trim();
//         if (!email || !password || !name) {
//             setError("יש למלא את כל השדות");
//             return;
//         }
//         try {
//             const response = await register(name, email, password, "User");
//             const { token, user } = response;
//             console.log('tttt' + token);
//             console.log('uuuu', user);
//             localStorage.setItem("token", token);

//             userDispatch({
//                 type: "REGISTER",
//                 data: user,
//             });
//             navigate("/dashboard");
//         } catch (error) {
//             setError("ההרשמה נכשלה, בדוק את הנתונים ונסה שוב.");
//             console.error("ההרשמה נכשלה", error);
//         }
//     };

//     return (
//         <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "400px", margin: "20px auto" }}>
//             <h2>הרשמה</h2>
//             <form onSubmit={handleSubmit}>
//                 <div style={{ marginBottom: "10px" }}>
//                     <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>שם:</label>
//                     <input type="text" id="name" ref={nameRef} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
//                 </div>
//                 <div style={{ marginBottom: "10px" }}>
//                     <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>אימייל:</label>
//                     <input type="email" id="email" ref={emailRef} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
//                 </div>
//                 <div style={{ marginBottom: "10px" }}>
//                     <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>סיסמה:</label>
//                     <input type="password" id="password" ref={passwordRef} required style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }} />
//                 </div>
//                 {error && <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
//                 <button type="submit" style={{ width: "100%", padding: "10px 15px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
//                     הרשם
//                 </button>
//             </form>
//             <LoginWithGoogle />
//         </div>
//     );
// };

// export default Register;