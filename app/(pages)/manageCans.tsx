import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import Sidebar from "@/app/components/Sidebar";
import * as Haptics from "expo-haptics";
import icons from "@/app/constants/icons";
import useFetch from "@/hooks/useFetch";
import {getUserCansForDay, updateCansDay} from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import {getWeekDay} from "@/services/utils";
import DayDropDown from "@/app/components/DayDropDown";
import Toast from "react-native-toast-message";

const manageCans = () => {
    const [showSideBar, setShowSideBar] = useState(false);
    const [activeTab, setActiveTab] = useState<"Manage"|"All Cans">("Manage");

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const { user } = useAuth();


    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDayToSwap, setSelectedDayToSwap] = useState<string>(getWeekDay(currentDate));
    const [selectedDayToSwapTo, setSelectedDayToSwapTo] = useState("")
    const selectedCans = useRef<Record<string, Record<string, any>>>({});
    const [_, forceUpdate] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const { data: cansData, isLoading: cansIsLoading, refetch } = useFetch(
        () => getUserCansForDay(user, selectedDayToSwap),
        [selectedDayToSwap]
    );

    useEffect(() => {
        const fetch = async () => {
            await refetch()
        }
        if(user && selectedDayToSwap) {
            fetch()
        }
    }, []);

    const handleSend = async () => {
        Toast.show({
            type: "success",
            text1: "Cans have been transferred",
            text2: "Refresh to view"
        })
        await updateCansDay(selectedDayToSwap, selectedDayToSwapTo, selectedCans, user?._id)
        selectedCans.current = {}
        await refetch()
    }

    return (
        <View className="flex-1 bg-lightBlue">
            {/* Sidebar */}
            {showSideBar && <Sidebar setShowSideBar={setShowSideBar} />}

            {/* Header */}
            <View className="flex-row mx-5 mt-20 items-center relative">
                <TouchableOpacity
                    className="w-12 h-12 bg-darkBlue rounded-full justify-center items-center"
                    onPress={() => {
                        setShowSideBar(!showSideBar);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                >
                    <Image source={icons.bars} className="size-6" tintColor="white" />
                </TouchableOpacity>
                <View className="absolute left-1/2 -translate-x-1/2">
                    <Text className="text-3xl font-semibold text-white">Manage Cans</Text>
                </View>
            </View>

            <View className="mx-5 mt-8 gap-y-4">
                {/* Dropdown */}
                <DayDropDown
                    selectedDay={selectedDayToSwap}
                    setSelectedDay={setSelectedDayToSwap}
                />

                {/* Cans List */}
                {cansIsLoading ? (
                    <View>
                        <ActivityIndicator size="large" color="#007bff" />
                    </View>
                ) : (
                    <View>
                        <Text className="text-2xl font-semibold text-white text-center my-2 capitalize">{`${selectedDayToSwap}'s Route`}</Text>
                        {cansData && cansData.length > 0 ? (
                            <>

                                <FlatList
                                    data={cansData}
                                    keyExtractor={(item: Record<string, any>) => item._id}
                                    style={{ maxHeight: 250 }}
                                    renderItem={({ item }) => {
                                        return (
                                            <View className="w-full bg-darkBlue rounded-2xl flex-row items-center justify-between px-4 py-3 shadow-sm shadow-black/20 mb-4">
                                                <TouchableOpacity
                                                    className="flex-row items-center gap-3"
                                                    onPress={() => {
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                        const isAlreadyAdded = selectedCans.current[`${item._id}`];
                                                        if (isAlreadyAdded) {
                                                            delete selectedCans.current[`${item._id}`];
                                                        } else {
                                                            selectedCans.current[`${item._id}`] = item;
                                                        }
                                                        forceUpdate((prev) => !prev);
                                                    }}
                                                >
                                                    <Image
                                                        source={icons.trash}
                                                        tintColor="white"
                                                        className="size-6"
                                                        resizeMode="contain"
                                                    />
                                                    <Text className="text-base text-white font-semibold flex-1">
                                                        {item.label}
                                                    </Text>
                                                    <View
                                                        className={`size-8 border-white border-2 rounded-full ${
                                                            selectedCans.current[`${item._id}`] && 'bg-white'
                                                        }`}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                />
                                <View className="mt-2 gap-4">
                                    <Text className="text-white font-semibold text-center text-2xl">Pick a new day for the cans</Text>
                                    <DayDropDown
                                        selectedDay={selectedDayToSwapTo}
                                        setSelectedDay={setSelectedDayToSwapTo}
                                    />
                                    <View className="items-center">
                                        <TouchableOpacity
                                            className="bg-green-600 px-2 py-4 w-52 rounded-full flex-row justify-center items-center gap-2"
                                            onPress={handleSend}
                                        >
                                                <Text className="text-2xl text-white font-semibold text-center">Send</Text>
                                                <Image
                                                    source={icons.send}
                                                    tintColor="white"
                                                    resizeMode="contain"
                                                    className="size-6"
                                                />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </>
                        ) : (
                            <View className="flex-row gap-1 justify-center items-center">
                                <Text className="text-white text-lg">You have no cans on</Text>
                                <Text className="text-white text-lg capitalize">{selectedDayToSwap}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

export default manageCans;
