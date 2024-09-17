import {ActivityIndicator, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import axios from "axios";
import {formatDate, formatDateWithAddedMonths} from "../../util/Helpers";
import Entypo from '@expo/vector-icons/Entypo';
import {addItemToCart, loadCartFromDB} from "../../store/cartSlice";
import packageSittingItem from "./PackageSittingItem";
import PackageSittingItem from "./PackageSittingItem";
import {useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PackageModal = (props) => {
    const [packageDetails, setPackageDetails] = useState([
        {
            "expiry_date": "",
            "package_name":"",
            "service_list":[{}],
            "package_price":0,
            "total_sessions":0,
        }
    ]);
    const [selectedSittingItems, setSelectedSittingItems] = useState([]);
    const dispatch = useDispatch();
    const addSittingItems = (item) => {
        setSelectedSittingItems(prev => [...prev, item]);
    }

    const deleteSittingItems = (item) => {
        setSelectedSittingItems(prev => prev.filter(sittingItem => sittingItem !== item));
    }

    useEffect(() => {
        const getPackageDetailsFromDB = async () => {
            let businessId = ""
            try {
                const value = await AsyncStorage.getItem('businessId');
                if (value !== null) {
                    businessId = value;
                }
            } catch (e) {
                console.log("auth token fetching error. (inside catalogueSlice loadServiceDataFromDb)" + e);
            }

            let authToken = ""
            try {
                const value = await AsyncStorage.getItem('authKey');
                if (value !== null) {
                    authToken = value;
                }
            } catch (e) {
                console.log("auth token fetching error. (inside catalogueSlice loadServiceDataFromDb)" + e);
            }


            try {
                const response = await axios.post(
                    props.redeem ? `${process.env.EXPO_PUBLIC_API_URI}/package/getClientPackageDetailById` : `${process.env.EXPO_PUBLIC_API_URI}/package/detail`,
                    props.redeem ? {
                        client_package_id: props.data.client_package_id,
                        business_id: businessId
                    } : {
                        package_id: props.data.id,
                        date: formatDate(Date.now(), "yyyy-mm-dd"),
                        business_id: businessId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                );
                setPackageDetails(response.data.data);
                // console.log(JSON.stringify(response.data.data,null,3));
                
            } catch (e) {
                console.log(e)
            }
        }
        getPackageDetailsFromDB();
    }, []);
    return <Modal visible={props.isVisible} style={styles.packageModal} animationType={"slide"}>
        <View style={styles.headingAndCloseContainer}>
            <Text
                style={[textTheme.titleLarge, styles.heading]}>{props.data.name === undefined ? props.data.package_name : props.data.name}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={styles.modalContent}>
            <ScrollView>
                <View style={styles.details}>
                    <Text
                        style={[textTheme.titleSmall, styles.packageName]}>{props.data.name === undefined ? props.data.package_name : props.data.name}</Text>
                    <Text style={[textTheme.bodySmall, styles.serviceCount]}>{packageDetails.service_list === undefined ? packageDetails[0].service_list.length : packageDetails.service_list.length} Services</Text>
                    <Text style={[textTheme.bodySmall, styles.expireText]}>This package will expire on
                        <Text 
                            // style={styles.expireDate}> {props.redeem ? props.data.valid_till : formatDateWithAddedMonths(props.data.duration_months[0])}
                            style={styles.expireDate}> {props.redeem ? props.data.valid_till : packageDetails[0].expiry_date}
                        </Text>
                    </Text>
                    <Text
                        style={[textTheme.bodyMedium, styles.price]}>₹ {props.data.price}</Text>
                </View>
                {packageDetails[0].expiry_date === "" ? <ActivityIndicator/> :
                    <FlatList scrollEnabled={false}
                        data={props.redeem ? packageDetails[0].Services_List : packageDetails[0].service_list}
                        renderItem={({item}) => 
                        <PackageSittingItem data={item}
                            redeem={props.redeem}
                            addSittingItems={addSittingItems}
                            deleteSittingItems={deleteSittingItems}
                        />
                        }
                    />
                }
            </ScrollView>
        </View>
        <Divider/>
        <View style={styles.saveButtonContainer}>
            <PrimaryButton onPress={async () => {
                if (!props.redeem)
                    dispatch(addItemToCart({package_id: props.data.id}));
                selectedSittingItems.forEach((item) => {
                    if (props.redeem) {
                        dispatch(addItemToCart({
                            client_package_id: props.data.client_package_id,
                            resource_category: item.res_cat_id,
                            resource_id: null
                        }))
                    } else {
                        dispatch(addItemToCart({
                            package_id: props.data.id,
                            resource_category: item.res_cat_id,
                            resource_id: null
                        }));
                    }
                })
                props.closeOverallModal();
                props.onCloseModal();
            }} label={"Save"}/>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
        packageModal: {
            flex: 1,
        },
        headingAndCloseContainer: {
            marginTop: Platform.OS === "ios" ? 50 : 0,
            paddingHorizontal: 20,
            paddingVertical: 15,
            alignItems: "center",
        },
        heading: {
            fontWeight: 500
        },
        closeButton: {
            position: "absolute",
            right: 0,
            top: 5,
            backgroundColor: Colors.background,
        },
        modalContent: {
            flex: 1,
            padding: 15,
        },
        details: {},
        packageName: {
            marginBottom: 12,
        },
        serviceCount: {
            fontWeight: 500,
        },
        expireText: {
            fontWeight: 500,
            marginBottom: 12,
        },
        expireDate: {
            color: Colors.error
        },
        price: {
            fontWeight: "bold",
            marginBottom: 30,
        },
        saveButtonContainer: {
            marginHorizontal: 30,
            marginTop: 20,
            marginBottom: 20,
        }
    })
;

export default PackageModal;