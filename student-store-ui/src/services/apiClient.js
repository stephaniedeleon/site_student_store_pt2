import axios from "axios";

class ApiClient {

    constructor(remoteHostUrl) {

        this.remoteHostUrl = remoteHostUrl;
        this.token = null;
        this.tokenName = "student_store_token";
    }

    //utility method...
    async request({ endpoint, method = `GET`, data = {} }) {
        const url = `${this.remoteHostUrl}/${endpoint}`;
        const headers = {
            "Content-Type": "application/json"
        }
        if(this.token){
            headers["Authorization"] = `Bearer ${this.token}`;
        }

        try {
            const res = await axios({ url, method, data, headers }); //passing config methods to axios
            return { data: res.data, error: null };
        } catch (error) {
            const errorResponse = error?.response?.data?.error?.message;
            return { data: null, error: errorResponse || String(error) };
        }
    }

    async listProducts() {
        return await this.request({ endpoint: "store", method: "GET" });
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem(this.tokenName, token);
    }

    async fetchUserFromToken() {
        return await this.request({ endpoint: "auth/me/", method: "GET" });
    }

    async loginUser(credentials) { 
        return await this.request({ endpoint: "auth/login/", method: "POST", data: credentials });
    }

    async signupUser(credentials) { 
        return await this.request({ endpoint: "auth/register/", method: "POST", data: credentials }) ;
    }
}

export default new ApiClient(process.env.REACT_APP_REMOTE_HOST_URL || "http://localhost:3001");
