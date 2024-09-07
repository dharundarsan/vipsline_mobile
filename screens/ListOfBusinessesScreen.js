import {View, Text, StyleSheet, Platform, ScrollView, FlatList} from 'react-native';
import textTheme from "../constants/TextTheme";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import BusinessCard from "../components/listOfBusinessesScreen/BusinessCard";
import {useDispatch, useSelector} from "react-redux";
import {updateAuthStatus, updateBusinessId, updateBusinessName} from "../store/authSlice";
import {
    loadBusinessesListFromDb,
    updateIsBusinessSelected,
    updateSelectedBusinessDetails
} from "../store/listOfBusinessSlice";
import {useEffect, useLayoutEffect} from "react";
import {
    loadMembershipsDataFromDb,
    loadPackagesDataFromDb,
    loadProductsDataFromDb,
    loadServicesDataFromDb
} from "../store/catalogueSlice";
import {loadClientCountFromDb, loadClientsFromDb} from "../store/clientSlice";
import {loadClientFiltersFromDb} from "../store/clientFilterSlice";
import {loadLoginUserDetailsFromDb} from "../store/loginUserSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ListOfBusinessesScreen({navigation}) {
    const listOfBusinesses = useSelector(state => state.businesses.listOfBusinesses);
    const name = useSelector(state => state.loginUser.details).name;
    const dispatch = useDispatch();

    useLayoutEffect(() => {
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
        dispatch(loadBusinessesListFromDb());
        dispatch(loadLoginUserDetailsFromDb());
    }, []);


    async function authToken() {

        let businessId = ""
        try {
            const value = await AsyncStorage.getItem('businessId');
            if (value !== null) {
                businessId = value;
            }
        } catch (e) {
            console.log("auth token fetching error." + e);
        }

    }

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('businessId', value);
        } catch (e) {
            console.log("error storing business id save", e);
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
                    await storeData(itemData.item.id);
                    dispatch(updateBusinessId(itemData.item.id));
                    dispatch(updateIsBusinessSelected(true));
                    dispatch(updateSelectedBusinessDetails(itemData.item));
                    navigation.navigate("Checkout");
                }}
            />
        );
    }

    const token = useSelector(state => state.authDetails.authToken);
    const id = useSelector(state => state.authDetails.businessId);

    console.log("token: " + token);
    console.log("business id: " + id);



    return (
        <ScrollView style={styles.listOfBusinesses} contentContainerStyle={{alignItems: "center"}}>
            <View style={styles.header}>
                <Text style={[textTheme.titleLarge]}>Locations</Text>
            </View>
            <Divider />
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
    );
}


const styles = StyleSheet.create({
    listOfBusinesses :{
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