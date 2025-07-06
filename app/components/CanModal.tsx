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




const CanModal = ({
                      showModal,
                      setShowModal,
                      can,
                      user,
                      setPinLocation,
                      setMoveSliderUp,
                      setActiveMarkerLabel
                  }: any) => {

    const [confrim, setConfrim] = useState(false);
    const [currentCanServiceStatus, setCurrentCanServiceStatus] = useState("unserviced");
    const [illegalDumping, setIllegalDumping] = useState(false);
    const { serviceLogsOfWeek, setServiceLogsOfWeek } = useServiceLog();
    const [serviceData, setServiceData] = useState<ServiceLog | null>();

    useEffect(() => {
        if (serviceLogsOfWeek && can) {
            // The date makes sure if a can is serviced twice this week i.e the second time + it gets the can which was serviced today
            const specificCanService = serviceLogsOfWeek.find(log => (log.canId === can._id) && (log.servicedDate === new Date().toISOString().split("T")[0]) );

            if (specificCanService) {
                setServiceData(specificCanService);
                setCurrentCanServiceStatus(specificCanService.status);
                setIllegalDumping(specificCanService.illegalDumping);
            } else {
                setServiceData(null);
                setCurrentCanServiceStatus("unserviced");
                setIllegalDumping(false);
            }
        }
    }, [serviceLogsOfWeek, can]);

    const confirmServiceLog = async () => {
        const todayDate = new Date().toISOString().split("T")[0];
        const logExists = serviceLogsOfWeek.find(log => (log.canId === can._id) && (log.servicedDate === todayDate));

        if (logExists) {
            const newServiceData = {
                ...logExists,
                status: currentCanServiceStatus,
                illegalDumping: illegalDumping
            };

            await updateUserServiceLog(newServiceData, can._id, user._id, getWeekOf(new Date()));

            const removedServiceLogsOfWeek = serviceLogsOfWeek.filter(log => {
                if ( (log.canId === can._id) && (log.servicedDate === todayDate) ) return false
                return true;
            })

            const updatedLogs = [
                ...removedServiceLogsOfWeek,
                newServiceData
            ]

            setServiceLogsOfWeek(updatedLogs);
            await addToCache(`${user._id}-serviceLogs-${getWeekOf(new Date())}`, updatedLogs);

        } else {
            const newServiceData = {
                canId: can._id,
                userId: user._id,
                weekOf: getWeekOf(new Date()),
                status: currentCanServiceStatus,
                servicedAt: new Date(),
                servicedDate: todayDate,
                illegalDumping: illegalDumping
            };

            const createdLog = await addUserServiceLog(newServiceData); // Ideally return the full log from API
            const updatedLogs = [...serviceLogsOfWeek, newServiceData];
            setServiceLogsOfWeek(updatedLogs);
            await addToCache(`${user._id}-serviceLogs-${getWeekOf(new Date())}`, updatedLogs);
        }
    };

    const closeModal = () => setShowModal(false);

    const handleDirections = () => {
        setPinLocation({
            latitude: can.location.latitude,
            longitude: can.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        })
        closeModal();
        setMoveSliderUp(false);
        setActiveMarkerLabel(can.label)
    };

    const handleOpenMap = () => {
        if (can){
            openMaps(can.location.latitude, can.location.longitude, can.label)
        }
    }

    const handleServiceStatusChange = async (status: string) => {
        switch (status) {
            case 'Serviced':
                setCurrentCanServiceStatus('serviced');
                break;
            case 'Not Needed':
                setCurrentCanServiceStatus('not_needed');
                break;
            case 'Unserviced':
                setCurrentCanServiceStatus('unserviced');
                break;
        }
    };

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

                    <View
                        className="flex-row gap-4"
                    >
                        <TouchableOpacity
                            onPress={handleOpenMap}
                            className="items-center gap-2"
                            activeOpacity={0.8}
                        >
                            <Image
                                source={icons.route}
                                className="size-8"
                                resizeMode="contain"
                                tintColor="#193a5a"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleDirections}
                            className="items-center gap-2"
                            activeOpacity={0.8}
                        >
                            <Image
                                source={icons.search}
                                className="size-8"
                                resizeMode="contain"
                                tintColor="#193a5a"
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="w-full h-40 rounded-md justify-center items-center">
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
                                            latitude: can.location.latitude,
                                            longitude: can.location.longitude,
                                        }}
                                        title={can.label}
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

                    <View className={`mt-3 px-4 py-2 rounded-full ${getStatusColor(currentCanServiceStatus)}`}>
                        <Text className="text-white font-semibold text-sm">
                            Current Status: {currentCanServiceStatus === "serviced" ? "Serviced" :
                                            currentCanServiceStatus === "not_needed" ? "Not Needed" :
                                            currentCanServiceStatus === "unserviced" && "Unserviced"}
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-4 mt-2">
                        <Text className="text-base font-semibold text-darkBlue">
                            Illegal Dumping?
                        </Text>
                        <Switch
                            value={illegalDumping}
                            onValueChange={setIllegalDumping}
                            trackColor={{ false: '#ccc', true: '#EF4444' }}
                            thumbColor={illegalDumping ? '#991B1B' : '#f4f3f4'}
                        />
                    </View>

                    <View className="flex-row justify-between gap-2 mt-4">
                        <TouchableOpacity
                            className="bg-green-600 px-4 py-2 rounded-2xl"
                            onPress={() => handleServiceStatusChange('Serviced')}
                        >
                            <Text className="text-base text-white">Serviced</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-orange-500 px-4 py-2 rounded-2xl"
                            onPress={() => handleServiceStatusChange('Not Needed')}
                        >
                            <Text className="text-base text-white">Not needed</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-red-500 px-4 py-2 rounded-2xl"
                            onPress={() => handleServiceStatusChange('Unserviced')}
                        >
                            <Text className="text-base text-white">Unserviced</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        className="mt-4 w-full bg-green-600 py-3 rounded-xl flex-row items-center justify-center gap-2"
                        activeOpacity={0.8}
                        onPress={async () => {
                            setShowModal(false);
                            await confirmServiceLog();
                        }}
                    >
                        <Text className="text-white font-semibold text-base">Confirm Changes</Text>
                        <Image
                            source={icons.check}
                            resizeMode="contain"
                            className="w-6 h-6"
                            tintColor="#fff"
                        />
                    </TouchableOpacity>


                </View>
            </View>
        </Modal>
    );
};

export default CanModal;
