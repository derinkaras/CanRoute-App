export const INITIAL_REGION = {
    latitude: 53.5461,
    longitude: -113.4938,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
};


export const getMapMarkers = (cansData: any[]) => {
    return cansData.map(can => ({
        coordinate: {
            latitude: can.location.latitude,
            longitude: can.location.longitude,
        },
        label: can.label,
        can: can
    }));
};



import { Linking, Platform } from 'react-native';

export const openMaps = (latitude: number, longitude: number, label: string = "Can Location") => {
    const url =
        Platform.OS === 'ios'
            ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`
            : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;

    Linking.openURL(url).catch((err) => {
        console.error("Failed to open maps:", err);
    });
};
