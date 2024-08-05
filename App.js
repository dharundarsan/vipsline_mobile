import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Provider} from 'react-redux';
import {AntDesign, FontAwesome5} from '@expo/vector-icons';
import React from 'react';
import CheckoutScreen from './screens/CheckoutScreen';
import CustomDrawer from './components/common/CustomDrawer';
import AuthScreen from './screens/AuthScreen';
import VerificationCodeScreen from './screens/VerificationCodeScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import store from './store/store';
import Colors from './constants/Colors';
import {enableScreens} from "react-native-screens";

enableScreens();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const screenOptions = {
    headerStyle: {backgroundColor: Colors.white},
    headerTintColor: Colors.white,
    headerTitleAlign: 'center',
};

const CheckoutStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
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
            })}
        />
    </Stack.Navigator>
);

export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaView style={styles.safeAreaView}>
                <NavigationContainer>
                    <StatusBar style="light" backgroundColor={Colors.darkBlue}/>
                    <Drawer.Navigator
                        initialRouteName="Checkout"
                        drawerContent={(props) => <CustomDrawer {...props} />}
                        screenOptions={{
                            drawerActiveTintColor: Colors.highlight,
                            drawerInactiveTintColor: Colors.white,
                            headerShown: false, // Hide drawer navigator headers
                        }}
                    >
                        <Drawer.Screen
                            name="Dashboard"
                            component={CheckoutStack}
                            options={{
                                drawerIcon: (props) => <FontAwesome5 name="calendar" size={props.size}
                                                                     color={props.color}/>
                            }}
                        />
                        <Drawer.Screen
                            name="Appointments"
                            component={CheckoutStack}
                            options={{
                                drawerIcon: (props) => <FontAwesome5 name="calendar" size={props.size}
                                                                     color={props.color}/>
                            }}
                        />
                        <Drawer.Screen
                            name="Checkout"
                            component={CheckoutStack}
                            options={{drawerLabel: 'Checkout'}}
                        />
                        <Drawer.Screen name="Clients" component={CheckoutStack}/>
                        <Drawer.Screen name="Marketing" component={CheckoutStack}/>
                        <Drawer.Screen name="Expenses" component={CheckoutStack}/>
                        <Drawer.Screen
                            name="Reports"
                            component={CheckoutStack}
                            options={{
                                drawerIcon: (props) => <AntDesign name="piechart" size={props.size}
                                                                  color={props.color}/>
                            }}
                        />
                        <Drawer.Screen name="Catalogue" component={CheckoutStack}/>
                        <Drawer.Screen name="Discounts" component={CheckoutStack}/>
                        <Drawer.Screen name="Settings" component={CheckoutStack}/>
                        <Drawer.Screen name="Staffs" component={CheckoutStack}/>
                        <Drawer.Screen name="List of Business" component={CheckoutStack}/>
                        <Drawer.Screen name="Add Business" component={CheckoutStack}/>
                        <Drawer.Screen name="Feedback" component={CheckoutStack}/>
                        <Drawer.Screen
                            name="Authentication Test"
                            component={AuthScreen}
                            options={{headerShown: false}}
                        />
                    </Drawer.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </Provider>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
});
