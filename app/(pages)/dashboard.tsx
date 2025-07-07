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

const weekdayMap = {
    "0": "Sunday",
    "1": "Monday",
    "2": "Tuesday",
    "3": "Wednesday",
    "4": "Thursday",
    "5": "Friday",
    "6": "Saturday",
}
const monthMap = {
    "0": "January",
    "1": "February",
    "2": "March",
    "3": "April",
    "4": "May",
    "5": "June",
    "6": "July",
    "7": "August",
    "8": "September",
    "9": "October",
    "10": "November",
    "11": "December",
}





const dashboard = () => {
    const router = useRouter();
    const [showSideBar, setShowSideBar] = useState(false);
    const [moveSliderUp, setMoveSliderUp] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mapMarkers, setMapMarkers] = useState<any>();
    const mapRef = useRef<MapView>(null);
    const { user } = useAuth();

    const [pinLocation, setPinLocation] = useState<PinLocation | null>(null);
    const { data: cansData, isLoading: cansIsLoading, error } = useFetch(() => getUserCansForDay(user, weekdayMap[currentDate.getDay().toString() as keyof typeof weekdayMap]));
    // @ts-ignore
    const markerRefs = useRef<Record<string, Marker | null>>({});
    const [activeMarkerLabel, setActiveMarkerLabel] = useState<string | null>(null);
    const [pressedCan, setPressedCan] = useState();
    const [showModal, setShowModal] = useState(false);
    const { serviceLogsOfWeek, setServiceLogsOfWeek, serviceLogsLoading } = useServiceLog();

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
                                            className="relative"
                                        >
                                            <Image
                                                source={icons.trash}
                                                resizeMode="contain"
                                                className="w-[30px] h-[30px]"
                                                style={{
                                                    tintColor: activeMarkerLabel === marker.label ? '#FFA500' : '#085484',
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
                <View className="absolute left-1/2 -translate-x-1/2 items-center">
                    <Text className=" font-semibold text-3xl text-lightBlue">
                        {weekdayMap[currentDate.getDay().toString() as keyof typeof weekdayMap]}
                    </Text>
                    <View className="flex-row gap-2">
                        <Text className=" font-semibold text-base text-lightBlue">
                            {monthMap[currentDate.getMonth().toString() as keyof typeof monthMap]}
                        </Text>
                        <Text className=" font-semibold text-base text-lightBlue">
                            {currentDate.getDate().toString()}
                        </Text>
                    </View>

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
                    <Text className="text-3xl font-semibold text-white text-center mt-6">Today's Route</Text>

                </TouchableOpacity>
            )
            }

        </View>

    );
};
export default dashboard;
