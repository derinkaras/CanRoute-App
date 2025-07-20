import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    Pressable,
    Button,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import icons from "@/app/constants/icons";
import {useNavigation, useRouter} from "expo-router";
import Sidebar from "@/app/components/Sidebar";
import TodaysRoute from "@/app/components/TodaysRoute";
import {getMapMarkers, INITIAL_REGION} from "@/services/map";
import useFetch from "@/hooks/useFetch";
import {getUserCansForDay} from "@/services/api";
import {useAuth} from "@/contexts/AuthContext";
import CanModal from "@/app/components/CanModal";
import {useServiceLog} from "@/contexts/ServiceLogContext";
import * as Haptics from 'expo-haptics';
import {getWeekDay} from "@/services/utils";


const viewAllCans = () => {
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const [moveSliderUp, setMoveSliderUp] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mapMarkers, setMapMarkers] = useState<any>();
    const mapRef = useRef<MapView>(null);
    const { user } = useAuth();

    const [pinLocation, setPinLocation] = useState<PinLocation | null>(null);
    const { data: cansData, isLoading: cansIsLoading, refetch: refetchCansForDay } = useFetch(() =>
        getUserCansForDay(user, dayToDisplay || getWeekDay(currentDate))
    );

    // @ts-ignore
    const markerRefs = useRef<Record<string, Marker | null>>({});
    const [activeMarkerLabel, setActiveMarkerLabel] = useState<string | null>(null);
    const [pressedCan, setPressedCan] = useState();
    const [showModal, setShowModal] = useState(false);
    const { serviceLogsOfWeek, setServiceLogsOfWeek, serviceLogsLoading } = useServiceLog();

    const [dayToDisplay, setDayToDisplay] = useState(getWeekDay(new Date()));

    const [showDayDropdown, setShowDayDropdown] = useState(false);
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    const focusMap = () => {
        if (pinLocation) {
            mapRef.current?.animateToRegion(pinLocation);

            // Find and show the marker callout
            const targetMarker = mapMarkers?.find(
                (m: any) =>
                    m.coordinate?.latitude === pinLocation?.latitude &&
                    m.coordinate?.longitude === pinLocation?.longitude
            );
            if (targetMarker) {
                const markerRef = markerRefs.current[targetMarker.label];
                markerRef?.showCallout();
            }
        }
    };

    const isCanServiced = (currentCan: any) => {
        const temp = serviceLogsOfWeek.find( (canService) => ((canService.canId === currentCan._id) && (canService.servicedDate === new Date().toISOString().split("T")[0])) && (canService.status === "serviced") )
        if (temp) {
            return true;
        } else {
            return false;
        }

    }


    useEffect(() => {
        if (cansData){
            const mapMarkers = getMapMarkers(cansData);
            setMapMarkers(mapMarkers)
        }

    }, [cansData]);


    useEffect(() => {
        if (pinLocation) {
            focusMap();
        }
    }, [pinLocation]);

    useEffect(() => {
        const timer = setInterval(()=>{
            setCurrentDate(new Date());
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const fetch = async ()=> await refetchCansForDay()
        if (dayToDisplay.length > 0) {
            fetch()
        }
    }, [dayToDisplay]);

    return (
        <View className="flex flex-1 bg-white relative z-5">

            <CanModal
                showModal={showModal}
                setShowModal={setShowModal}
                can={pressedCan}
                user={user}
                setPinLocation={setPinLocation}
                setMoveSliderUp={setMoveSliderUp}
                setActiveMarkerLabel={setActiveMarkerLabel}
            />

            <View className="absolute inset-0 z-0">
                <View className="flex-1">
                    {mapMarkers ? (
                        <MapView
                            key={mapMarkers?.length || 0 } // 🔁 force new MapView when markers load
                            style={{width: "100%", height: "100%"}}
                            initialRegion={INITIAL_REGION}
                            showsUserLocation={true}
                            ref={mapRef}
                        >
                            {mapMarkers?.map((marker: any, index: number) => {
                                const serviced = isCanServiced(marker.can)
                                return (
                                    <Marker
                                        key={index}
                                        coordinate={marker.coordinate}
                                        title={marker.label}
                                        ref={(ref) => {
                                            if (ref) markerRefs.current[marker.label] = ref;
                                        }}
                                        onPress={() => {
                                            setActiveMarkerLabel(marker.label)
                                            setPressedCan(marker.can)
                                            setShowModal(true)
                                        }}
                                    >

                                        <View
                                            className="relative bg-lightBlue rounded-full p-2 border-2 border-white"

                                        >
                                            <Image
                                                source={icons.trash}
                                                resizeMode="contain"
                                                className="w-[20px] h-[20px]"
                                                style={{
                                                    tintColor: activeMarkerLabel === marker.label ? '#FFA500' : 'white',
                                                }}
                                            />
                                            {serviced && (
                                                <Image
                                                    source={icons.smallCheck}
                                                    resizeMode="contain"
                                                    tintColor="green"
                                                    className="size-10 absolute"
                                                />
                                            )}
                                        </View>
                                        <Callout tooltip={false} style={{ backgroundColor: '#085484' }}>
                                            <View
                                                style={{
                                                    backgroundColor: '#085484',
                                                    padding: 6,
                                                    borderRadius: 20,
                                                    width: 160,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: '600',
                                                        textAlign: 'center',
                                                        color: 'white',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    {marker.label}
                                                </Text>
                                            </View>
                                        </Callout>
                                    </Marker>
                                )
                            })}

                        </MapView>
                    ): (
                        <MapView
                            style={{width: "100%", height: "100%"}}
                            initialRegion={INITIAL_REGION}
                            showsUserLocation={true}
                        />

                    )}
                </View>
            </View>

            {showSideBar && (
                <Sidebar setShowSideBar={setShowSideBar} />
            )}
            <View className="flex-row mx-5 items-center relative mt-20">
                <TouchableOpacity
                    className="w-12 h-12 bg-lightBlue rounded-full overflow-hidden justify-center items-center z-0"
                    onPress={() => {
                        setShowSideBar(!showSideBar)
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                >
                    <Image
                        source={icons.bars}
                        className="size-6"
                        tintColor="white"
                    />
                </TouchableOpacity>
                <View className="absolute left-1/2 -translate-x-1/2 items-center z-10">
                    <TouchableOpacity
                        onPress={() => setShowDayDropdown(!showDayDropdown)}
                        className="bg-white border border-lightBlue px-4 py-2 rounded-xl shadow-sm"
                    >
                        <Text className="text-lightBlue font-semibold capitalize text-lg">
                            {dayToDisplay}
                        </Text>
                    </TouchableOpacity>

                    {showDayDropdown && (
                        <View className="mt-20 bg-white rounded-lg border border-lightBlue shadow-lg">
                            {daysOfWeek.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => {
                                        setDayToDisplay(day);
                                        setShowDayDropdown(false);
                                    }}
                                    className="px-4 py-2 hover:bg-lightBlue/10"
                                >
                                    <Text
                                        className={`capitalize ${
                                            day === dayToDisplay ? "text-lightBlue font-bold" : "text-gray-700"
                                        }`}
                                    >
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>




            </View>
            {moveSliderUp ? (
                <View className="absolute inset-0 transition-transform duration-300">
                    <Pressable
                        className="flex-1"
                        onPress={() => setMoveSliderUp(!moveSliderUp)}
                    />
                    <View
                        className="w-full h-1/2 bg-lightBlue absolute bottom-0 left-0 right-0"
                    >
                        <TodaysRoute
                            setPinLocation={setPinLocation}
                            cansData={cansData}
                            cansIsLoading={cansIsLoading}
                            setMoveSliderUp={setMoveSliderUp}
                            setActiveMarkerLabel={setActiveMarkerLabel}
                        />
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    className={"w-full h-32 bg-lightBlue absolute bottom-0 left-0 right-0 transition-transform duration-300"}
                    onPress={() => {
                        setMoveSliderUp(!moveSliderUp);
                    }}
                >
                    <Text className="text-3xl font-semibold text-white text-center mt-6 capitalize">{dayToDisplay}'s Route</Text>

                </TouchableOpacity>
            )
            }

        </View>

    );
};
export default viewAllCans;
