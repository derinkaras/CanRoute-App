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
        </Stack>

    );
};

export default _layout;
