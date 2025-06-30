import React, {useState} from 'react';
import {View, Text, SafeAreaView, Image, Pressable, Button, TouchableOpacity} from 'react-native';
import icons from "@/app/constants/icons";
import {useRouter} from "expo-router";
import Sidebar from "@/app/components/Sidebar";

const dashboard = () => {
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const currentDate = new Date();
    const weekdayMap = {
        "0": "Sunday",
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
    }
    const monthMap = {
        "0": "January",
        "1": "February",
        "2": "March",
        "3": "April",
        "4": "May",
        "5": "June",
        "6": "July",
        "7": "August",
        "8": "September",
        "9": "October",
        "10": "November",
        "11": "December",
    }

    return (
        <View className="flex flex-1 bg-white">
            {showSideBar && (
                <Sidebar setShowSideBar={setShowSideBar} />
            )}
            <View className="flex-row mx-5 mt-8 items-center relative mt-20">
                <TouchableOpacity
                    className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden justify-center items-center z-0"
                    onPress={() => setShowSideBar(!showSideBar)}
                >
                    <Image
                        source={icons.bars}
                        className="size-6"
                        tintColor="#085484"
                    />
                </TouchableOpacity>
                <View className="absolute left-1/2 -translate-x-1/2 items-center">
                    <Text className=" font-semibold text-3xl text-lightBlue">
                        {weekdayMap[currentDate.getDay().toString() as keyof typeof weekdayMap]}
                    </Text>
                    <View className="flex-row gap-2">
                        <Text className=" font-semibold text-base text-lightBlue">
                            {monthMap[currentDate.getMonth().toString() as keyof typeof monthMap]}
                        </Text>
                        <Text className=" font-semibold text-base text-lightBlue">
                            {currentDate.getDate().toString()}
                        </Text>
                    </View>
                </View>
            </View>
            <View className="flex-1"></View>
            <TouchableOpacity
                className="w-full h-32 bg-lightBlue focus:bg-darkBlue"
            >
            </TouchableOpacity>

        </View>

    );
};
export default dashboard;
