import React, {useState} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, ActivityIndicator} from 'react-native';
import icons from "@/app/constants/icons";
import {useRouter} from "expo-router";
import CustomTextInput from "@/app/components/CustomTextInput";
import {useAuth} from "@/contexts/AuthContext";

const authentication = () => {
    const router = useRouter();
    const [userFullName, setUserFullName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPayrollNumber, setUserPayrollNumber] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const {user, loading, login, signup} = useAuth()

    return (

        <View
            className="flex-1 bg-darkBlue"
        >
            <SafeAreaView>
                <TouchableOpacity
                    onPress={() => {
                        router.back()
                    }}
                    className="ml-6 mt-6"
                >
                    <Image
                        source={icons.arrowLeft}
                        className="size-8"
                        resizeMode="contain"
                        tintColor="white"
                    />
                </TouchableOpacity>
                <View className="px-6 mt-12">
                    <Text className="text-3xl text-white font-bold">
                        {isSignUp ? "Let's\nGet Started" : "Hey,\nWelcome Back"}
                    </Text>
                    <Text className="text-lg text-gray-200 mt-8">{isSignUp ? "Create an account with your payroll number!" : "Login now to get back to work!"}</Text>
                    <View className="gap-2">
                        <CustomTextInput icon={icons.user} placeholder={"Enter your full name"} stateVar={userFullName} stateVarSetter={setUserFullName}/>
                        <CustomTextInput icon={icons.mail} placeholder={"Enter your email"} stateVar={userEmail} stateVarSetter={setUserEmail}/>
                        <CustomTextInput icon={icons.lock} placeholder={"Enter your password"} stateVar={userPassword} stateVarSetter={setUserPassword}/>
                        {isSignUp && (
                            <CustomTextInput icon={icons.hashtag} placeholder={"Enter your payroll numer"} stateVar={userPayrollNumber} stateVarSetter={setUserPayrollNumber}/>
                        )}

                        <View className="mt-4">
                            <TouchableOpacity
                                className="bg-lightBlue px-4 py-5 rounded-xl flex-row justify-center items-center gap-2"
                                onPress={async () => { isSignUp ?
                                    await signup(userFullName, userEmail, userPassword, Number(userPayrollNumber)) : await login(userFullName, userEmail, userPassword);
                                }}
                            >
                                <Text className="text-xl font-bold text-white text-center">{isSignUp ? "Sign Up": "Sign in"}</Text>
                                {loading && (
                                    <ActivityIndicator size="small" color="#007bff" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-row gap-2 justify-center items-center mt-10">
                        <Text className="text-gray-200">{isSignUp ? "Already have an account?" : "Don't have an account?"}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setIsSignUp(!isSignUp);
                            }}
                        >
                            <Text className="text-lightBlue font-semibold">{isSignUp ? "Sign In" : "Sign Up"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>



            </SafeAreaView>
        </View>
    );
};

export default authentication;
