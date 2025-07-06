import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    FlatList, Switch,
} from 'react-native';
import {getUserCansForDay, getUserServiceLogsForAllCansOfWeek} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import useFetch from '@/hooks/useFetch';
import icons from '@/app/constants/icons';
import CanModal from '@/app/components/CanModal';
import {getStatusColor, getWeekOf} from "@/services/utils";
import {useServiceLog} from "@/contexts/ServiceLogContext";

const TodaysRoute = ({setPinLocation, cansData, cansIsLoading, setMoveSliderUp, setActiveMarkerLabel}: any) => {
    const [cans, setCans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentCan, setCurrentCan] = useState({});
    const { user } = useAuth();
    const { serviceLogsOfWeek, setServiceLogsOfWeek, serviceLogsLoading } = useServiceLog();
    const [serviceStatus, setServiceStatus] = useState("");

    useEffect(() => {
        if (cansData) {
            setCans(cansData);
        }
    }, [cansData]);


    return (
        <View className="mx-6 flex-1">
            <CanModal
                showModal={showModal}
                setShowModal={setShowModal}
                can={currentCan}
                user={user}
                setPinLocation={setPinLocation}
                setMoveSliderUp={setMoveSliderUp}
                setActiveMarkerLabel={setActiveMarkerLabel}
            />

            {!cansIsLoading && !serviceLogsLoading ? (
                <FlatList
                    data={cans}
                    keyExtractor={(item: Record<string, any>) => item._id}
                    renderItem={({ item }) => {
                        return (
                                <TouchableOpacity
                                    onPress={() => {
                                        setCurrentCan(item);
                                        setShowModal(true);
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
                                        {(() => {
                                            const service = serviceLogsOfWeek.find(log => log.canId === item._id);
                                            const status = service?.status || "Unserviced";
                                            const label =
                                                status === "serviced"
                                                    ? "Serviced"
                                                    : status === "not_needed"
                                                        ? "Not Needed"
                                                        : "Unserviced";
                                            return (
                                                <View className={`${getStatusColor(status)} px-3 py-1 rounded-full`}>
                                                    <Text className="text-white text-sm font-semibold">{label}</Text>
                                                </View>
                                            );
                                        })()}
                                    </View>
                                </TouchableOpacity>
                            )
                    }}
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
