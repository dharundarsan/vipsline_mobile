import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import StaffManagementScreen from "../screens/staffs/StaffManagementScreen";
import StaffListScreen from "../screens/staffs/StaffListScreen";
import {Image, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";

import {AntDesign} from "@expo/vector-icons";
import StaffInfo from "../screens/staffs/StaffInfo";
import sample from "../components/staffManagementScreen/Sample";
import Sample from "../components/staffManagementScreen/Sample";
import StaffTiming from "../screens/staffs/ShiftTiming";
import ShiftTiming from "../screens/staffs/ShiftTiming";
import BusinessClosedDates from "../screens/staffs/BusinessClosedDates";
import StaffTimeOffTypeScreen from "../screens/staffs/StaffTimeOffTypeScreen";

export const BackButton = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={async () => {
                navigation.goBack();
            }}
        >
            <AntDesign name="arrowleft" size={24} color="black"/>
        </TouchableOpacity>

    );
};

const StaffManagementStack = ({route, navigation}) => {
    const Stack = createNativeStackNavigator();
    // const navigation = useNavigation();


    return (<Stack.Navigator
        initialRouteName="Staffs"
        screenOptions={({route}) => ({
            // headerTitleAlign: 'center',
            headerShown:true,
            // animation:"ios"
        })}
    >
        <Stack.Screen name='Staffs'
                      component={StaffManagementScreen}
                      options={{
                          headerShown: true,
                          headerLeft: () => <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                              <Image
                                  source={require('../assets/icons/drawerIcons/drawer.png')}
                                  style={{width: 24, height: 24}}
                              />
                          </TouchableOpacity>,
                          headerTitleAlign: "center",

        }}
        />
        <Stack.Screen
            name="Staff List"
            component={StaffListScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
        <Stack.Screen
            name="Shift Timing"
            component={ShiftTiming}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'


            }}

        />
        <Stack.Screen
            name="Working Hours"
            component={StaffListScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
        <Stack.Screen
            name="Commission Profile"
            component={StaffListScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
        <Stack.Screen
            name="Staff Commission"
            component={StaffListScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
        <Stack.Screen
            name="Business Closed Dates"
            component={BusinessClosedDates}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
        <Stack.Screen
            name="Time Off Type"
            component={StaffTimeOffTypeScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
        <Stack.Screen
            name="Staff Name"
            component={StaffInfo}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
            }}
        />
    </Stack.Navigator>)
}

export default StaffManagementStack