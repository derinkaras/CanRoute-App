import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    Image,
    TouchableOpacity,
    Switch,
} from 'react-native';
import icons from '@/app/constants/icons';
import useFetch from "@/hooks/useFetch";
import {
    addUserServiceLog,
    getUserServiceLogForCanAndWeek,
    updateUserServiceLog
} from "@/services/api";
import {getStatusColor, getWeekOf} from "@/services/utils";
import {useServiceLog} from "@/contexts/ServiceLogContext";
import {addToCache} from "@/services/cache";
import {INITIAL_REGION, openMaps} from "@/services/map";
import MapView, {Marker} from "react-native-maps";




const TransferModal = ({
                      showModal,
                      setShowModal,
                      can,
                      user,
                  }: any) => {

    const closeModal = () => setShowModal(false);

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={showModal}
            onRequestClose={closeModal}
        >
            <View className="flex-1 relative justify-center items-center">
                <Pressable
                    className="absolute inset-0 bg-darkBlue opacity-70 z-0"
                    onPress={closeModal}
                />
                <View className="bg-white w-96 h-auto z-5 rounded-2xl p-6 items-center gap-5">
                    <Text className="text-lightBlue font-semibold text-center text-xl">
                        {can && can.label}
                    </Text>

                    <View className="w-full h-72 rounded-md justify-center items-center">
                        {can?.location && (
                            <MapView
                                style={{width: "100%", height: "100%"}}
                                initialRegion={
                                    {
                                        latitude: can?.location.latitude,
                                        longitude: can?.location.longitude,
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005,
                                    }

                                }
                                showsUserLocation={true}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: can?.location.latitude,
                                        longitude: can?.location.longitude,
                                    }}
                                    title={can?.label}
                                >
                                    <Image
                                        source={icons.trash}
                                        resizeMode="contain"
                                        style={{
                                            width: 30,
                                            height: 30,
                                            tintColor:'#085484',

                                        }}
                                    />
                                </Marker>
                            </MapView>
                        )
                        }
                    </View>



                </View>
            </View>
        </Modal>
    );
};

export default TransferModal;
