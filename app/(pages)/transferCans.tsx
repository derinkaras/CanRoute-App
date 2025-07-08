import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import Sidebar from '@/app/components/Sidebar';
import icons from '@/app/constants/icons';
import useFetch from "@/hooks/useFetch";
import {addTransfer, checkIfEmailExists, getUserCansForDay} from "@/services/api";
import {useAuth} from "@/contexts/AuthContext";
import {getStatusColor} from "@/services/utils";
import * as Haptics from 'expo-haptics';
import Toast from "react-native-toast-message";

const transferCans = () => {
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const [personToTransferTo, setPersonToTransferTo] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const {user} = useAuth();

    const weekdayMap = {
        "0": "Sunday",
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
    }

    const [currentDate, setCurrentDate] = useState(new Date());
    // @ts-ignore
    const [selectedDay, setSelectedDay] = useState<string>(weekdayMap[currentDate.getDay()]);

    useEffect(() => {
        const timer = setInterval(()=>{
            setCurrentDate(new Date());
        }, 60000)
        return () => clearInterval(timer)
    }, [])


    // @ts-ignore
    const { data: cansData, isLoading: cansIsLoading, error } = useFetch( () => getUserCansForDay(user, selectedDay), [selectedDay]);
    const selectedCans = useRef<Record<string, Record<string, any>>>({})
    const [_, forceUpdate] = useState(false)


    const handleSend = async () => {

            if (!personToTransferTo){
                Toast.show(
                    {
                        type: 'error',
                        text1: 'Must provide email',
                        text2: 'Please try again',
                    }
                )
                return
            }
            if (Object.keys(selectedCans.current).length === 0) {
                Toast.show(
                    {
                        type: 'error',
                        text1: 'Atleast one can must be selected',
                        text2: 'Please try again',
                    }
                )
                return
            }
            const toUser = await checkIfEmailExists(personToTransferTo)
            if (!toUser.success) {
                Toast.show(
                    {
                        type: 'error',
                        text1: 'There is no user with that email',
                        text2: 'Please try again',
                    }
                )
                return
            } else {
                Toast.show(
                    {
                        type: 'success',
                        text1: 'Transfer Request Sent',
                        text2: 'Awaiting acceptance',
                    }
                )

            }


        const transferObj = await addTransfer(
            {
                fromName: user?.name,
                toName: toUser.data.name,
                fromId: user?._id,
                toId: toUser.data._id,
                cans: selectedCans.current,
            }
        )

    }


    return (
        <View className="flex-1 bg-lightBlue">
            {/* Sidebar */}
            {showSideBar && <Sidebar setShowSideBar={setShowSideBar} />}

            {/* Header */}
            <View className="flex-row mx-5 items-center relative mt-20">
                <TouchableOpacity
                    className="w-12 h-12 bg-darkBlue rounded-full justify-center items-center"
                    onPress={() => {
                        setShowSideBar(!showSideBar)
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                >
                    <Image source={icons.bars} className="size-6" tintColor="white" />
                </TouchableOpacity>
                <View className="absolute left-1/2 -translate-x-1/2 items-center">
                    <Text className="text-3xl font-semibold text-white">Transfer Cans</Text>
                </View>
            </View>

            <View className="mx-5 mt-8 gap-y-4">
                {/* Email Input */}
                <View className="flex-row items-center bg-darkBlue rounded-2xl px-4 gap-2">
                    <Image source={icons.user} className="size-6" tintColor="white" resizeMode="contain"/>
                    <TextInput
                        value={personToTransferTo}
                        onChangeText={setPersonToTransferTo}
                        placeholder="Enter crew member's email"
                        className="flex-1 text-white"
                        placeholderTextColor="rgba(255, 255, 255, 0.7)"
                        style={{ height: 50 }}
                    />
                </View>

                {/* Dropdown */}
                <TouchableOpacity
                    className="flex-row items-center bg-darkBlue rounded-2xl py-2 px-4 gap-2"
                    style={{ height: 50 }}
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Image source={icons.calendar} className="size-6" tintColor="white" />
                    <Text className="text-white flex-1 capitalize">{selectedDay}</Text>
                    <Image
                        source={icons.chevronDown}
                        className={`size-4 ${showDropdown ? 'rotate-180' : ''}`}
                        tintColor="white"
                    />
                </TouchableOpacity>

                {/* Options list (dropdown items) */}
                {showDropdown && (
                    <View className="bg-darkBlue rounded-2xl mt-1">
                        {days.map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedDay(day);
                                    setShowDropdown(false);
                                }}
                                className={`px-4 py-3 ${day !== 'sunday' ? "border-b border-white/10" : ""}`}

                            >
                                <Text className="text-white capitalize">{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {cansIsLoading ?  (
                    <View>
                        <ActivityIndicator
                            size="large"
                            color="#007bff"
                        />
                    </View>
                ) : (
                    <View>
                        <Text className="text-3xl font-semibold text-white text-center my-5 capitalize">{`${selectedDay}'s Route`}</Text>
                        {cansData && cansData.length > 0 ? (<FlatList
                            data={cansData}
                            keyExtractor={(item: Record<string, any>) => item._id}
                            style={{
                                maxHeight: 450
                            }}
                            renderItem={({item}) => {
                                return (
                                    <View>
                                        <View
                                            className="w-full bg-darkBlue rounded-2xl flex-row items-center justify-between px-4 py-3 shadow-sm shadow-black/20 mb-4">
                                            <TouchableOpacity
                                                className="flex-row items-center gap-3"
                                                onPress={() => {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                                    const isAlreadyAdded = selectedCans.current[`${item._id}`]
                                                    if (isAlreadyAdded) {
                                                        delete selectedCans.current[`${item._id}`]
                                                    } else {
                                                        selectedCans.current[`${item._id}`] = item
                                                    }
                                                    forceUpdate(prev => !prev)
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
                                                    className={`size-8 border-white border-2 rounded-full ${selectedCans.current[`${item._id}`] && 'bg-white'}`}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                            showsVerticalScrollIndicator={false}
                        />): (
                            <View className="flex-row gap-1 justify-center items-center">
                                <Text className="text-white text-lg ">You have no cans on</Text>
                                <Text className="text-white text-lg capitalize">{selectedDay}</Text>
                            </View>
                        )}
                        {cansData && cansData.length > 0 && (<View
                            className="items-center"
                        >
                            <TouchableOpacity
                                className="bg-green-600 px-2 py-4 w-52 my-6 rounded-full"
                                onPress={handleSend}
                            >
                                <View className="flex-row gap-2 justify-center items-center">
                                    <Text className="text-2xl text-white font-semibold text-center">Send</Text>
                                    <Image
                                        source={icons.send}
                                        tintColor="white"
                                        resizeMode="contain"
                                        className="size-6"
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>)
                        }
                    </View>

                )
                }



            </View>
        </View>
    );
};

export default transferCans;
