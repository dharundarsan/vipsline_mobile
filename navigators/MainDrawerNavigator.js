import {useNavigation} from "@react-navigation/native";
import {useLocationContext} from "../context/LocationContext";
import {useDataContext} from "../context/DataFlowContext";
import React, {useEffect, useState} from "react";
import {Alert, BackHandler, Image, TouchableOpacity} from "react-native";
import clearCartAPI from "../apis/checkoutAPIs/clearCartAPI";
import {
    clearCalculatedPrice,
    clearCustomItems,
    clearLocalCart,
    clearSalesNotes,
    modifyClientMembershipId
} from "../store/cartSlice";
import {clearClientInfo} from "../store/clientInfoSlice";
import {useDispatch, useSelector} from "react-redux";
import {loadBusinessesListFromDb} from "../store/listOfBusinessSlice";
import {loadLoginUserDetailsFromDb} from "../store/loginUserSlice";
import AuthNavigator from "./AuthNavigator";
import CustomDrawer from "../components/common/CustomDrawer";
import Colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import DashboardStack from "../stacks/DashboardStack";
import calender_icon from "../assets/icons/drawerIcons/calendar.png";
import CheckoutStack from "../stacks/CheckoutStack";
import checkout_icon from "../assets/icons/drawerIcons/checkout.png";
import ClientSegmentScreen from "../screens/ClientSegmentScreen";
import clients_icon from "../assets/icons/drawerIcons/clients.png";
import LeadManagementStack from "../stacks/LeadManagementStack";
import lead_management_icon from "../assets/icons/drawerIcons/lead_management.png";
import Expenses from "../screens/Expenses";
import staffs_icon from "../assets/icons/drawerIcons/staffs.png";
import reports_icon from "../assets/icons/drawerIcons/reports.png"
import expenses_icon from "../assets/icons/drawerIcons/expenses.png";
import ListOfBusinessesScreen from "../screens/ListOfBusinessesScreen";
import list_of_businesses_icon from "../assets/icons/drawerIcons/list_of_businesses.png";
import signOutScreen from "../screens/signOutScreen";
import logout_icon from "../assets/icons/drawerIcons/logout.png";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {
    loadResourceIdByUserInfo,
    loadRevenueByGender,
    loadRevenueByPrepaid,
    loadRevenueCountByGender, loadStaffDashboardReport
} from "../store/dashboardSlice";
import {formatDateYYYYMMDD, formatDateYYYYMMDDD, getFirstDateOfCurrentMonthYYYYMMDD} from "../util/Helpers";
import {AntDesign} from "@expo/vector-icons";
import BottomActionCard from "../ui/BottomActionCard";
import StaffManagementScreen from "../screens/StaffManagementScreen";
import staffManagementStack from "../stacks/StaffManagementStack";
import CustomCancelSale from "../ui/CustomCancelSale";
import ReportStack from "../stacks/ReportStack";

function CustomDrawerIcon({navigation}) {
    return (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image
                source={require('../assets/icons/drawerIcons/drawer.png')}
                style={{width: 24, height: 24, marginLeft: 16}}
            />
        </TouchableOpacity>
    );
}

const BackButton = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const username = useSelector((state) => state.loginUser.details);
    const page = useSelector((state) => state.dashboardDetails.dashboardName)
    return (
        <TouchableOpacity
            style={{left: 15}}
            onPress={async () => {
                // setTimeout(() => {
                //     setIsDashboardPage(true)
                // }, 40);
                // setTimeout(() => {
                // dispatch(loadSalesDashboard(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
                // dispatch(loadTopRevenueServices(getFirstDateOfCurrentMonthYYYYMMDD(), getLastDateOfCurrentMonthYYYYMMMDD()));
                // dispatch(loadTopRevenueProducts(getFirstDateOfCurrentMonthYYYYMMDD(), getLastDateOfCurrentMonthYYYYMMMDD()));
                if (page === "Client") {
                    dispatch(loadRevenueByGender(getFirstDateOfCurrentMonthYYYYMMDD(), formatDateYYYYMMDDD()));
                    dispatch(loadRevenueCountByGender(getFirstDateOfCurrentMonthYYYYMMDD(), formatDateYYYYMMDDD()));
                    dispatch(loadRevenueByPrepaid(getFirstDateOfCurrentMonthYYYYMMDD(), formatDateYYYYMMDDD()));
                } else if (page === "Staff") {
                    dispatch(loadResourceIdByUserInfo(username.username));
                    dispatch(loadStaffDashboardReport(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
                }
                navigation.navigate("DashboardScreen")
            }}
        >
            <AntDesign name="arrowleft" size={24} color="black"/>
        </TouchableOpacity>
        // <TouchableOpacity onPress={async() => {
        //     // setTimeout(() => {
        //     //     setIsDashboardPage(true)
        //     // }, 40);
        //     // setTimeout(() => {
        //         // dispatch(loadSalesDashboard(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
        //         // dispatch(loadTopRevenueServices(getFirstDateOfCurrentMonthYYYYMMDD(), getLastDateOfCurrentMonthYYYYMMMDD()));
        //         // dispatch(loadTopRevenueProducts(getFirstDateOfCurrentMonthYYYYMMDD(), getLastDateOfCurrentMonthYYYYMMMDD()));
        //         if(page === "Client"){
        //             dispatch(loadRevenueByGender(getFirstDateOfCurrentMonthYYYYMMDD(), formatDateYYYYMMDDD()));
        //             dispatch(loadRevenueCountByGender(getFirstDateOfCurrentMonthYYYYMMDD(), formatDateYYYYMMDDD()));
        //             dispatch(loadRevenueByPrepaid(getFirstDateOfCurrentMonthYYYYMMDD(), formatDateYYYYMMDDD()));
        //         }
        //         else if(page === "Staff"){
        //             dispatch(loadResourceIdByUserInfo(username.username));
        //             dispatch(loadStaffDashboardReport(formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)));
        //         }
        //         navigation.navigate("DashboardScreen")
        //     // }, 50);
        // }}
        // style={{ paddingLeft: 10 }}>
        // <Text style={{ color: '#007bff', fontSize: 18 }}>Back</Text>
        // </TouchableOpacity>
    );
};

const MainDrawerNavigator = (props) => {
    const navigation = useNavigation();
    const {currentLocation, reload, setReload} = useLocationContext();
    const {isDashboardPage} = useDataContext();
    const Drawer = createDrawerNavigator();

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
                {cancelable: false}
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
    const currentRoute = useSelector(state => state.navigation.current);
    return (
        <>
            {!props.auth ? <AuthNavigator/> :
                isDelete ? <CustomCancelSale
                isVisible={isDelete}
                        setVisible={setIsDelete}
                        onCloseModal={async () => {
                            setTimeout(() => {
                                setIsDelete(false);
                                navigation.navigate("Checkout", {screen: "CheckoutScreen"});
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
                            dispatch(modifyClientMembershipId({type: "clear"}));
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
                            screenOptions={({route,navigation}) => ({
                                drawerActiveTintColor: Colors.highlight,
                                drawerInactiveTintColor: Colors.white,
                                drawerStyle: {backgroundColor: Colors.darkBlue},
                                headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],

                                headerStyle: {
                                    elevation: 4,
                                    backgroundColor: '#fff',
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 10},
                                    shadowOpacity: 0.1,
                                    shadowRadius: 3.84,
                                    borderBottomWidth: 0.5,
                                    borderColor: 'rgba(0,0,0,0.1)'
                                },
                                headerLeft: () => <CustomDrawerIcon navigation={navigation}/>,
                                drawerIcon: ({focused}) => (
                                    <Image
                                        source={require('../assets/icons/drawerIcons/drawer.png')}
                                        style={{width: 24, height: 24}}
                                    />
                                )
                            })}
                        >
                            <Drawer.Screen
                                name="Dashboard"
                                component={DashboardStack}
                                options={({navigation, route}) => ({
                                    // headerLeft: currentLocation !== "Dashboard" ? () => <BackButton/> : () =>
                                    //     <CustomDrawerIcon navigation={navigation}/>,
                                    // headerTitle: `${currentLocation}`,
                                    // headerTitleAlign: "center",
                                    swipeEnabled: currentLocation !== "DashboardScreen" ? false : true,
                                    // headerShown: isDashboardPage,
                                    drawerIcon: () => <Image
                                        source={{uri: Image.resolveAssetSource(calender_icon).uri}} width={25}
                                        height={25}
                                        style={{resizeMode: "contain"}}/>,
                                    headerShown:false
                                })}
                            />
                            {/*<Drawer.Screen*/}
                            {/*    name="Appointments"*/}
                            {/*    component={AppointmentsScreen}*/}
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
                                    drawerIcon: () => <Image
                                        source={{uri: Image.resolveAssetSource(checkout_icon).uri}}
                                        width={25} height={25} style={{resizeMode: "contain"}}/>,
                                    headerTitle: "Add to cart",
                                    headerTitleAlign: "center",
                                    headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],
                                    headerLeft: !showDrawerIcon ? () => null : () => <CustomDrawerIcon
                                        navigation={navigation}/>,
                                    swipeEnabled: showDrawerIcon
                                })}
                                initialParams={{showDrawerIcon: setShowDrawerIcon}}
                            />
                            <Drawer.Screen
                                name="Clients"
                                component={ClientSegmentScreen} // Use the modal stack here
                                options={{
                                    headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],
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
                            <Drawer.Screen name="Lead Management"
                                           component={LeadManagementStack}
                                           options={{
                                               drawerIcon: () => <Image
                                                   source={{uri: Image.resolveAssetSource(lead_management_icon).uri}}
                                                   width={25}
                                                   height={25}
                                                   style={{resizeMode: "contain"}}/>,
                                               headerTitle: 'Lead Management',
                                               headerTitleAlign: 'center',
                                               headerShown: currentRoute !== "Lead Profile",
                                           }}/>
                            {/*<Drawer.Screen name="Marketing" component={CheckoutStack} options={{*/}
                            {/*    drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(marketing_icon).uri}}*/}
                            {/*                             width={25} height={25} style={{resizeMode: "contain"}}/>*/}
                            {/*}}/>*/}
                            <Drawer.Screen name="Expenses" component={Expenses}
                                           options={{
                                               headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],
                                               drawerIcon: () => <Image
                                                   source={{uri: Image.resolveAssetSource(expenses_icon).uri}}
                                                   width={25}
                                                   height={25}
                                                   style={{resizeMode: "contain", tintColor: Colors.white}}/>,
                                               headerTitleAlign: 'center',
                                           }}/>
                            {/* <Drawer.Screen
                               name="Reports"
                               component={ReportStack}
                               options={{
                                headerShown:false,
                                   drawerIcon: () => <Image
                                       source={{ uri: Image.resolveAssetSource(reports_icon).uri }} width={25} height={25}
                                       style={{ resizeMode: "contain" }} />
                               }}
                            /> */}
                            {/* <Drawer.Screen name="Catalogue" component={CheckoutStack} options={{
                                drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(catalogue_icon).uri }}
                                    width={25} height={25} style={{ resizeMode: "contain" }} />
                            }} />
                            <Drawer.Screen name="Discounts" component={CheckoutStack} options={{
                                drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(discounts_icon).uri }}
                                    width={25} height={25} style={{ resizeMode: "contain" }} />
                            }} />
                            <Drawer.Screen name="Settings" component={CheckoutStack} options={{
                                drawerIcon: () => <Image source={{ uri: Image.resolveAssetSource(settings_icon).uri }}
                                    width={25} height={25} style={{ resizeMode: "contain" }} /> 
                            }} />  */}
                            {/* <Drawer.Screen name="Staffs" component={staffManagementStack} options={{
                                headerShown: false,
                                drawerIcon: () => <Image source={{uri: Image.resolveAssetSource(staffs_icon).uri}}
                                                         width={25} height={25} style={{resizeMode: "contain"}}/>
                            }}/> */}
                            <Drawer.Screen name="List of Business" component={ListOfBusinessesScreen} options={{
                                headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],
                                headerLeft: () => null,
                                swipeEnabled: false,
                                drawerIcon: () => <Image
                                    source={{uri: Image.resolveAssetSource(list_of_businesses_icon).uri}}
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
                            <Drawer.Screen name="Sign Out" component={signOutScreen}
                                           options={{
                                               headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],
                                               drawerIcon: () => <Image
                                                   source={{uri: Image.resolveAssetSource(logout_icon).uri}}
                                                   width={25}
                                                   height={25}
                                                   style={{resizeMode: "contain", tintColor: Colors.white}}/>
                                           }}/>
                        </Drawer.Navigator>
                        : <Drawer.Navigator initialRouteName="List Of Business"
                                            drawerContent={(props) => <CustomDrawer {...props} />}
                                            screenOptions={({navigation}) => ({
                                                drawerActiveTintColor: Colors.highlight,
                                                drawerInactiveTintColor: Colors.white,
                                                drawerStyle: {backgroundColor: Colors.darkBlue},
                                                headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],
                                                headerStyle: {
                                                    elevation: 4,
                                                    backgroundColor: '#fff',
                                                    shadowColor: '#000',
                                                    shadowOffset: {width: 0, height: 10},
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 3.84,
                                                    borderBottomWidth: 0.5,
                                                    borderColor: 'rgba(0,0,0,0.1)'
                                                },
                                                headerLeft: () => <CustomDrawerIcon navigation={navigation}/>,
                                                drawerIcon: ({focused}) => (
                                                    <Image
                                                        source={require('../assets/icons/drawerIcons/drawer.png')}
                                                        style={{width: 24, height: 24}}
                                                    />
                                                )
                                            })}>
                            <Drawer.Screen name="List of Business" component={ListOfBusinessesScreen} options={{
                                headerLeft: () => null,
                                swipeEnabled: false,
                                headerTitleStyle: [textTheme.titleLarge, {letterSpacing: -0.5}],
                                drawerIcon: () => <Image
                                    source={{uri: Image.resolveAssetSource(list_of_businesses_icon).uri}}
                                    width={25} height={25} style={{resizeMode: "contain"}}/>
                            }}/>
                        </Drawer.Navigator>
            }
        </>
    )
};

export default MainDrawerNavigator;