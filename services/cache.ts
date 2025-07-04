import AsyncStorage from "@react-native-async-storage/async-storage";


export const addToCache = async (key: string, value: any)=>{
    try{

        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch(error){
        console.error("Error while adding to cache: ", error);
    }
}

export const deleteFromCache = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error("Error deleting from cache: ", error);
    }
}

export const getFromCache = async (key: string) => {
    try {
        const jsonResult = await AsyncStorage.getItem(key);
        const parsedResult = jsonResult ? JSON.parse(jsonResult) : null
        return parsedResult;
    } catch (error) {
        console.error("Error getting from cache: ", error);
    }
}

export const clearAsyncStorageExcept = async (keysToKeep: string[]) => {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        // @ts-ignore
        const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));

        if (keysToRemove.length > 0) {
            await AsyncStorage.multiRemove(keysToRemove);
        }

    } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
    }

}