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
import ServiceRemaindersLandingPage from "../screens/marketing/ServiceRemaindersLandingPage";
import ServiceRemindersLandingPage from "../screens/marketing/ServiceRemaindersLandingPage";
import Reminders from "../screens/marketing/Reminders";
import ServiceReminders from "../screens/marketing/ServiceReminders";
import GreetingsLandingPage from "../components/marketing/greetings/GreetingsLandingPage";
import Greetings from "../components/marketing/greetings/Greetings";
import GreetingsList from "../components/marketing/greetings/GreetingsList";
import WhatsAppReminderReport from "../screens/marketing/WhatsAppReminderReport";
import SMSReminderReport from "../screens/marketing/SMSReminderReport";
import {ServiceReminderReports} from "../screens/marketing/Reports";
import {GreetingsReport} from "../screens/marketing/GreetingsReport";
import GreetingSMSReport from "../screens/marketing/GreetingSMSReport";


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
        <Stack.Screen
            name="Service Reminders Landing Page"
            component={staffBackHandler(ServiceRemindersLandingPage)}
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
            name="Reminders"
            component={staffBackHandler(Reminders)}
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
            name="Service Reminders"
            component={staffBackHandler(ServiceReminders)}
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
            name="Greetings Landing Page"
            component={staffBackHandler(GreetingsLandingPage)}
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
            name="Greetings"
            component={staffBackHandler(Greetings)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }
            })}
        />
        <Stack.Screen
            name="Greetings List"
            component={staffBackHandler(GreetingsList)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }
            })}
        />

        <Stack.Screen
            name="Service Reminders Reports"
            component={staffBackHandler(ServiceReminderReports)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }
            })}
        />
        <Stack.Screen
            name="Whatsapp Reminder"
            component={staffBackHandler(WhatsAppReminderReport)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }
            })}
        />
        <Stack.Screen
            name="SMS Reminder"
            component={staffBackHandler(SMSReminderReport)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }
            })}
        />
        <Stack.Screen
            name="Greetings Report"
            component={staffBackHandler(GreetingsReport)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }
            })}
        />
        <Stack.Screen
            name="Greeting SMS Report"
            component={staffBackHandler(GreetingSMSReport)}
            options={({navigation, route}) => ({
                headerShown: true,
                headerTitleAlign: "center",
                headerLeft: () => <BackButton currentRouteName={route.name}/>,
                headerTitleStyle: {
                    ...textTheme.titleMedium,
                    fontSize: 20,

                }
            })}
        />
    </Stack.Navigator>)
}

export default CampaignStack