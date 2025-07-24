import React, { useEffect, useState } from 'react';
import {
    View, Text, Modal, Pressable, TouchableOpacity, Image, ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';
import icons from '@/app/constants/icons';
import { openMaps } from '@/services/map';
import { getCanById, deleteServiceNotification } from '@/services/api';

const NotificationModal = ({
                               showModal,
                               setShowModal,
                               notification,
                               refetchService
                           }: {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    notification: any;
    refetchService: any

}) => {
    const [can, setCan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const closeModal = () => setShowModal(false);

    useEffect(() => {
        const fetchCan = async () => {
            if (notification?.canId) {
                try {
                    setLoading(true);
                    const canData = await getCanById(notification.canId); // implement this API call
                    setCan(canData);
                } catch (err) {
                    console.error("Failed to fetch can", err);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (showModal) fetchCan();
    }, [notification, showModal]);

    const handleOpenMap = () => {
        if (can?.location) {
            openMaps(can.location.latitude, can.location.longitude, can.label);
        }
    };

    const handleMarkServiced = async () => {
        try {
            await deleteServiceNotification(notification._id);
            refetchService()
            setShowModal(false);
        } catch (error) {
            console.error("Failed to mark serviced", error);
        }
    };

    return (
        <Modal
            transparent
            animationType="fade"
            visible={showModal}
            onRequestClose={closeModal}
        >
            <View className="flex-1 justify-center items-center">
                <Pressable
                    className="absolute inset-0 bg-darkBlue opacity-70"
                    onPress={closeModal}
                />

                <View className="bg-white w-96 rounded-2xl p-6 items-center gap-5 z-10">
                    {loading ? (
                        <ActivityIndicator size="large" color="#193a5a" />
                    ) : (
                        <>
                            <Text className="text-darkBlue font-bold text-xl text-center">
                                {can?.label}
                            </Text>
                            <Text className="text-base text-center text-black">
                                {notification.message}
                            </Text>

                            {notification.photoUrl && (
                                <Image
                                    source={{ uri: `https://canroute.onrender.com${notification.photoUrl}` }}
                                    style={{ width: 180, height: 180, borderRadius: 8 }}
                                    resizeMode="cover"
                                />
                            )}

                            <View className="w-full h-40 rounded-md overflow-hidden">
                                <MapView
                                    style={{ width: "100%", height: "100%" }}
                                    initialRegion={{
                                        latitude: can.location.latitude,
                                        longitude: can.location.longitude,
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005,
                                    }}
                                >
                                    <Marker
                                        coordinate={{
                                            latitude: can.location.latitude,
                                            longitude: can.location.longitude,
                                        }}
                                        title={can.label}
                                    >
                                        <Image
                                            source={icons.trash}
                                            resizeMode="contain"
                                            style={{ width: 30, height: 30, tintColor: '#085484' }}
                                        />
                                    </Marker>
                                </MapView>
                            </View>

                            <View className="flex-row gap-4 mt-4">
                                <TouchableOpacity
                                    className="bg-blue-700 px-4 py-2 rounded-xl"
                                    onPress={handleOpenMap}
                                >
                                    <Text className="text-white font-semibold">Open in Maps</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="bg-green-600 px-4 py-2 rounded-xl"
                                    onPress={handleMarkServiced}
                                >
                                    <Text className="text-white font-semibold">Mark as Serviced</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default NotificationModal;
