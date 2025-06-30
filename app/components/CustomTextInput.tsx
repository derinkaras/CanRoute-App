import React from 'react';
import {View, Text, TextInput, Image} from 'react-native';

const CustomTextInput = ({icon, placeholder, stateVar, stateVarSetter}: any) => {

    return (
        <View className="border-2 border-white px-4 py-5 w-full rounded-xl mt-4 flex-row gap-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor="white"
                className="size-7"
            />
            <TextInput
                className="text-white flex-1"
                placeholder={placeholder}
                secureTextEntry={placeholder.includes("password") ? true : false}
                placeholderTextColor="white"
                value={stateVar}
                onChangeText={stateVarSetter}
            />
        </View>
    );
    };

export default CustomTextInput;
