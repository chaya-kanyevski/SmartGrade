// src/components/LoginWithGoogle.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginWithGoogle: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // const result = await signInWithPopup(auth, provider);
      // const user = result.user;
      // console.log("Signed in user:", user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center w-full px-6 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition duration-200"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        className="w-5 h-5 ml-4" 
      />
      <span className="text-gray-700 font-medium">התחברות עם גוגל</span>
    </button>
  );
};

export default LoginWithGoogle;




// // src/components/LoginWithGoogle.tsx
// import React from "react";
// // import { signInWithPopup } from "firebase/auth";
// // import { auth, provider } from "../../firebase";
// import { useNavigate } from "react-router-dom";


// const LoginWithGoogle: React.FC = () => {
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       // const result = await signInWithPopup(auth, provider);
//       // const user = result.user;
//       // console.log("Signed in user:", user);
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Error signing in with Google:", error);
//     }
//   };

//   return (
//     <button onClick={handleLogin}>
//       Sign in with Google
//     </button>
//   );
// };

// export default LoginWithGoogle;
