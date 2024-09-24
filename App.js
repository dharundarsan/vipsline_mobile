import {StatusBar} from 'expo-status-bar';
import {Alert, BackHandler, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import {RootSiblingParent} from 'react-native-root-siblings';

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
import {clearCalculatedPrice, clearLocalCart, clearSalesNotes, modifyClientMembershipId} from "./store/cartSlice";
import {clearClientInfo} from "./store/clientInfoSlice";

enableScreens();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = createNativeStackNavigator();
const LandingStack = createNativeStackNavigator();


export default function App() {
    const [loaded, error] = useFonts({
        'Inter-Regular': require('./assets/fonts/Inter/static/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('./assets/fonts/Inter/static/Inter_18pt-Bold.ttf')
    });
    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }
    return (

        <Provider store={store}>
            {/*<SafeAreaView style={styles.safeAreaView}>*/}

            <AppNavigator/>
            {/*</SafeAreaView>*/}
        </Provider>
    );
}

const CheckoutStack = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
            name="CheckoutScreen"
            component={CheckoutScreen}
            options={({navigation}) => ({
                headerLeft: () => (
                    <AntDesign
                        name="menu-fold"
                        size={24}
                        color={Colors.darkBlue}
                        onPress={() => navigation.toggleDrawer()}
                    />
                ),
                presentation: 'modal'
            })}
        />
    </Stack.Navigator>
);


async function isAuthenticatedFunc() {
    let authToken = ""
    try {
        const value = await AsyncStorage.getItem('authKey');
        if (value !== null) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log("auth token fetching error. (inside invoiceSlice loadBookingDetailsFromDb)" + e);
        return false;
    }

}

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


const AppNavigator = () => {

    const dispatch = useDispatch();

    const [isAuthenticated, setIsAuthenticated] = useState(false); // Local state for auth status
    const reduxAuthStatus = useSelector((state) => state.authDetails.isAuthenticated); // Redux state
    const businessChosen = useSelector(state => state.businesses.isBusinessSelected);

    useEffect(() => {
        const backAction = () => {
            Alert.alert(
                "Exit App",
                "Are you sure you want to exit the app?",
                [
                    {
                        text: "No",
                        onPress: () => null, // Do nothing if user presses 'No'
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
                        }, // Exit the app when 'Yes' is pressed
                    }
                ],
                {cancelable: false}
            );
            return true; // Return true to prevent the default back button behavior
        };

        // Add event listener for hardware back press
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove(); // Cleanup the event listener on component unmount
    }, []);

    const checkAuthentication = async () => {
        try {
            const authKey = await AsyncStorage.getItem('authKey');
            if (authKey !== null) {
                setIsAuthenticated(true); // Update local state if the user is authenticated
                // console.log("authkeyStatu" + authKey);
                dispatch(updateAuthStatus(true));

            } else {
                setIsAuthenticated(false);
                dispatch(updateAuthStatus(false));
            }
        } catch (e) {
            console.log('Error checking authentication:', e);
            setIsAuthenticated(false);
        }


    };

    useEffect(() => {
        checkAuthentication(); // Initial auth check
    }, [reduxAuthStatus]); // Dependency on Redux authentication status


    return (
        <NavigationContainer>
            <SafeAreaProvider>
                {isAuthenticated ?
                    <>
                        <MainDrawerNavigator/>
                    </>
                    : <AuthNavigator/>}
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

const LandingScreen = () => (
    <LandingStack.Navigator screenOptions={{headerShown: false}}>
        <LandingStack.Screen
            name="ListOfBusinessesScreen"
            component={ListOfBusinessesScreen}
        />
    </LandingStack.Navigator>
);

const MainDrawerNavigator = () => {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'List of Business'}],
            })
        );
    }, []);

    return <Drawer.Navigator
        initialRouteName="List of Business"
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={({navigation}) => ({
            drawerActiveTintColor: Colors.highlight,
            drawerInactiveTintColor: Colors.white,
            drawerStyle: {backgroundColor: Colors.darkBlue},
            headerTitleStyle: [textTheme.titleLarge],
            headerStyle: {
                elevation: 4,             // Shadow strength
                backgroundColor: '#fff',  // Background color
                shadowColor: '#000',      // Shadow color
                shadowOffset: {width: 0, height: 10}, // Offset for bottom shadow
                shadowOpacity: 0.1,       // Opacity (optional for cross-platform)
                shadowRadius: 3.84,       // Blur radius (optional for cross-platform)
                borderBottomWidth: 0.5,     // Helps define a stronger bottom line
                borderColor: 'rgba(0,0,0,0.1)' // Subtle color to simulate the bottom shadow
            },
            headerLeft: () => <CustomDrawerIcon navigation={navigation}/>,
            drawerIcon: ({focused}) => (
                <Image
                    source={require('./assets/icons/drawerIcons/drawer.png')}
                    style={{width: 24, height: 24}}
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
            options={{
                drawerLabel: 'Checkout',
                drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(checkout_icon).uri}}
                                         width={25} height={25} style={{resizeMode: "contain"}}/>,
                headerTitle: "Add to cart",
                headerTitleAlign: "center",
            }}
        />
        <Drawer.Screen
            name="Clients"
            component={ClientSegmentScreen} // Use the modal stack here
            options={{
                drawerIcon: () => (
                    <Image
                        source={{uri: Image.resolveAssetSource(clients_icon).uri}}
                        width={25}
                        height={25}
                        style={{resizeMode: 'contain'}}
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
            drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(list_of_businesses_icon).uri}}
                                     width={25} height={25} style={{resizeMode: "contain"}}/>
        }}/>
        {/*<Drawer.Screen name="Add Business" component={CheckoutStack} options={{*/}
        {/*    drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(add_businesses_icon).uri }}*/}
        {/*        width={25} height={25} style={{ resizeMode: "contain" }} />*/}
        {/*}} />*/}
        {/*<Drawer.Screen name="Feedback" component={CheckoutStack} options={{*/}
        {/*    drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(feedback_icon).uri}}*/}
        {/*                             width={25} height={25} style={{resizeMode: "contain"}}/>*/}
        {/*}}/>*/}
        <Drawer.Screen name="Sign Out" component={signOutScreen} options={{
            drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(logout_icon).uri}}
                                     width={25} height={25} style={{resizeMode: "contain", tintColor: Colors.white}}/>
        }}/>
    </Drawer.Navigator>
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    }
});