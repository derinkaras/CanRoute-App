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
import {getWeekOf} from "@/services/utils";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'serviced': return 'bg-green-600';
        case 'not_needed': return 'bg-orange-500';
        case 'unserviced':
        default: return 'bg-red-500';
    }
};

interface serviceDataType {
    canId: number;
    userId: number;
    weekOf: Date;
    status: string;
    servicedAt: Date;
    illegalDumping: boolean;
    notes?: string;
}

const CanModal = ({
                      showModal,
                      setShowModal,
                      can,
                      user
                  }: any) => {
    const [currentCanServiceStatus, setCurrentCanServiceStatus] = useState("unserviced");
    const [illegalDumping, setIllegalDumping] = useState(false);
    // @ts-ignore
    const [serviceData, setServiceData] = useState<serviceDataType>({});

    useEffect(() => {
        if (user && can) {
            setServiceData({
                canId: can._id,
                userId: user._id,
                weekOf: getWeekOf(new Date()),
                status: currentCanServiceStatus,
                illegalDumping: illegalDumping,
                servicedAt: new Date(),
            });
        }
    }, [currentCanServiceStatus, illegalDumping]);

    useEffect(() => {
        const updateServiceDB = async () => {
            const logExists = await getUserServiceLogForCanAndWeek(can._id, user._id, getWeekOf(new Date()));
            //const logExists = false
            if (logExists){
                await updateUserServiceLog(serviceData, can._id, user._id, getWeekOf(new Date()) )
            } else {
                await addUserServiceLog(serviceData)
            }
        }
        if (Object.keys(serviceData).length > 0){
            updateServiceDB();

        }
    }, [serviceData]);


    const closeModal = () => setShowModal(false);

    const handleDirections = () => {
        console.log('Opening directions to:', can.label);
    };

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

                    <TouchableOpacity
                        onPress={handleDirections}
                        className="items-center gap-2"
                        activeOpacity={0.8}
                    >
                        <Image
                            source={icons.route}
                            className="size-10"
                            resizeMode="contain"
                            tintColor="#193a5a"
                        />
                        <Text className="text-darkBlue font-medium text-sm">
                            Tap icon to open directions
                        </Text>
                    </TouchableOpacity>

                    <View className="w-full h-40 bg-lightBlue rounded-md justify-center items-center">
                        <Text className="text-white font-medium">[ Map Pin Placeholder ]</Text>
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
                </View>
            </View>
        </Modal>
    );
};

export default CanModal;
