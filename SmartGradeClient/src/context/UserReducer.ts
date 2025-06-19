import { Dispatch, createContext } from "react";
import { User } from "../models/User"

type Action = {
    type : 'REGISTER',
    data : Partial<User>
} |  {
    type : 'LOGIN',
    data : Partial<User>
} | {
    type : 'UPDATE',
    data : Partial<User>
} | {
    type : 'LOG_OUT'
} | {
    type : 'GET_USER'
}

export default (state : User, action : Action): User => {
    switch (action.type){
        case 'REGISTER':
            return {
                ...state,
                ...action.data
            };
        case 'LOGIN':    
        console.log('action data:', action.data); 
        const newState = { ...state, ...action.data };
        console.log('new state:', newState)
            return {
                ...state,
                ...action.data
            };
        case 'UPDATE':
            return {
                ...state,
                ...action.data
            }
        case 'LOG_OUT':
            return initialUser;
        default:
            return state;
    }
}

export const initialUser: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: '',
    files: []
};

export const UserContext = createContext<{
    user : User;
    userDispatch: Dispatch<Action>
}>({
    user : initialUser,
    userDispatch: () => null
});