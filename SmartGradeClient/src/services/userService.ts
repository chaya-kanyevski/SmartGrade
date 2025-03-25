import axios from "axios"

const API_URL = "https://localhost:7276/api/Auth"

export const login = async (email : string, password : string) => {
    try {
        const response = await axios.post(API_URL + '/login' , 
        {
            email,
            password
        });
        console.log('login successfully!')
        console.log(response.data)
        return response.data
    } catch(error){
        console.error("שגיאה בהתחברות", error);
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
        console.log('register successfully!')
        return response.data
    } catch(error){
        console.error("שגיאה בהרשמה", error);
    }
}