import React from 'react';
import { View, Text } from 'react-native';
import {Stack, Tabs} from "expo-router";

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="dashboard"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="transferCans"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="notifications"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="manageCans"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>

    );
};

export default _layout;
