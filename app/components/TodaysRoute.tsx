import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {getUserCans, getUserCansForDay} from "@/services/api";
import {useAuth} from "@/contexts/AuthContext";
import useFetch from "@/hooks/useFetch";

const TodaysRoute = ({date}: {date:string}) => {
    const [cans, setCans] = useState([]);
    const {user} = useAuth()

    // This useFetch has autoFetch=true which re-fetches on mount due to the useEffect so it's a reactive function
    // react only reacts if there is something to react to otherwise it stays stale no matter if it appears or disappears
    // hooks have reactivity and aren't like normal functions if it has a useEffect - Think about the insides of the hook being in this component

    const {data, isLoading, error} = useFetch(() => getUserCansForDay(user, date))

    useEffect(() => {
        if (data){
            setCans(data)
        }
    }, [data]);


    return (
        <View className="mt-10">
            {!isLoading ? (cans.map( (canObj, index) => {
                return (
                        <View
                            key={index}
                        >
                            <Text>Nice!</Text>
                        </View>
                    )
            })) : (
                <View>
                    <ActivityIndicator
                        size="large"
                        color="#007bff"
                    />
                </View>
            )
            }

        </View>
    );
};

export default TodaysRoute;
