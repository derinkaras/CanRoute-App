import React from 'react';
import {
    View,
    Text,
    Pressable,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import {IconProps} from "@expo/vector-icons/build/createIconSet";
import {useRouter} from "expo-router";
import * as Haptics from 'expo-haptics';

const Sidebar = ({ setShowSideBar }: { setShowSideBar: (val: boolean) => void }) => {
    const screenWidth = Dimensions.get('window').width;
    const sidebarWidth = screenWidth * (2 / 3);
    const { user, logout } = useAuth();
    const router = useRouter();

    const menuItems: { label: string; icon: IconProps<any>['name'], path: string }[] = [
        { label: 'Dashboard', icon: 'grid-outline', path: 'dashboard' },
        { label: 'Transfer Cans', icon: 'trash-outline', path: "transferCans"},
        { label: 'Service History', icon: 'time-outline', path: "service-history" },
        { label: 'Notifications', icon: 'notifications-outline', path: "notifications"},
        { label: 'Settings', icon: 'settings-outline', path: "settings"},
        { label: 'Report a Problem', icon: 'alert-circle-outline', path: "report"},
    ];


    return (
        <View className="flex-row absolute inset-0 z-10">
            <View
                style={{
                    width: sidebarWidth,
                }}
                className="bg-darkBlue px-5 py-20 justify-between"
            >
                {/* Top Section */}
                <View className="flex-1 justify-between">
                    <View>
                        {/* User Info */}
                        <View className="flex-row items-center gap-4 mb-10">
                            <View className="w-14 h-14 rounded-full bg-lightBlue items-center justify-center">
                                <Text className="text-white text-2xl font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View>
                                <Text className="text-white text-2xl font-semibold">
                                    {user?.name?.charAt(0).toUpperCase() + user?.name?.slice(1)}
                                </Text>
                                <Text className="text-white text-sm font-">
                                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                </Text>
                            </View>
                        </View>

                        {/* Menu Items */}
                        <View className="gap-10">
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                                        console.log(`Moved to path ${item.path}`);
                                        // @ts-ignore
                                        router.push(`/${item.path}`)
                                    }}
                                    className="flex-row items-center gap-4"
                                >
                                    <Ionicons name={item.icon} size={22} color="white" />
                                    <Text className="text-white text-xl font-medium">
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Footer Section */}
                    <View className="mt-10">
                        <View className="border-t border-lightBlue mb-4" />
                        <TouchableOpacity onPress={logout} className="mb-4">
                            <Text className="text-white text-xl">Logout</Text>
                        </TouchableOpacity>
                        <Text className="text-white text-xl">Help</Text>
                        <Text className="text-white text-xl mt-2">Contact Fleet Safety</Text>
                    </View>
                </View>
            </View>

            {/* Overlay */}
            <Pressable
                onPress={() => {
                    setShowSideBar(false);
                }}
                className="flex-1"
            />
        </View>
    );
};

export default Sidebar;
