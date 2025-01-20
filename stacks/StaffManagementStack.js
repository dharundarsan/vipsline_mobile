import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import StaffManagementScreen from "../screens/StaffManagementScreen";
import StaffListScreen from "../screens/StaffListScreen";
import {Image, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";

import {AntDesign} from "@expo/vector-icons";
import StaffInfo from "../screens/StaffInfo";
import sample from "../components/staffManagementScreen/Sample";
import Sample from "../components/staffManagementScreen/Sample";

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
            component={Sample}
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
            component={StaffListScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
        <Stack.Screen
            name="Staff Off Type"
            component={StaffListScreen}
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