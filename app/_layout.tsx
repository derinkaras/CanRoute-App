import { Stack } from "expo-router";
import '../globals.css'
import {useState} from "react";
import Toast, { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';
import {AuthProvider} from "@/contexts/AuthContext";


const toastConfig = {
    success: (props: BaseToastProps) => (
        <BaseToast
            {...props}
            style={{
                backgroundColor: '#085484',
                borderLeftColor: '#22C55E',
                borderRadius: 12,
                elevation: 5,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 6,
            }}
            contentContainerStyle={{
                paddingHorizontal: 16,
                alignItems: 'center',
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
            }}
            text2Style={{
                fontSize: 14,
                color: '#e0f2f1',
                textAlign: 'center',
            }}
        />
    ),
    error: (props: BaseToastProps) => (
        <ErrorToast
            {...props}
            style={{
                backgroundColor: '#193a5a',
                borderLeftColor: '#EF4444',
                borderRadius: 12,
                elevation: 5,
                shadowColor: '#000',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 6,
            }}
            contentContainerStyle={{
                paddingHorizontal: 16,
                alignItems: 'center',
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
            }}
            text2Style={{
                fontSize: 14,
                color: '#f1f5f9',
                textAlign: 'center',
            }}
        />
    ),
};


export default function RootLayout() {
    return (
        <>
            <AuthProvider>
                <Stack>
                    <Stack.Screen
                        name="(pages)"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="(onboarding)"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack>
            </AuthProvider>
            <Toast
                position="top"
                visibilityTime={1000}
                topOffset={60}
                config={toastConfig}
            />
        </>
    );
    }
