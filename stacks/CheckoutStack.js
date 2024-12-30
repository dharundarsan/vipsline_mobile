import CheckoutScreen from "../screens/CheckoutScreen";
import {AntDesign} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import SalesDashboard from "../components/DashboardScreen/SalesDashboard";
import React from "react";
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const CheckoutStack = ({route}) => {
    const Stack = createNativeStackNavigator();

    return <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
            name="CheckoutScreen"
            component={CheckoutScreen}
            options={({navigation}) => ({
                headerLeft: () => (
                    // route.params.showDrawerIcon ?
                    <AntDesign
                        name="menu-fold"
                        size={24}
                        color={Colors.darkBlue}
                        onPress={() => navigation.toggleDrawer()}
                    />
                    // : null
                ),
                presentation: 'modal',
            })}
            initialParams={route.params}
        />
        <Stack.Screen component={SalesDashboard} name="SalesScreen"/>
    </Stack.Navigator>
};

export default CheckoutStack;