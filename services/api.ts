import AsyncStorage from "@react-native-async-storage/async-storage";
import {addToCache, deleteFromCache, getFromCache} from "@/services/cache";
import {getWeekDay} from "@/services/utils";

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
        const storedToken = await AsyncStorage.getItem('token');
        const response = await fetch(`https://canroute.onrender.com/api/v1/users/user-exists/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        })
        const json = await response.json();
        return json;

    } catch(error) {
        console.error("Fetch error:", error);
        return false;
    }

}


export const addTransfer = async (body: Record<string, any>) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const request = await fetch("https://canroute.onrender.com/api/v1/transfer", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                ...body,
            })
        })
        const result = await request.json()
        return result.data
    } catch (error) {
        console.error("There was an error adding the transfer: ", error);
    }

}

export const getTransferRequests = async () => {
    try {
        const user = await getFromCache("user");
        const storedToken = await AsyncStorage.getItem('token');
        const response = await fetch(`https://canroute.onrender.com/api/v1/transfer/${user._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error);
        }
        return result.data;
    } catch (error) {
        console.error("There was an error in the get transfer requests: ", error);
    }
}

export const deleteTransfer = async (id: string) => {
    // The id here is the id of the transfer to be deleted
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const request = await fetch(`https://canroute.onrender.com/api/v1/transfer/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        })
        const result = await request.json()
        return result.message
    } catch (error) {
        console.error("There was an error deleting transfer: ", error);
    }
}


export const acceptTransfer = async (id: string, userId: string) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const request = await fetch(`https://canroute.onrender.com/api/v1/transfer/accept/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            }
        })
        const result = await request.json()
        const currentDay = getWeekDay(new Date());
        await deleteFromCache(`${userId}-${result.dayBeingAccepted}-cans`)

    } catch (error){
        console.error("There was an error accepting the transfer: ", error);
    }
}


export const getNumberOfNotifications = async () => {
    try {
        // When can maintenance is implemented this will be added here ofc
        const numberOfTransferRequests = await getTransferRequests();
        return Object.keys(numberOfTransferRequests).length || 0
    } catch (error) {
        console.error("The error happened in get number of notifciations: ", error);
    }
}


export const updateCansDay = async (originalDay: string, newDay: string, cans: Record<string, any>, userId: string) => {
    try {
        const storedToken = await AsyncStorage.getItem('token');
        const response = await fetch(`https://canroute.onrender.com/api/v1/cans/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({
                updates: cans.current,
                newDay
            })
        })

        const result = await response.json()
        deleteFromCache(`${userId}-${originalDay}-cans`)
        deleteFromCache(`${userId}-${newDay}-cans`)
    } catch (error) {
        console.error("There was a problem updating cans: ", error);
    }
}
