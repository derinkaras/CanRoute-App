import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import Toast from "react-native-toast-message";
import {useRouter} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {clearAsyncStorageExcept} from "@/services/cache";


// Basically the type of the value dict we're passing in AuthContext.Provider
type AuthContextType = {
    user: Record<string, any> | null; // You can replace `any` with a proper User interface
    token: string | null;
    loading: boolean;
    login: (name: string, email: string, password: string) => Promise<{success: boolean} | undefined>;
    signup: (name: string, email: string, password: string, userPayrollNumber: Number ) => Promise<{ success: boolean } | undefined>;
    logout: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined)



export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<Record<string, any> | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)
    const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password: string): boolean => password.length >= 6;
    const router = useRouter()

    useEffect(() => {
        if (user){
            router.replace("/(pages)/dashboard")
        }
    }, [user]);

    useEffect(() => {
        const persistUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            const storedToken = await AsyncStorage.getItem("token");
            setUser(parsedUser);
            setToken(storedToken);
        };
        persistUser();
        clearAsyncStorageExcept(["user", "token"])
    }, []);

    const signup = async (name: string, email: string, password: string, userPayrollNumber: Number) => {
        try {
            if (!name || !email || !userPayrollNumber) {
                Toast.show(
                    {
                        type: 'error',
                        text1: 'Invalid Input',
                        text2: 'Please fill all fields correctly',
                    }
                )
                return {success: false}
            } else if (!validateEmail(email)){
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Email Format',
                    text2: 'Please try again',
                })
                return {success: false}
            } else if (!validatePassword(password)) {
                Toast.show({
                    type: 'error',
                    text1: 'Password must be at least 6 characters',
                    text2: 'Please try again',
                })
                return {success: false}
            }

            setLoading(true)
            const response = await fetch("https://canroute.onrender.com/api/v1/users/sign-up", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": password,
                    "role": "crew",
                    "payrollNumber": userPayrollNumber,
                })
            })
            const result = await response.json()
            if (result.success === false) {
                let message: string;
                if (result.error.includes("Duplicate entry")){
                    message = "User with that payroll number already exists"
                } else {
                    message = result.error
                }
                Toast.show({
                    type: 'error',
                    text1: message,
                    text2: 'Please try again',
                })
                setLoading(false)
                return {success: false}
            }
            setUser(result.data.user)
            Toast.show({
                type: 'success',
                text1: 'Account Created',
                text2: 'Welcome to the app!',
            })
            setLoading(false)
            await AsyncStorage.setItem("user", JSON.stringify(result.data.user))
            await AsyncStorage.setItem("token", result.data.token)
            return {success: true}
        } catch (error: any) {
            setLoading(false)
            Toast.show({ type: 'error', text1: 'Sign Up Failed', text2: "Please try again" });
        }
    }

    const login = async (name: string, email: string, password: string) => {
        try {
            setLoading(true)
            if (!name || !email || !validateEmail(email) || !validatePassword(password)) {
                Toast.show(
                    {
                        type: 'error',
                        text1: 'Invalid Input',
                        text2: 'Please fill all fields correctly',
                    }
                )
                setLoading(false)
                return {success: false}
            }
            const response = await fetch("https://canroute.onrender.com/api/v1/users/sign-in", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                })
            })
            const result = await response.json()
            setUser(result.data.user)
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'Welcome back!',
            })
            setLoading(false)
            await AsyncStorage.setItem("user", JSON.stringify(result.data.user))
            await AsyncStorage.setItem("token", result.data.token)
            return {success: true}

        } catch (error: any) {
            setLoading(false)
            Toast.show({
                type: 'error',
                text1: "Incorrect email or password",
                text2: "Please try again",
            })
        }
    }
    const logout = async () => {
        try {
            setLoading(true)
            setUser(null)
            setToken(null)
            await AsyncStorage.removeItem("user")
            await AsyncStorage.removeItem("token")
            router.replace("/(onboarding)")
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout}}>
            {children}
        </AuthContext.Provider>
    );
};



export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error('useAuth must be used within the AuthContext');
   return context
}