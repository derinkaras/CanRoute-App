import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import Sidebar from '@/app/components/Sidebar';
import * as Haptics from 'expo-haptics';
import icons from '@/app/constants/icons';
import useFetch from '@/hooks/useFetch';
import { acceptTransfer, deleteTransfer, getTransferRequests, getServiceNotifications } from '@/services/api';
import { getStatusColor } from "@/services/utils";
import CanModal from "@/app/components/CanModal";
import { useAuth } from "@/contexts/AuthContext";
import TransferModal from "@/app/components/TransferModal";
import Toast from "react-native-toast-message";
import NotificationModal from "@/app/components/NotificationModal";




const Notifications = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeTab, setActiveTab] = useState<'transfer' | 'maintenance'>('transfer');
    const [expandedRequestId, setExpandedRequestId] = useState("");
    const [currentCan, setCurrentCan] = useState({});
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();

    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);


    const {
        data: transferData,
        isLoading: transferLoading,
        error: transferError,
        refetch: refetchTransfer,
    } = useFetch(() => getTransferRequests());

    const {
        data: serviceData,
        isLoading: serviceLoading,
        error: serviceError,
        refetch: refetchService,
    } = useFetch(() => getServiceNotifications());

    const handleTabSwitch = async (tab: 'transfer' | 'maintenance') => {
        setActiveTab(tab);
        if (tab === 'transfer') await refetchTransfer();
        else await refetchService();
    };

    useEffect(() => {
        if (user) {
            refetchTransfer();
        }
    }, []);

    return (
        <View className="flex-1 bg-lightBlue">
            {showSidebar && <Sidebar setShowSideBar={setShowSidebar} />}

            {/* Header */}
            <View className="flex-row mx-5 mt-20 items-center relative">
                <TouchableOpacity
                    className="w-12 h-12 bg-darkBlue rounded-full justify-center items-center"
                    onPress={() => {
                        setShowSidebar(!showSidebar);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                >
                    <Image source={icons.bars} className="size-6" tintColor="white" />
                </TouchableOpacity>
                <View className="absolute left-1/2 -translate-x-1/2">
                    <Text className="text-3xl font-semibold text-white">Notifications</Text>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row justify-center gap-4 mt-5">
                <TouchableOpacity
                    className={`px-4 py-2 rounded-full border-2 ${
                        activeTab === 'transfer' ? 'bg-green-600 border-green-600' : 'border-white'
                    }`}
                    onPress={() => handleTabSwitch('transfer')}
                >
                    <Text className="text-white font-semibold">Transfer Requests</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`px-4 py-2 rounded-full border-2 ${
                        activeTab === 'maintenance' ? 'bg-green-600 border-green-600' : 'border-white'
                    }`}
                    onPress={() => handleTabSwitch('maintenance')}
                >
                    <Text className="text-white font-semibold">Can Maintenance</Text>
                </TouchableOpacity>
            </View>

            <TransferModal showModal={showModal} setShowModal={setShowModal} can={currentCan} user={user} />
            <NotificationModal
                showModal={showNotificationModal}
                setShowModal={setShowNotificationModal}
                notification={selectedNotification}
                refetchService={refetchService}
            />

            {/* Content */}
            <View className="mx-5 mt-6 flex-1">
                {activeTab === 'transfer' ? (
                    transferLoading ? (
                        <ActivityIndicator className="mt-10" size="large" color="#007bff" />
                    ) : transferData?.length === 0 ? (
                        <Text className="text-white font-semibold text-xl text-center mt-20">No notifications</Text>
                    ) : (
                        <FlatList
                            data={transferData}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() =>
                                        setExpandedRequestId(expandedRequestId === item._id ? null : item._id)
                                    }
                                    className="bg-darkBlue rounded-2xl p-4 mb-4"
                                >
                                    <View className="flex-row justify-between">
                                        <Text className="text-white text-lg font-medium capitalize">
                                            From: {item.fromName}
                                        </Text>
                                        <Text className="text-white text-lg font-medium capitalize">
                                            To: {item.toName}
                                        </Text>
                                    </View>

                                    {expandedRequestId === item._id && item.cans && (
                                        <FlatList
                                            data={Object.entries(item.cans)}
                                            keyExtractor={([canId]) => canId}
                                            className="mt-4"
                                            renderItem={({ item }) => {
                                                const [canId, canData] = item;
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setCurrentCan(canData);
                                                            setShowModal(true);
                                                        }}
                                                        activeOpacity={0.85}
                                                        className="mt-2"
                                                    >
                                                        <View className="w-full bg-lightBlue rounded-2xl flex-row items-center justify-between px-4 py-3 shadow-sm shadow-black/20 mb-4">
                                                            <View className="flex-row items-center gap-3">
                                                                <Image
                                                                    source={icons.trash}
                                                                    tintColor="white"
                                                                    className="size-6"
                                                                    resizeMode="contain"
                                                                />
                                                                <Text className="text-base text-white font-semibold">
                                                                    {canData.label}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            }}
                                            ListFooterComponent={
                                                <View className="flex-row gap-4 justify-center items-center">
                                                    <TouchableOpacity
                                                        className="bg-green-600 rounded-2xl px-4 py-2"
                                                        onPress={async () => {
                                                            if (user?._id && expandedRequestId) {
                                                                await acceptTransfer(expandedRequestId, user._id);
                                                                await refetchTransfer();
                                                                Toast.show({
                                                                    type: 'success',
                                                                    text1: 'Accepted Transfer',
                                                                    text2: 'Cans were added to the day\'s route'
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <Text className="text-white font-semibold text-xl text-center">
                                                            Accept
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        className="bg-red-500 rounded-2xl px-4 py-2"
                                                        onPress={async () => {
                                                            await deleteTransfer(expandedRequestId);
                                                            await refetchTransfer();
                                                        }}
                                                    >
                                                        <Text className="text-white font-semibold text-xl text-center">
                                                            Decline
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    )
                ) : serviceLoading ? (
                    <ActivityIndicator className="mt-10" size="large" color="#007bff" />
                ) : serviceData?.length === 0 ? (
                    <Text className="text-white font-semibold text-xl text-center mt-20">
                        No maintenance reports
                    </Text>
                ) : (
                    <FlatList
                        data={serviceData}
                        keyExtractor={(item) => item._id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedNotification(item);
                                    setShowNotificationModal(true);
                                }}
                                className="bg-darkBlue rounded-2xl p-4 mb-4"
                            >
                                <Text className="text-white font-semibold mb-2">Message:</Text>
                                <Text className="text-gray-300 italic">{item.message}</Text>

                                {item.photoUrl && (
                                    <Image
                                        source={{ uri: `https://canroute.onrender.com${item.photoUrl}` }}
                                        className="w-full h-40 mt-3 rounded-lg"
                                        resizeMode="cover"
                                    />
                                )}

                                <Text className="text-sm text-gray-400 mt-3">
                                    Submitted: {new Date(item.createdAt).toLocaleString()}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default Notifications;
