import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator, FlatList} from 'react-native';
import Sidebar from "@/app/components/Sidebar";
import * as Haptics from "expo-haptics";
import icons from "@/app/constants/icons";
import useFetch from "@/hooks/useFetch";
import {getTransferRequests} from "@/services/api";
import {useAuth} from "@/contexts/AuthContext";

const notifications = () => {
    const [showSideBar, setShowSideBar] = useState(false);
    const [showTransferRequest, setShowTransferRequest] = useState(true);
    // @ts-ignore
    const {data: transferData, isLoading: transferLoading, error: transferError, refetch: refetchTransfer} = useFetch(() => getTransferRequests());
    const [transferToShowId, setTransferToShowId] = useState<number | null>(null);
    const [toggleOn, setToggleOn] = useState(false);
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
                    <Text className="text-3xl font-semibold text-white">Notifications</Text>
                </View>
            </View>
            <View className="flex-row mt-10 justify-around">
                <TouchableOpacity
                    className={`border-2 border-white ${showTransferRequest && "bg-green-600"}`}
                    onPress={async () => {
                        setShowTransferRequest(true);
                        await refetchTransfer();
                    }}
                >
                    <Text className="text-xl text-white font-semibold">Transfer Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`border-2 border-white ${!showTransferRequest && "bg-green-600"}`}
                    onPress={() => {
                        setShowTransferRequest(false);

                    }}
                >
                    <Text className="text-xl text-white font-semibold">Can Maintenance</Text>
                </TouchableOpacity>
            </View>
            {showTransferRequest ? (
                // This is the transfer section logic
                <>
                    {transferLoading ? (
                        <View className="items-center justify-center">
                            <ActivityIndicator size="large" color="#007bff" />
                        </View>
                    ):(
                        <View>
                            {transferData?.map((item: any, index: any) => (
                                <View key={index}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setTransferToShowId(item._id)
                                            setToggleOn(!toggleOn);
                                        }}
                                    >
                                        <View className="flex-row gap-2">
                                            <Text className="text-xl text-white">{item.fromName}</Text>
                                            <Text className="text-xl text-white">{item.toName}</Text>
                                        </View>
                                        {transferToShowId === item._id && toggleOn &&(
                                            <Text className="text-xl text-white">Nice show stuff here</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </>
            ): (
                // This is the can maintenance section logic
                <>
                </>
            )}


        </View>
    );
};

export default notifications;
