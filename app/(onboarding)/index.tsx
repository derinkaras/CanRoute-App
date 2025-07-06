import React, {useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import images from '@/app/constants/images';
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
    const router = useRouter();
    const [initializing, setInitializing] = useState(true);

    setTimeout(() => setInitializing(false), 1000);

    if (initializing) {
        return (
            <View className="flex-1 justify-center items-center bg-lightBlue">
                <ActivityIndicator
                    size="large"
                    color="#007bff"
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-lightBlue">
            <SafeAreaView className="flex-1">
                {/* Top Image Section */}
                <View className="justify-start items-center px-6 mt-40">
                    <Image
                        source={images.workers}
                        className="w-full h-72"
                        resizeMode="contain"
                    />
                </View>
            </SafeAreaView>

            {/* Bottom Section */}
            <View className="relative bg-darkBlue mt-32 shadow-xl shadow-white flex-1">
                <View className="px-6 gap-y-8 w-full items-center mt-14">
                    <Text className="text-4xl text-white font-bold text-center">
                        Welcome to CanRoute!
                    </Text>
                    <Text className="text-white text-center text-base px-4">
                        Your all-in-one tool for public waste servicing.{"\n"}
                        Navigate routes, log service, and stay organized on the go.
                    </Text>

                    <View className="w-full">
                        <TouchableOpacity
                            className="bg-lightBlue py-6 rounded-xl active:bg-neutral-800"
                            onPress={() => {
                                router.push('/authentication');
                            }}
                        >
                            <Text className="text-white text-2xl font-semibold text-center">
                                Get Started
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Index;
