import {StatusBar} from 'expo-status-bar';
import {
    Alert,
    AppState,
    BackHandler,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {CommonActions, NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AntDesign, FontAwesome5} from '@expo/vector-icons';
import React, {useCallback, useState, useEffect} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import CheckoutScreen from './screens/CheckoutScreen';
import CustomDrawer from './components/common/CustomDrawer';
import AuthScreen from './screens/AuthScreen';
import VerificationCodeScreen from './screens/VerificationCodeScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import store from './store/store';
import Colors from './constants/Colors';
import {enableScreens} from "react-native-screens";
import ListOfBusinessesScreen from "./screens/ListOfBusinessesScreen";
// import ClientSegmentScreen from "./screens/ClientSegmentScreen";
//Font And SplashScreen Imports
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';


SplashScreen.preventAutoHideAsync();


// Drawer icon imports
import calender_icon from "./assets/icons/drawerIcons/calendar.png";
import catalogue_icon from "./assets/icons/drawerIcons/catalogue.png";
import add_businesses_icon from "./assets/icons/drawerIcons/add_businesses.png";
import checkout_icon from "./assets/icons/drawerIcons/checkout.png";
import clients_icon from "./assets/icons/drawerIcons/clients.png";
import discounts_icon from "./assets/icons/drawerIcons/discounts.png";
import expenses_icon from "./assets/icons/drawerIcons/expenses.png";
import feedback_icon from "./assets/icons/drawerIcons/feedback.png";
import logout_icon from "./assets/icons/drawerIcons/logout.png";
import list_of_businesses_icon from "./assets/icons/drawerIcons/list_of_businesses.png";
import marketing_icon from "./assets/icons/drawerIcons/marketing.png";
import staffs_icon from "./assets/icons/drawerIcons/staffs.png";
import settings_icon from "./assets/icons/drawerIcons/settings.png";
import reports_icon from "./assets/icons/drawerIcons/reports.png";
import ClientSegmentScreen from "./screens/ClientSegmentScreen";
import {useFonts} from "expo-font";
import textTheme from "./constants/TextTheme";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import signOutScreen from "./screens/signOutScreen";
import checkoutScreen from "./screens/CheckoutScreen";
import {updateAuthStatus} from "./store/authSlice";
import clearCartAPI from "./util/apis/clearCartAPI";
import { clearCalculatedPrice, clearCustomItems, clearLocalCart, clearSalesNotes, modifyClientMembershipId } from "./store/cartSlice";
import { clearClientInfo } from "./store/clientInfoSlice";
import DeleteClient from './components/clientSegmentScreen/DeleteClientModal';
import { LocationProvider, useLocationContext } from './context/LocationContext';
import { loadBusinessesListFromDb } from './store/listOfBusinessSlice';
import { loadLoginUserDetailsFromDb } from './store/loginUserSlice';
import drawerItem from "react-native-paper/src/components/Drawer/DrawerItem";
import * as SecureStore from 'expo-secure-store';
import UserInactivity from "react-native-user-inactivity";

enableScreens();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = createNativeStackNavigator();


export default function App() {
    const [loaded, error] = useFonts({
        'Inter-Regular': require('./assets/fonts/Inter/static/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter/static/Inter_18pt-Bold.ttf')
    });
    const [isAuth, setIsAuth] = useState(false)
    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
        async function get(){
            setIsAuth(!!await SecureStore.getItemAsync('authKey'))
        }
        get();
        // const subscription = AppState.addEventListener('change', handleAppStateChange);
        // return () => subscription.remove();

    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }


    // const handleAppStateChange = (nextAppState) => {
    //     if (nextAppState === 'background') {
    //         // App is in the background
    //         console.log('App has moved to the background');
    //     } else if (nextAppState === 'active') {
    //         // App has come to the foreground
    //         console.log('App is active');
    //     }
    // };

    // const [isActive, setIsActive] = useState(true);

    // Callback to handle user activity
    // const handleUserActivity = (active) => {
    //     console.log(active);
    //     if(!active) {
    //
    //     Alert.alert("this is app time out alert", "please close the app and restart");
    //     }
    // };

    return (

        <Provider store={store}>
            {/*<UserInactivity*/}
            {/*    timeForInactivity={5000}  // Time in milliseconds*/}
            {/*    onAction={handleUserActivity}  // Callback when user becomes inactive*/}
            {/*    style={{ flex: 1 }}*/}
            {/*>*/}
            {/*<SafeAreaView style={styles.safeAreaView}>*/}

            <AppNavigator auth={isAuth} setAuth={setIsAuth}/>
            {/*</SafeAreaView>*/}
            {/*</UserInactivity>*/}
        </Provider>
    );
}

const CheckoutStack = ({route}) => {
    // console.log(route.params.showDrawerIcon)
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
    </Stack.Navigator>
};


function CustomDrawerIcon({navigation}) {
    return (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image
                source={require('./assets/icons/drawerIcons/drawer.png')}
                style={{width: 24, height: 24, marginLeft: 16}}
            />
        </TouchableOpacity>
    );
}


const AppNavigator = (props) => {

    const dispatch = useDispatch();

    const reduxAuthStatus = useSelector((state) => state.authDetails.isAuthenticated);



    // useEffect(() => {
    //     const backAction = () => {
    //         Alert.alert(
    //             "Exit App",
    //             "Are you sure you want to exit the app?",
    //             [
    //                 {
    //                     text: "No",
    //                     onPress: () => null,
    //                     style: "cancel"
    //                 },
    //                 {
    //                     text: "Yes",
    //                     onPress: () => {
    //
    //                         clearCartAPI();
    //                         dispatch(modifyClientMembershipId({type: "clear"}))
    //                         dispatch(clearSalesNotes());
    //                         dispatch(clearLocalCart());
    //                         dispatch(clearClientInfo());
    //                         dispatch(clearCalculatedPrice());
    //                         BackHandler.exitApp();
    //
    //
    //                     },
    //                 }
    //             ],
    //             { cancelable: false }
    //         );
    //         return true;
    //     };
    //
    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         backAction
    //     );
    //
    //     return () => backHandler.remove();
    // }, []);

    const checkAuthentication = async () => {
        try {
            // const authKey = await AsyncStorage.getItem('authKey');
            const authKey = await SecureStore.getItemAsync('authKey');
            if (authKey !== null) {
                // setIsAuthenticated(true);
                dispatch(updateAuthStatus(true));
                props.setAuth(true)

            } else {
                // setIsAuthenticated(false);
                dispatch(updateAuthStatus(false));
                props.setAuth(false);
            }
        } catch (e) {
            console.log('Error checking authentication:', e);
            dispatch(updateAuthStatus(false));
            // setIsAuthenticated(false);
        }


    };

    useEffect(() => {
        checkAuthentication();
    }, [reduxAuthStatus]);


    return (
        <NavigationContainer>
            <SafeAreaProvider>
                {/* {isAuth ? */}
                    <LocationProvider>
                        <MainDrawerNavigator auth={props.auth}/>
                    </LocationProvider>
                    {/* : <AuthNavigator/>} */}
            </SafeAreaProvider>
        </NavigationContainer>
    );
};

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
        <AuthStack.Screen name="AuthScreen" component={AuthScreen}/>
        <AuthStack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen}/>
        <AuthStack.Screen name="VerificationCodeScreen" component={VerificationCodeScreen}/>
    </AuthStack.Navigator>
);


const MainDrawerNavigator = (props) => {
    const navigation = useNavigation();
    const { currentLocation, reload, setReload } = useLocationContext();
    useEffect(() => {
        const backAction = () => {
            Alert.alert(
                "Exit App",
                "Are you sure you want to exit the app?",
                [
                    {
                        text: "No",
                        onPress: () => null,
                        style: "cancel"
                    },
                    {
                        text: "Yes",
                        onPress: () => {

                            clearCartAPI();
                            dispatch(modifyClientMembershipId({type: "clear"}))
                            dispatch(clearSalesNotes());
                            dispatch(clearLocalCart());
                            dispatch(clearClientInfo());
                            dispatch(clearCalculatedPrice());
                            BackHandler.exitApp();
                            navigation.navigate("List of Business");

                        },
                    }
                ],
                { cancelable: false }
            );
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);
    const cartItems = useSelector(state => state.cart.items);

    const [isDelete, setIsDelete] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentLocation !== "CheckoutScreen" && cartItems.length !== 0) {
            setIsDelete(true);
        } else {
            setIsDelete(false);
        }
    }, [currentLocation, cartItems]);
    const [showDrawerIcon, setShowDrawerIcon] = useState(true)

    useEffect(() => {
        if (reload ^ currentLocation === "List of Business" && cartItems.length === 0) {
            dispatch(clearClientInfo());
            dispatch(clearCustomItems());
            // console.log(reload);
            dispatch(clearLocalCart());
            clearCartAPI();
            dispatch(loadBusinessesListFromDb());
            dispatch(loadLoginUserDetailsFromDb());
        }
    }, [currentLocation])
    const wentToBusiness = useSelector(state => state.authDetails.inBusiness)
    
    return (
        <>
            {!props.auth ? <AuthNavigator/> :
                isDelete ?
                    <DeleteClient
                        isVisible={isDelete}
                        setVisible={setIsDelete}
                        onCloseModal={async () => {
                            setTimeout(() => {
                                setIsDelete(false);
                                navigation.navigate("Checkout", { screen: "CheckoutScreen" });
                            }, 10);
                            setReload(true)
                            // console.log(navigationRef.current.getRootState());
                            // navigate("Checkout")
                        }}
                        ActionOptionName={"Cancel Sale"}
                        header={"Cancel Sale"}
                        content={"If you cancel this sale transaction will not be processed."}
                        onCloseClientInfoAfterDeleted={async () => {
                            await clearCartAPI();
                            dispatch(modifyClientMembershipId({ type: "clear" }));
                            clearSalesNotes();
                            dispatch(clearLocalCart());
                            dispatch(clearClientInfo());
                            dispatch(clearCalculatedPrice());
                            setTimeout(() => {
                                // navigation.navigate("Checkout", { screen: "CheckoutScreen" });
                                setReload(false);
                                navigation.navigate(currentLocation);
                            }, 10);
                        }}
                        checkoutScreenToast={() => null}
                    />
                    :
                    wentToBusiness ?
                        <Drawer.Navigator
                            initialRouteName="Checkout"
                            drawerContent={(props) => <CustomDrawer {...props} />}
                            screenOptions={({ navigation }) => ({
                                drawerActiveTintColor: Colors.highlight,
                                drawerInactiveTintColor: Colors.white,
                                drawerStyle: { backgroundColor: Colors.darkBlue },
                                headerTitleStyle: [textTheme.titleLarge],
                                headerStyle: {
                                    elevation: 4,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3.84,
                                    borderBottomWidth: 0.5,
                                    borderColor: 'rgba(0,0,0,0.1)'
                                },
                                headerLeft: () => <CustomDrawerIcon navigation={navigation} />,
                                drawerIcon: ({ focused }) => (
                                    <Image
                                        source={require('./assets/icons/drawerIcons/drawer.png')}
                                        style={{ width: 24, height: 24 }}
                                    />
                                )
                            })}
                        >
                            {/*<Drawer.Screen*/}
                            {/*    name="Dashboard"*/}
                            {/*    component={CheckoutStack}*/}
                            {/*    options={{*/}
                            {/*        drawerIcon: () => <Image*/}
                            {/*            source={{ uri: Image.resolveAssetSource(calender_icon).uri }} width={25} height={25}*/}
                            {/*            style={{ resizeMode: "contain" }} />*/}
                            {/*    }}*/}
                            {/*/>*/}
                            {/*<Drawer.Screen*/}
                            {/*    name="Appointments"*/}
                            {/*    component={CheckoutStack}*/}
                            {/*    options={{*/}
                            {/*        drawerIcon: () => <Image*/}
                            {/*            source={{ uri: Image.resolveAssetSource(calender_icon).uri }} width={25} height={25}*/}
                            {/*            style={{ resizeMode: "contain" }} />*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <Drawer.Screen
                                name="Checkout"
                                component={CheckoutStack}
                                options={({navigation}) => ({
                                    drawerLabel: 'Checkout',
                                    drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(checkout_icon).uri }}
                                        width={25} height={25} style={{ resizeMode: "contain" }} />,
                                    headerTitle: "Add to cart",
                                    headerTitleAlign: "center",
                                    headerLeft: !showDrawerIcon ? () =>  null :()=>  <CustomDrawerIcon navigation={navigation} />,
                                    swipeEnabled: showDrawerIcon
                                })}
                                initialParams={{ showDrawerIcon: setShowDrawerIcon }}
                            />
                            <Drawer.Screen
                                name="Clients"
                                component={ClientSegmentScreen} // Use the modal stack here
                                options={{
                                    drawerIcon: () => (
                                        <Image
                                            source={{ uri: Image.resolveAssetSource(clients_icon).uri }}
                                            width={25}
                                            height={25}
                                            style={{ resizeMode: 'contain' }}
                                        />
                                    ),
                                    headerTitle: 'Client Segment',
                                    headerTitleAlign: 'center',
                                }}
                            />
                            {/*<Drawer.Screen name="Marketing" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(marketing_icon).uri}}*/}
                            {/*                             width={25} height={25} style={{resizeMode: "contain"}}/>*/}
                            {/*}}/>*/}
                            {/*<Drawer.Screen name="Expenses" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(expenses_icon).uri }}*/}
                            {/*        width={25} height={25} style={{ resizeMode: "contain" }} />*/}
                            {/*}} />*/}
                            {/*<Drawer.Screen*/}
                            {/*    name="Reports"*/}
                            {/*    component={CheckoutStack}*/}
                            {/*    options={{*/}
                            {/*        drawerIcon: () => <Image*/}
                            {/*            source={{ uri: Image.resolveAssetSource(reports_icon).uri }} width={25} height={25}*/}
                            {/*            style={{ resizeMode: "contain" }} />*/}
                            {/*    }}*/}
                            {/*/>*/}
                            {/*<Drawer.Screen name="Catalogue" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(catalogue_icon).uri }}*/}
                            {/*        width={25} height={25} style={{ resizeMode: "contain" }} />*/}
                            {/*}} />*/}
                            {/*<Drawer.Screen name="Discounts" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(discounts_icon).uri }}*/}
                            {/*        width={25} height={25} style={{ resizeMode: "contain" }} />*/}
                            {/*}} />*/}
                            {/*<Drawer.Screen name="Settings" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(settings_icon).uri }}*/}
                            {/*        width={25} height={25} style={{ resizeMode: "contain" }} />*/}
                            {/*}} />*/}
                            {/*<Drawer.Screen name="Staffs" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(staffs_icon).uri}}*/}
                            {/*                             width={25} height={25} style={{resizeMode: "contain"}}/>*/}
                            {/*}}/>*/}
                            <Drawer.Screen name="List of Business" component={ListOfBusinessesScreen} options={{
                                headerLeft: () => null,
                                swipeEnabled:false,
                                drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(list_of_businesses_icon).uri }}
                                    width={25} height={25} style={{ resizeMode: "contain" }} />
                            }} />
                            {/*<Drawer.Screen name="Add Business" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(add_businesses_icon).uri }}*/}
                            {/*        width={25} height={25} style={{ resizeMode: "contain" }} />*/}
                            {/*}} />*/}
                            {/*<Drawer.Screen name="Feedback" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(feedback_icon).uri}}*/}
                            {/*                             width={25} height={25} style={{resizeMode: "contain"}}/>*/}
                            {/*}}/>*/}
                            <Drawer.Screen name="Sign Out" component={signOutScreen} options={{
                                drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(logout_icon).uri }}
                                    width={25} height={25} style={{ resizeMode: "contain", tintColor: Colors.white }} />
                            }} />
                        </Drawer.Navigator>
                        : <Drawer.Navigator initialRouteName="List Of Business"
                            drawerContent={(props) => <CustomDrawer {...props} />}
                            screenOptions={({ navigation }) => ({
                                drawerActiveTintColor: Colors.highlight,
                                drawerInactiveTintColor: Colors.white,
                                drawerStyle: { backgroundColor: Colors.darkBlue },
                                headerTitleStyle: [textTheme.titleLarge],
                                headerStyle: {
                                    elevation: 4,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3.84,
                                    borderBottomWidth: 0.5,
                                    borderColor: 'rgba(0,0,0,0.1)'
                                },
                                headerLeft: () => <CustomDrawerIcon navigation={navigation} />,
                                drawerIcon: ({ focused }) => (
                                    <Image
                                        source={require('./assets/icons/drawerIcons/drawer.png')}
                                        style={{ width: 24, height: 24 }}
                                    />
                                )
                            })}>
                            <Drawer.Screen name="List of Business" component={ListOfBusinessesScreen} options={{
                                headerLeft: () => null,
                                swipeEnabled:false,
                                drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(list_of_businesses_icon).uri }}
                                    width={25} height={25} style={{ resizeMode: "contain" }} />
                            }} />
                        </Drawer.Navigator>
            }
        </>
    )
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    }
});