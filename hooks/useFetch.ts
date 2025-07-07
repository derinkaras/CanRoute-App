import {useEffect, useState} from "react";

const useFetch = <T> (fetchFunction: () => Promise<T>, dependancyArr = [], autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const result = await fetchFunction()
            setData(result)

        } catch (error) {
            // @ts-ignore
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const reset = () => {
        setData(null);
        setIsLoading(false);
        setError(null);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    },[...dependancyArr])

    return {data, isLoading, refetch: fetchData, error, reset};
 }

 export default useFetch;