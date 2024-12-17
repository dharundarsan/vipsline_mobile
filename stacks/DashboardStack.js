import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDataContext} from "../context/DataFlowContext";
import SalesDashboard from "../components/DashboardScreen/SalesDashboard";
import DashboardScreen from "../screens/DashboardScreen";
import StaffDashboard from "../components/DashboardScreen/StaffDashboard";
import ClientDashboard from "../components/DashboardScreen/ClientDashboard";


const DashboardStack = ({route}) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="DashboardScreen"
            screenOptions={({route}) => ({
                // headerTitleAlign: 'center',
                // headerShown:false,
                // animation:"ios"
            })}
        >
            <Stack.Screen name='DashboardScreen'
                          component={DashboardScreen}
                          options={{headerTitle: "Dashboard", headerShown: false}}
            />
            <Stack.Screen
                name="SalesScreen"
                component={SalesDashboard}
                options={{
                    headerTitle: "Sales Dashboard",
                    headerTitleAlign: "center",
                    headerShown:false,
                    // headerLeft: () => <BackButton />,
                    // animation:'ios_from_right'

                }}

            />
            <Stack.Screen
                name='StaffScreen'
                component={StaffDashboard}
                options={{
                    headerTitle: "Staff Dashboard",
                    headerShown:false,
                    // headerLeft:()=><BackButton/>,
                    // animation:'ios_from_right'
                }}
            />
            <Stack.Screen
                name='ClientScreen'
                component={ClientDashboard}
                options={{
                    headerTitle: "Client Dashboard",
                    headerShown:false
                    // headerLeft:()=><BackButton/>,
                    // animation:'ios_from_right'
                }}
            />
        </Stack.Navigator>
    )
}

export default DashboardStack;