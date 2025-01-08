import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDataContext} from "../context/DataFlowContext";
import SalesDashboard from "../components/DashboardScreen/SalesDashboard";
import DashboardScreen from "../screens/DashboardScreen";
import StaffDashboard from "../components/DashboardScreen/StaffDashboard";
import ClientDashboard from "../components/DashboardScreen/ClientDashboard";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'react-native';
import { BackButton } from './StaffManagementStack';


const DashboardStack = ({navigation,route}) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName="DashboardScreen"
            screenOptions={({route}) => ({
                // headerTitleAlign: 'center',
                headerShown:true,
                // animation:"ios"
            })}
        >
            <Stack.Screen name='DashboardScreen'
                          component={DashboardScreen}
                          options={{headerShown: true,
                            headerLeft: () => <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                              <Image
                                  source={require('../assets/icons/drawerIcons/drawer.png')}
                                  style={{width: 24, height: 24}}
                              />
                          </TouchableOpacity>,
                          }}
            />
            <Stack.Screen
                name="SalesScreen"
                component={SalesDashboard}
                options={{
                    headerTitle: "Sales Dashboard",
                    headerTitleAlign: "center",
                    headerShown:true,
                    headerLeft: () => <BackButton />,
                    // animation:'ios_from_right'
                }}

            />
            <Stack.Screen
                name='StaffScreen'
                component={StaffDashboard}
                options={{
                    headerTitle: "Staff Dashboard",
                    headerShown:true,
                    headerLeft:()=><BackButton/>,
                    // animation:'ios_from_right'
                }}
            />
            <Stack.Screen
                name='ClientScreen'
                component={ClientDashboard}
                options={{
                    headerTitle: "Client Dashboard",
                    headerShown:true,
                    headerLeft:()=><BackButton/>,
                    // animation:'ios_from_right'
                }}
            />
        </Stack.Navigator>
    )
}

export default DashboardStack;