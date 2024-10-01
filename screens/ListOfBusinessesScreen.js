import {View, Text, StyleSheet, Platform, ScrollView, FlatList} from 'react-native';
import textTheme from "../constants/TextTheme";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import BusinessCard from "../components/listOfBusinessesScreen/BusinessCard";
import {useDispatch, useSelector} from "react-redux";
import {updateAuthStatus, updateBusinessId, updateBusinessName, updateInBusiness} from "../store/authSlice";
import {
    loadBusinessesListFromDb,
    loadBusinessNotificationDetails,
    updateIsBusinessSelected,
    updateSelectedBusinessDetails
} from "../store/listOfBusinessSlice";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";

import {
    loadMembershipsDataFromDb,
    loadPackagesDataFromDb,
    loadProductsDataFromDb,
    loadServicesDataFromDb
} from "../store/catalogueSlice";
import {clearClientsList, loadClientCountFromDb, loadClientsFromDb} from "../store/clientSlice";
import {loadClientFiltersFromDb, resetClientFilter, resetMaxEntry} from "../store/clientFilterSlice";
import {loadLoginUserDetailsFromDb} from "../store/loginUserSlice";
import * as SecureStore from 'expo-secure-store';
import {useFocusEffect} from "@react-navigation/native";
import {clearClientInfo} from "../store/clientInfoSlice";
import clearCartAPI from "../util/apis/clearCartAPI";
import {clearCalculatedPrice, clearCustomItems, clearLocalCart, clearSalesNotes, modifyClientMembershipId} from "../store/cartSlice";
import * as Haptics from "expo-haptics";
import { useLocationContext } from '../context/LocationContext';
import DeleteClient from '../components/clientSegmentScreen/DeleteClientModal';
import Toast from "../ui/Toast";


export default function ListOfBusinessesScreen({navigation}) {
    const listOfBusinesses = useSelector(state => state.businesses.listOfBusinesses);
    const name = useSelector(state => state.loginUser.details).name;
    const dispatch = useDispatch();
    const { getLocation, currentLocation,reload,setReload } = useLocationContext();
    const toastRef = useRef();
    
    useFocusEffect(useCallback(() => {
        getLocation("List of Business");
    }, []))
    
    // useLayoutEffect(() => {
        // dispatch(loadServicesDataFromDb("women"));
        // dispatch(loadServicesDataFromDb("men"));
        // dispatch(loadServicesDataFromDb("kids"));
        // dispatch(loadServicesDataFromDb("general"));
        // dispatch(loadProductsDataFromDb());
        // dispatch(loadPackagesDataFromDb());
        // dispatch(loadMembershipsDataFromDb());
        // dispatch(loadClientsFromDb());
        // dispatch(loadClientCountFromDb());
        // dispatch(loadClientFiltersFromDb(10, "All"));
        // dispatch(clearClientInfo());
        // dispatch(clearCustomItems());
        // console.log("List Of Business");
        // dispatch(clearLocalCart());
        // clearCartAPI();
        // dispatch(loadBusinessesListFromDb());
        // dispatch(loadLoginUserDetailsFromDb());
    // }, []);


    // useFocusEffect(
    //     useCallback(() => {
    //         // Function to execute whenever the drawer screen is opened
    //         dispatch(clearClientsList());
    //
    //         // Optional cleanup function when screen is unfocused
    //         return () => {
    //             dispatch(loadClientsFromDb());
    //         };
    //     }, [])
    // );

    async function authToken() {

        let businessId = ""
        try {
            // const value = await AsyncStorage.getItem('businessId');
            const value = await SecureStore.getItemAsync('businessId');
            if (value !== null) {
                businessId = value;
            }
        } catch (e) {
        }

    }

    const storeData = async (value) => {
        try {
            // await AsyncStorage.setItem('businessId', value);
            await SecureStore.setItemAsync('businessId', value);
        } catch (e) {
        }
    };

    function renderItem(itemData) {
        return (
            <BusinessCard
                name={itemData.item.name}
                area={itemData.item.area}
                address={itemData.item.address}
                imageURL={itemData.item.photo}
                status={itemData.item.verificationStatus}
                onPress={async () => {
                    Haptics.selectionAsync()
                    dispatch(updateInBusiness(true));
                    await storeData(itemData.item.id);
                    dispatch(updateBusinessId(itemData.item.id));
                    dispatch(updateIsBusinessSelected(true));
                    dispatch(updateSelectedBusinessDetails(itemData.item));
                    await dispatch(resetClientFilter());
                    dispatch(resetMaxEntry());
                    navigation.navigate("Checkout");
                }}
                listOfBusinessToast={listOfBusinessToast}
            />
        );
    }

    function listOfBusinessToast(message, duration) {
        toastRef.current.show(message, duration);
    }
    const token = useSelector(state => state.authDetails.authToken);
    const id = useSelector(state => state.authDetails.businessId);
    const cartItems = useSelector(state => state.cart.items);
    const [isDelete, setIsDelete] = useState(false);
    return (
        cartItems.length === 0 ?
            <ScrollView style={styles.listOfBusinesses} contentContainerStyle={{alignItems: "center"}}>
                <Toast ref={toastRef}/>
    
                <Divider/>
                <View style={styles.body}>
                    <Text style={[textTheme.titleMedium]}>
                        Hi, {name}!
                    </Text>
                    <Text style={[textTheme.bodyMedium, styles.descriptionText]}>
                        You are a part of the following business. Go to the business which you wish to access now
                    </Text>
    
                    <FlatList
                        data={listOfBusinesses}
                        renderItem={renderItem}
                        style={styles.listStyle}
                        scrollEnabled={false}
                        contentContainerStyle={{gap: 16, borderRadius: 8, overflow: 'hidden'}}
                    />
                </View>
    
            </ScrollView>
            :<DeleteClient
            isVisible={isDelete}
            setVisible={setIsDelete}
            onCloseModal={async () => {
                // Navigate directly to CheckoutScreen
                setTimeout(() => {
                    setIsDelete(false);
                    navigation.navigate("Checkout", { screen: "CheckoutScreen" });
                }, 10);
                setReload(true)
                // console.log(navigationRef.current.getRootState());
                // navigate("Checkout")
            }}
            header={"Cancel Sale"}
            content={"If you cancel this sale transaction will not be processed. Do you wish to exit?"}
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
    );
}


const styles = StyleSheet.create({
    listOfBusinesses: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        marginVertical: 16,

    },
    body: {
        width: "90%",
        marginTop: 16,
        marginBottom: 32
    },
    descriptionText: {
        marginTop: 16,
        color: Colors.grey650,
    },
    listStyle: {
        marginTop: 32,
    }

})