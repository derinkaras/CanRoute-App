import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import {getUserCansForDay, getUserServiceLogsForAllCansOfWeek} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import useFetch from '@/hooks/useFetch';
import icons from '@/app/constants/icons';
import CanModal from '@/app/components/CanModal';
import {getWeekOf} from "@/services/utils";

const TodaysRoute = ({ date }: { date: string }) => {
    const [cans, setCans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCan, setCurrentCan] = useState({});
    const [weekServiceData, setWeekServiceData] = useState([])
    const { user } = useAuth();
    const { data, isLoading, error } = useFetch(() => getUserCansForDay(user, date));
    // @ts-ignore
    const { data: serviceData, isLoading: serviceDataIsLoading, error: serviceDataError} = useFetch(()=> getUserServiceLogsForAllCansOfWeek(user._id, getWeekOf(new Date())))


    useEffect(() => {
        if (data) {
            setCans(data);
            setWeekServiceData(serviceData);
        }
    }, [data, serviceData]);


    return (
        <View className="mx-6">
            <CanModal
                showModal={showModal}
                setShowModal={setShowModal}
                can={currentCan}
                user={user}
            />

            {!isLoading ? (
                <FlatList
                    data={cans}
                    keyExtractor={(item: Record<string, any>) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(true);
                                setCurrentCan(item);
                            }}
                            activeOpacity={0.85}
                        >
                            <View className="w-full bg-darkBlue rounded-2xl flex-row items-center justify-between px-4 py-3 shadow-sm shadow-black/20 mb-4">
                                <View className="flex-row items-center gap-3">
                                    <Image
                                        source={icons.trash}
                                        tintColor="white"
                                        className="size-6"
                                        resizeMode="contain"
                                    />
                                    <Text className="text-base text-white font-semibold">
                                        {item.label}
                                    </Text>
                                </View>
                                <View className="bg-red-500 px-3 py-1 rounded-full">
                                    {/*This unserviced will be dynamic later*/}
                                    <Text className="text-white text-sm font-semibold">Unserviced</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text className="text-3xl font-semibold text-white text-center my-5">Today's Route</Text>
                    }
                />
            ) : (
                <View className = "mt-5">
                    <Text className="text-3xl font-semibold text-white text-center mb-5">Today's Route</Text>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            )}
        </View>
    );
};

export default TodaysRoute;
