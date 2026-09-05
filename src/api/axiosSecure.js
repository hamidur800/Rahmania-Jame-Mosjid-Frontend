import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

axiosSecure.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // সবসময় Fresh Firebase ID Token নেবে
        const token = await currentUser.getIdToken(true);

        config.headers.Authorization = `Bearer ${token}`;

        console.log("Token added successfully");
      } catch (error) {
        console.error("Token Error:", error);
      }
    } else {
      console.log("No Firebase user found");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosSecure;
