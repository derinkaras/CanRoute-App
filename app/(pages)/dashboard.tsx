import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Image, Pressable, Button, TouchableOpacity} from 'react-native';
import icons from "@/app/constants/icons";
import {useRouter} from "expo-router";
import Sidebar from "@/app/components/Sidebar";
import TodaysRoute from "@/app/components/TodaysRoute";

const dashboard = () => {
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const [moveSliderUp, setMoveSliderUp] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

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
    useEffect(() => {
        const timer = setInterval(()=>{
            setCurrentDate(new Date());
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    return (
        <View className="flex flex-1 bg-white">
            {showSideBar && (
                <Sidebar setShowSideBar={setShowSideBar} />
            )}
            <View className="flex-row mx-5 items-center relative mt-20">
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
            <View className="flex-1">
            </View>
            {moveSliderUp ? (
                <View className="absolute inset-0">
                    <Pressable
                        className="flex-1"
                        onPress={() => setMoveSliderUp(!moveSliderUp)}
                    />
                    <View
                        className="w-full h-1/2 bg-lightBlue absolute bottom-0 left-0 right-0 px-6"
                    >
                        <Text className="text-3xl font-semibold text-white text-center mt-6">Today's Route</Text>
                        <TodaysRoute date={weekdayMap[currentDate.getDay().toString() as keyof typeof weekdayMap]}/>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    className={"w-full h-32 bg-lightBlue absolute bottom-0 left-0 right-0"}
                    onPress={() => {
                        setMoveSliderUp(!moveSliderUp);
                    }}
                >
                    <Text className="text-3xl font-semibold text-white text-center mt-6">Today's Route</Text>

                </TouchableOpacity>
            )
            }

        </View>

    );
};
export default dashboard;
