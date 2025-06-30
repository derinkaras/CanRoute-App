import React from 'react';
import { View, Text } from 'react-native';
import {Stack} from "expo-router";

const _layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="authentication"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>

    );
};

export default _layout;
