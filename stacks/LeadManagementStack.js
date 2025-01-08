import DashboardScreen from "../screens/DashboardScreen";
import SalesDashboard from "../components/DashboardScreen/SalesDashboard";
import StaffDashboard from "../components/DashboardScreen/StaffDashboard";
import ClientDashboard from "../components/DashboardScreen/ClientDashboard";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LeadManagementScreen from "../screens/LeadManagementScreen";
import LeadDetailsModal from "../components/LeadManagementScreen/LeadDetailsModal";

const LeadManagementStack = ({route}) => {
    const Stack = createNativeStackNavigator();

    return (<Stack.Navigator
        initialRouteName="Lead Management Screen"
        screenOptions={({route}) => ({
            // headerTitleAlign: 'center',
            // headerShown:false,
            // animation:"ios"
        })}
    >
        <Stack.Screen name='Lead Management Screen'
                      component={LeadManagementScreen}
                      options={{headerShown: false}}
        />
        <Stack.Screen
            name="Lead Profile"
            component={LeadDetailsModal}
            options={{
                headerShown: false,
                headerTitle: "Saledsdsd",
                headerTitleAlign: "center",
                // headerLeft: () => <BackButton />,
                // animation:'ios_from_right'

            }}

        />
    </Stack.Navigator>)
}

export default LeadManagementStack