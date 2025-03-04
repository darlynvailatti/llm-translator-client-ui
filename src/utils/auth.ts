// Create an auth manager to retrieve and store the user's authentication state

import { getToken } from "../api/auth";


export interface LoginContext {
    username: string;
    password: string;
}

class AuthManager {
    
    async login(context: LoginContext) {
        const response = await getToken(context);
        localStorage.setItem("token", response.token);
    }
    
    logout() {
        localStorage.removeItem("token");
    }

    isAuthenticated(): boolean {
        return localStorage.getItem("token") != null;
    }
}

const authManager = new AuthManager();
export default authManager;