import AsyncStorage from "@react-native-async-storage/async-storage";
import {addToCache, getFromCache} from "@/services/cache";

// For the useFetch hook to work with these make sure you're always returning the actual data

export const getUserCans = async (user: Record<string, any> | null) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!user){
            return []
        }
        const response = await fetch(`https://canroute.onrender.com/api/v1/cans/crew/${user._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        })
        const responseData = await response.json()
        return responseData.data
    } catch (error) {
        console.error(error);
        return []
    }
}

export const getUserCansForDay = async (user: Record<string, any> | null, date: string) => {
    try {
        const cache = await getFromCache(`${user?._id}-${date}-cans`);
        if (cache) {
            return cache
        } else {
            const allCans = await getUserCans(user);
            const cansForDay = allCans.filter((can: { assignedDay: any; }) => can.assignedDay.toLowerCase() === date.toLowerCase());
            await addToCache(`${user?._id}-${date}-cans`, cansForDay);
            return cansForDay;
        }
    } catch (error) {
        console.error(error);
        return []
    }
}

interface serviceDataType {
    canId: Number,
    userId: Number,
    weekOf: Date,
    status: String,
    servicedAt: Date,
    servicedDate: String,
    illegalDumping: Boolean,
    notes?: String,
}

export const addUserServiceLog = async (serviceData: serviceDataType) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const response = await fetch("https://canroute.onrender.com/api/v1/serviceLogs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                ...serviceData,
            })
        })
        const result = await response.json()
        return result.data
    } catch (error) {
        console.error(error);
        return []
    }
}

export const updateUserServiceLog = async (
    serviceData: ServiceLog,
    canId: string,
    userId: string,
    weekOf: Date
    ) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const isoWeekOf = weekOf.toISOString()
        const response = await fetch(`https://canroute.onrender.com/api/v1/serviceLogs/${userId}/${canId}/${isoWeekOf}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                ...serviceData,
            })
        })
        const result = await response.json()
        return result.data
    } catch (error) {
        console.error(error);
        return []
    }
}

export const getUserServiceLogForCanAndWeek = async (
    canId: string,
    userId: string,
    weekOf: Date
) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const isoWeekOf = weekOf.toISOString();

        const url = `https://canroute.onrender.com/api/v1/serviceLogs/specific/${userId}/${canId}/${isoWeekOf}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`,
            },
        });


        const json = await response.json();
        return json.data;

    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};


export const getUserServiceLogsForAllCansOfWeek = async (
    userId: string,
    weekOf: Date
) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const isoWeekOf = weekOf.toISOString();

        const url = `https://canroute.onrender.com/api/v1/serviceLogs/specific/${userId}/${isoWeekOf}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`,
            },
        });

        const json = await response.json();
        return json.data;

    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
};

export const checkIfEmailExists = async (email: string) => {
    try {
        console.log("Email: ", email);
        const storedToken = await AsyncStorage.getItem('token');
        const response = await fetch(`https://canroute.onrender.com/api/v1/users/user-exists/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        })
        console.log("This is the response: ", response);
        const json = await response.json();
        console.log("This is the JSON: ", JSON.stringify(json, null, 2));
        return json.data;

    } catch(error) {
        console.error("Fetch error:", error);
        return false;
    }

}





