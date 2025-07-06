import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react';
import { getUserServiceLogsForAllCansOfWeek } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { getWeekOf } from '@/services/utils';
import {addToCache, getFromCache} from "@/services/cache";



interface ServiceLogContextType {
    serviceLogsOfWeek: ServiceLog[];
    setServiceLogsOfWeek: React.Dispatch<React.SetStateAction<ServiceLog[]>>;
    serviceLogsLoading: boolean;
}

const ServiceLogContext = createContext<ServiceLogContextType | undefined>(
    undefined
);

export const ServiceLogProvider = ({ children }: { children: ReactNode }) => {
    const [serviceLogsOfWeek, setServiceLogsOfWeek] = useState<ServiceLog[]>([]);
    const { user } = useAuth();
    const [ serviceLogsLoading, setServiceLogsLoading ] = useState(false);

    useEffect(() => {
        const fetchServiceLogsOfWeek = async () => {
            try {
                if (user) {
                    setServiceLogsLoading(true);
                    const cache = await getFromCache(`${user._id}-serviceLogs-${getWeekOf(new Date())}`)
                    if (cache){
                        setServiceLogsOfWeek(cache);
                    } else {
                        const logs = await getUserServiceLogsForAllCansOfWeek(
                            user._id,
                            getWeekOf(new Date())
                        );
                        setServiceLogsOfWeek(logs);
                        await addToCache(`${user._id}-serviceLogs-${getWeekOf(new Date())}`, logs);
                    }
                }
            } catch (e) {
                console.log("Error happened in service log context: " ,e);
            } finally {
                setServiceLogsLoading(false);
            }
        };

        fetchServiceLogsOfWeek();
    }, [user]);

    return (
        <ServiceLogContext.Provider
            value={{ serviceLogsOfWeek, setServiceLogsOfWeek, serviceLogsLoading }}
        >
            {children}
        </ServiceLogContext.Provider>
    );
};

export const useServiceLog = () => {
    const context = useContext(ServiceLogContext);
    if (!context) {
        throw new Error('useServiceLog must be used within a ServiceLogProvider');
    }
    return context;
};
