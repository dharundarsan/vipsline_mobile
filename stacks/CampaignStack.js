import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React from "react";
import StaffManagementScreen from "../screens/staffs/StaffManagementScreen";
import StaffListScreen from "../screens/staffs/StaffListScreen";
import {BackHandler, Image, TouchableOpacity} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";

import {AntDesign} from "@expo/vector-icons";
import StaffInfo from "../screens/staffs/StaffInfo";
import sample from "../components/staffManagementScreen/Sample";
import Sample from "../components/staffManagementScreen/Sample";
import StaffTiming from "../screens/staffs/ShiftTiming";
import ShiftTiming from "../screens/staffs/ShiftTiming";
import BusinessClosedDates from "../screens/staffs/BusinessClosedDates";
import StaffTimeOffTypeScreen from "../screens/staffs/StaffTimeOffTypeScreen";
import WorkingHours from "../screens/staffs/WorkingHours";
import {useDispatch} from "react-redux";
import {clearSchedulesForStaff} from "../store/staffSlice";
import CommissionProfileScreen from "../screens/staffs/CommissionProfileScreen";
import StaffCommissionScreen from "../screens/staffs/StaffCommissionScreen";
import textTheme from "../constants/TextTheme";
import Campaigns from "../screens/marketing/Campaigns";
import SMSCampaign from "../screens/marketing/SMSCampaign";
import SMSCampaignLandingPage from "../screens/marketing/SMSCampaignLandingpage";
import Dashboard from "../screens/marketing/Dashboard";

export const BackButton = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();




    return (
        <TouchableOpacity
            hitSlop={40}
            onPress={async () => {
                navigation.goBack();
                // console.log(props)
                if(props.currentRouteName === "Working Hours") {
                    // console.log(props.currentRouteName)
                    dispatch(clearSchedulesForStaff());
                }
            }}
        >
            <AntDesign name="arrowleft" size={24} color="black"/>
        </TouchableOpacity>

    );
};

const CampaignStack = () => {
    const Stack = createNativeStackNavigator();
    // const navigation = useNavigation();

    const dispatch = useDispatch();

    const staffBackHandler = (WrappedComponent) => {
        return (props) => {
            const navigation = useNavigation();

            useFocusEffect(
                React.useCallback(() => {
                    const onBackPress = () => {
                        navigation.goBack(); // Navigate to the initial screen
                        return true; // Prevent default back action
                    };

                    BackHandler.addEventListener('hardwareBackPress', onBackPress);

                    return () => {
                        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
                    };
                }, [navigation])
            );

            return <WrappedComponent {...props} />;
        };
    };


    return (<Stack.Navigator
        initialRouteName="Staffs"
        screenOptions={({route}) => ({
            // headerTitleAlign: 'center',
            headerShown:true,
            // animation:"ios"
        })}
    >
        <Stack.Screen name='Campaigns'
                      component={Campaigns}
                      options={({navigation, route}) => ({
                          headerShown: true,
                          headerLeft: () => <TouchableOpacity onPress={() => navigation.toggleDrawer()} hitSlop={40}>
                              <Image
                                  source={require('../assets/icons/drawerIcons/drawer.png')}
                                  style={{width: 24, height: 24}}
                              />
                          </TouchableOpacity>,
                          headerTitleAlign: "center",
                          headerTitleStyle: {
                              ...textTheme.titleMedium,
                              fontSize: 20,

                          }

                      })}
        />
        <Stack.Screen
            name="SMS Campaign"
            component={staffBackHandler(SMSCampaign)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                // animation:'ios_from_right'
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }

            })}

        />
        <Stack.Screen
            name="SMS Campaign Landing Page"
            component={staffBackHandler(SMSCampaignLandingPage)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                // animation:'ios_from_right'
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                },
                headerTitle: "SMS Campaign",


            })}

        />
        <Stack.Screen
            name="Dashboard"
            component={staffBackHandler(Dashboard)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,

                // animation:'ios_from_right'
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }

            })}

        />
        {/*<Stack.Screen*/}
        {/*    name="Commission Profile"*/}
        {/*    component={staffBackHandler(CommissionProfileScreen)}*/}
        {/*    options={({navigation, route}) => ({*/}
        {/*        headerShown: true,*/}
        {/*        headerTitleAlign: "center",*/}
        {/*        headerLeft: () => <BackButton currentRouteName={route.name}/>,*/}
        {/*        // animation:'ios_from_right'*/}
        {/*        headerTitleStyle: {*/}
        {/*            ...textTheme.titleMedium,*/}
        {/*            fontSize: 20,*/}

        {/*        }*/}

        {/*    })}*/}

        {/*/>*/}
        {/*<Stack.Screen*/}
        {/*    name="Staff Commission"*/}
        {/*    component={staffBackHandler(StaffCommissionScreen)}*/}
        {/*    options={({navigation, route}) => ({*/}
        {/*        headerShown: true,*/}
        {/*        headerTitleAlign: "center",*/}
        {/*        headerLeft: () => <BackButton currentRouteName={route.name}/>,*/}
        {/*        // animation:'ios_from_right'*/}
        {/*        headerTitleStyle: {*/}
        {/*            ...textTheme.titleMedium,*/}
        {/*            fontSize: 20,*/}

        {/*        }*/}

        {/*    })}*/}

        {/*/>*/}
        {/*<Stack.Screen*/}
        {/*    name="Business Closed Dates"*/}
        {/*    component={staffBackHandler(BusinessClosedDates)}*/}
        {/*    options={({navigation, route}) => ({*/}
        {/*        headerShown: true,*/}
        {/*        headerTitleAlign: "center",*/}
        {/*        headerLeft: () => <BackButton currentRouteName={route.name}/>,*/}
        {/*        // animation:'ios_from_right'*/}
        {/*        headerTitleStyle: {*/}
        {/*            ...textTheme.titleMedium,*/}
        {/*            fontSize: 20,*/}

        {/*        }*/}

        {/*    })}*/}

        {/*/>*/}
        {/*<Stack.Screen*/}
        {/*    name="Time Off Type"*/}
        {/*    component={staffBackHandler(StaffTimeOffTypeScreen)}*/}
        {/*    options={({navigation, route}) => ({*/}
        {/*        headerShown: true,*/}
        {/*        headerTitleAlign: "center",*/}
        {/*        headerLeft: () => <BackButton currentRouteName={route.name}/>,*/}
        {/*        // animation:'ios_from_right'*/}
        {/*        headerTitleStyle: {*/}
        {/*            ...textTheme.titleMedium,*/}
        {/*            fontSize: 20,*/}

        {/*        }*/}

        {/*    })}*/}

        {/*/>*/}
        {/*<Stack.Screen*/}
        {/*    name="Staff Name"*/}
        {/*    component={staffBackHandler(StaffInfo)}*/}
        {/*    options={({navigation, route}) => ({*/}
        {/*        headerShown: true,*/}
        {/*        headerTitleAlign: "center",*/}
        {/*        headerLeft: () => <BackButton currentRouteName={route.name}/>,*/}
        {/*        headerTitleStyle: {*/}
        {/*            ...textTheme.titleMedium,*/}
        {/*            fontSize: 20,*/}

        {/*        }*/}
        {/*    })}*/}
        {/*/>*/}
    </Stack.Navigator>)
}

export default CampaignStack