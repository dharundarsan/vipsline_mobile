import {Pressable, StyleSheet, Text, View} from "react-native";
import PrimaryButton from "../ui/PrimaryButton";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import Cart from "../components/checkoutScreen/Cart";
import AddClientButton from "../components/checkoutScreen/AddClientButton";
import {useNavigation} from "@react-navigation/native";
import title from "react-native-paper/src/components/Typography/v2/Title";
import {useEffect, useLayoutEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    loadMembershipsDataFromDb,
    loadPackagesDataFromDb,
    loadProductsDataFromDb,
    loadServicesDataFromDb
} from '../store/catalogueSlice';


const CheckoutScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(loadServicesDataFromDb("women"));
        dispatch(loadServicesDataFromDb("men"));
        dispatch(loadServicesDataFromDb("kids"));
        dispatch(loadServicesDataFromDb("general"));
        dispatch(loadProductsDataFromDb());
        dispatch(loadPackagesDataFromDb());
        dispatch(loadMembershipsDataFromDb());
    }, [])
    useLayoutEffect(() => {
        navigation.setOptions({headerTitle: "Add to cart", headerTitleStyle: {color: Colors.darkBlue}});
    }, [navigation]);


    return (
        <View style={styles.checkoutScreen}>
            <AddClientButton/>
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
