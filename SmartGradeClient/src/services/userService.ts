import axios from "axios"

const API_URL = `${import.meta.env.VITE_REACT_APP_BASE_API_URL!}/Auth`;

export const login = async (email : string, password : string) => {
    try {
        const response = await axios.post(API_URL + '/login' , 
        {
            email,
            password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        console.log('login successfully!')
        console.log(response.data)
        return response.data
    } catch(error : any){
        console.error("שגיאה בהתחברות", error);
        throw error.response?.data || "ההתחברות נכשלה, בדוק את הנתונים ונסה שוב.";
    }
}

export const register = async (name : string, email : string, 
    password : string, role : string) => {
    try {
        const response = await axios.post(API_URL + '/register' , 
        {
            name,
            email,
            password,
            role
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        console.log('register successfully!')
        return response.data
    } catch(error: any) {
        console.error("שגיאה בהרשמה", error);
        throw error.response?.data || "ההרשמה נכשלה, בדוק את הנתונים ונסה שוב.";
    }
}

export const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await axios.post(API_URL + "/google", {
        idToken,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      console.log("login with google successfully!");
      return response.data;
    } catch (error) {
      console.error("שגיאה בהתחברות עם גוגל", error);
      throw error;
    }
};