export type User = {
    email : string,
    password : string
}

class AuthStore {
    private user : User | null = null
    private isLoggedIn : boolean = false

    login(user : User) {
        this.user = user;
        this.isLoggedIn = true;
    }

    register(user : User) {
        this.user= user;
        this.isLoggedIn = true;
    }

    logout() {
        this.user = null;
        this.isLoggedIn = false;
    }

    getUser() {
        return this.user;
    }

    getIsLoggedIn() {
        return this.isLoggedIn;
    }
}
export default AuthStore