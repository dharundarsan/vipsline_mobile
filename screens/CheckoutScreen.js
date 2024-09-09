import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import Cart from "../components/checkoutScreen/Cart";
import AddClientButton from "../components/checkoutScreen/AddClientButton";
import {useNavigation} from "@react-navigation/native";
import title from "react-native-paper/src/components/Typography/v2/Title";
import {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    loadMembershipsDataFromDb,
    loadPackagesDataFromDb,
    loadProductsDataFromDb,
    loadServicesDataFromDb,
} from '../store/catalogueSlice';
import {
    loadClientCountFromDb,
} from '../store/clientSlice';
import AddClientModal from "../components/checkoutScreen/AddClientModal";
import {
    loadClientFiltersFromDb,
} from "../store/clientFilterSlice";
import {clearClientInfo, loadClientInfoFromDb} from "../store/clientInfoSlice";
import {loadBusinessesListFromDb} from "../store/listOfBusinessSlice";
import {loadLoginUserDetailsFromDb} from "../store/loginUserSlice";
import {loadStaffsFromDB} from "../store/staffSlice";
import {loadCartFromDB} from "../store/cartSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";


const CheckoutScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);
    const reduxAuthStatus = useSelector((state) => state.authDetails.isAuthenticated);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const businessId = useSelector(state => state.authDetails.businessId);

    const checkAuthentication = async () => {
        try {
            const authKey = await AsyncStorage.getItem('authKey');
            if (authKey !== null) {
                setIsAuthenticated(true); // Update local state if the user is authenticated
            } else {
                setIsAuthenticated(false);
            }
        } catch (e) {
            console.log('Error checking authentication:', e);
            setIsAuthenticated(false);
        }
    };


    useEffect(() => {
        checkAuthentication(); // Initial auth check
    }, [reduxAuthStatus, isAuthenticated]); // Dependency on Redux authentication status



    useEffect(() => {
                dispatch(loadServicesDataFromDb("women"));
                dispatch(loadServicesDataFromDb("men"));
                dispatch(loadServicesDataFromDb("kids"));
                dispatch(loadServicesDataFromDb("general"));
                dispatch(loadProductsDataFromDb());
                dispatch(loadPackagesDataFromDb());
                dispatch(loadMembershipsDataFromDb());
                // dispatch(loadClientsFromDb());
                dispatch(loadClientCountFromDb());
                dispatch(loadClientFiltersFromDb(10, "All"));
                dispatch(loadBusinessesListFromDb());
                dispatch(loadLoginUserDetailsFromDb());
                dispatch(loadStaffsFromDB());
                dispatch(loadCartFromDB());
                // dispatch(loadBookingDetailsFromDb());
                console.log("checkoutscreen useEffeect");

        }, [businessId]);



        //
        // useEffect(() => {
        //     dispatch(loadServicesDataFromDb("women"));
        //     dispatch(loadServicesDataFromDb("men"));
        //     dispatch(loadServicesDataFromDb("kids"));
        //     dispatch(loadServicesDataFromDb("general"));
        //     dispatch(loadProductsDataFromDb());
        //     dispatch(loadPackagesDataFromDb());
        //     dispatch(loadMembershipsDataFromDb());
        //     dispatch(loadClientsFromDb());
        //     dispatch(loadClientCountFromDb());
        //     dispatch(loadClientFiltersFromDb(10, "All"));
        //     dispatch(loadBusinessesListFromDb());
        //     dispatch(loadLoginUserDetailsFromDb());
        //     dispatch(loadStaffsFromDB());
        //     dispatch(loadCartFromDB());
        //     dispatch(loadBookingDetailsFromDb());
        // }, []);


    return (
        <View style={styles.checkoutScreen}>
            <AddClientModal closeModal={() => {
                setIsAddClientModalVisible(false)
            }} isVisible={isAddClientModalVisible}/>
            <AddClientButton onPress={() => {
                setIsAddClientModalVisible(true)
            }}/>
            <Cart/>
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