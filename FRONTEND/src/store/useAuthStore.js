import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE == "development" ? "http://localhost:5001/api" : "/";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth", error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            set({ authUser: res.data })
            toast.success("Account Created Succesfully!");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },
    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logout Successfully")
            get().disconnectSocket();
        } catch (error) {
            toast.error("Logout Error!")
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({ authUser: res.data });
            toast.success("Successfully Login!");
            get().connectSocket()
        } catch (error) {
            toast.error("Error during Login")
        } finally {
            set({ isLoggingIn: false })
        }
    },
    updateProfile: async (updatedProfileData) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/profile-update", updatedProfileData);
            set({ authUser: res.data })
            toast.success("Profile Updated Succesfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    connectSocket: () => {
        // console.log("jlajdflj")
        try {
        
            const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();
        set({ socket: socket });
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    

        } catch (error) {
           console.log(error) 
        }
        
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}))
