import AsyncStorage from "@react-native-async-storage/async-storage";

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
        const allCans = await getUserCans(user);
        const cansForDay = allCans.filter((can: { assignedDay: any; }) => can.assignedDay.toLowerCase() === date.toLowerCase());
        return cansForDay;
    } catch (error) {
        console.error(error);
        return []
    }
}

