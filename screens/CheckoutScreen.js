import {ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import Cart from "../components/checkoutScreen/Cart";
import AddClientButton from "../components/checkoutScreen/AddClientButton";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import title from "react-native-paper/src/components/Typography/v2/Title";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    loadMembershipsDataFromDb,
    loadPackagesDataFromDb,
    loadProductsDataFromDb,
    loadServicesDataFromDb,
} from '../store/catalogueSlice';
import {
    clearClientsList,
    loadClientCountFromDb, loadClientsFromDb,
} from '../store/clientSlice';
import AddClientModal from "../components/checkoutScreen/AddClientModal";
import {
    loadClientFiltersFromDb,
} from "../store/clientFilterSlice";
import {clearClientInfo, loadClientInfoFromDb} from "../store/clientInfoSlice";
import {loadBusinessesListFromDb, loadBusinessNotificationDetails} from "../store/listOfBusinessSlice";
import {loadLoginUserDetailsFromDb} from "../store/loginUserSlice";
import {loadStaffsFromDB} from "../store/staffSlice";
import {
    clearCustomItems,
    clearLocalCart,
    clearSalesNotes,
    loadCartFromDB,
    modifyClientMembershipId
} from "../store/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loadBookingDetailsFromDb} from "../store/invoiceSlice";
import clearCartAPI from "../util/apis/clearCartAPI";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocationContext } from "../context/LocationContext";


const CheckoutScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    // const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);
    const reduxAuthStatus = useSelector((state) => state.authDetails.isAuthenticated);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchClientQuery, setSearchClientQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [showDrawerIcon, setShowDrawerIcon] = useState(true);

    const cartItems = useSelector(state => state.cart.items)
    const businessId = useSelector(state => state.authDetails.businessId);

    const { getLocation, reload, setReload } = useLocationContext();

    useFocusEffect(useCallback(() => {
        getLocation("CheckoutScreen");
    }, []))

    // console.log(route.params.showDrawerIcon());

    useEffect(() => {
        route.params.showDrawerIcon(showDrawerIcon)
    }, [showDrawerIcon]);

    useEffect(() => {
        const loadData = async () => {
            if (!reload) {
                setIsLoading(true)
                setShowDrawerIcon(false);
                if (businessId !== "") {

                    await clearCartAPI();
                    dispatch(clearCustomItems());
                    dispatch(clearLocalCart());
                    dispatch(clearSalesNotes());
                    dispatch(modifyClientMembershipId({type: "clear"}))
                    await dispatch(loadServicesDataFromDb("women"));
                    await dispatch(loadServicesDataFromDb("men"));
                    await dispatch(loadServicesDataFromDb("kids"));
                    await dispatch(loadServicesDataFromDb("general"));
                    await dispatch(loadProductsDataFromDb());
                    await dispatch(loadPackagesDataFromDb());
                    await dispatch(loadMembershipsDataFromDb());
                    // await dispatch(loadClientsFromDb());
                    await dispatch(loadClientCountFromDb());
                    await dispatch(loadClientFiltersFromDb(10, "All"));
                    await dispatch(loadBusinessesListFromDb());
                    await dispatch(loadLoginUserDetailsFromDb());
                    await dispatch(loadStaffsFromDB());
                    await dispatch(loadBusinessNotificationDetails());

                    // dispatch(loadCartFromDB());
                    // dispatch(loadBookingDetailsFromDb());
                }
                setIsLoading(false);
            }
            setShowDrawerIcon(true);
        }
        loadData();

    }, [businessId]);


    useFocusEffect(
        useCallback(() => {
            // Function to execute whenever the drawer screen is opened
            if (businessId !== "") {
                dispatch(loadClientsFromDb());
            }
            // Optional cleanup function when screen is unfocused
            return () => {
                dispatch(clearClientsList());
            };
        }, [businessId])
    );

    return (
        isLoading ? <ActivityIndicator size={"large"} style={{flex: 1, backgroundColor: Colors.white}}/> :
            <View style={[styles.checkoutScreen, {
                paddingBottom: insets.bottom
            }]}>
                <AddClientModal setSearchClientQuery={setSearchClientQuery}
                                searchClientQuery={searchClientQuery}
                                closeModal={() => {
                                    setIsAddClientModalVisible(false)
                                }} isVisible={isAddClientModalVisible}/>
                <AddClientButton setSearchClientQuery={setSearchClientQuery}
                    searchClientQuery={searchClientQuery}
                    onPress={() => {
                        setIsAddClientModalVisible(true)
                    }} />
                <Cart />
            </View>
    );
}

const styles = StyleSheet.create({
    checkoutScreen: {
        flex: 1,
        backgroundColor: Colors.background,
    },

});

export default CheckoutScreen;