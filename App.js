import {Image, TouchableOpacity,} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './store/store';
import {enableScreens} from "react-native-screens";
import * as SplashScreen from 'expo-splash-screen';
import {useFonts} from "expo-font";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {updateAuthStatus} from "./store/authSlice";
import {LocationProvider} from './context/LocationContext';
import * as SecureStore from 'expo-secure-store';
import {DataProvider} from './context/DataFlowContext';
import MainDrawerNavigator from "./navigators/MainDrawerNavigator";

SplashScreen.preventAutoHideAsync();
enableScreens();

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

        async function get() {
            setIsAuth(!!await SecureStore.getItemAsync('authKey'))
        }

        get();
        // const subscription = AppState.addEventListener('change', handleAppStateChange);
        // return () => subscription.remove();

    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (

        <Provider store={store}>
            <AppNavigator auth={isAuth} setAuth={setIsAuth}/>
        </Provider>
    );
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


const AppNavigator = (props) => {
    const dispatch = useDispatch();
    const reduxAuthStatus = useSelector((state) => state.authDetails.isAuthenticated);
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
                    <DataProvider>
                        <MainDrawerNavigator auth={props.auth}/>
                    </DataProvider>
                </LocationProvider>
                {/* : <AuthNavigator/>} */}
            </SafeAreaProvider>
        </NavigationContainer>
    );
};