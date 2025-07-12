import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import icons from "@/app/constants/icons";
import {getWeekDay} from "@/services/utils";

const DayDropDown = ({selectedDay, setSelectedDay} : any) => {
    const [showDropdown, setShowDropdown] = useState(false);


    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


    return (
        <View>
            {/* Dropdown */}
            <TouchableOpacity
                className="flex-row items-center bg-darkBlue rounded-2xl py-2 px-4 gap-2"
                style={{ height: 50 }}
                onPress={() => setShowDropdown(!showDropdown)}
            >
                <Image source={icons.calendar} className="size-6" tintColor="white" />
                <Text className="text-white flex-1 capitalize">{selectedDay}</Text>
                <Image
                    source={icons.chevronDown}
                    className={`size-4 ${showDropdown ? 'rotate-180' : ''}`}
                    tintColor="white"
                />
            </TouchableOpacity>
            {showDropdown && (
                <View className="bg-darkBlue rounded-2xl absolute z-10 w-full mt-16">
                    {days.map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setSelectedDay(day);
                                setShowDropdown(false);
                            }}
                            className={`px-4 py-3 ${
                                day !== 'sunday' ? 'border-b border-white/10' : ''
                            }`}
                        >
                            <Text className="text-white capitalize">{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default DayDropDown;
