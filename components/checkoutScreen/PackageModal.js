import {ActivityIndicator, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import axios from "axios";
import {formatDate, formatDateWithAddedMonths, shadowStyling} from "../../util/Helpers";
import Entypo from '@expo/vector-icons/Entypo';
import {addItemToCart, loadCartFromDB, removeItemFromCart} from "../../store/cartSlice";
import packageSittingItem from "./PackageSittingItem";
import PackageSittingItem from "./PackageSittingItem";
import {useDispatch, useSelector} from "react-redux";
import * as Haptics from "expo-haptics";
import * as SecureStore from 'expo-secure-store';

const PackageModal = (props) => {
    const [packageDetails, setPackageDetails] = useState([
        {
            "expiry_date": "",
            "package_name": "",
            "service_list": [{}],
            "package_price": 0,
            "total_sessions": 0,
        }
    ]);
    const [editedPackageDetails, setEditedPackageDetails] = useState([]);
    const [modifiedEditedPackageDetails, setModifiedEditedPackageDetails] = useState([]);
    const [selectedSittingItems, setSelectedSittingItems] = useState([]);
    const dispatch = useDispatch();
    const addSittingItems = (item) => {
        setSelectedSittingItems(prev => [...prev, item]);
    }
    const cartItems = useSelector(state => state.cart.items);

    const deleteSittingItems = (item) => {
        setSelectedSittingItems(prev => prev.filter(sittingItem => sittingItem !== item));
    }

    const editSittingCountInEditedPackageDetails = (data) => {
        setModifiedEditedPackageDetails(prev => prev.map(item => {
                if (item.name === data.name && item.parent_resource_category_id === data.parent_resource_category_id && item.resource_category_id === data.resource_category_id) {
                    return data;
                }
                return item;
            }
        ))
    }


    useEffect(() => {
        const getPackageDetailsFromDB = async () => {
            let businessId = ""
            try {
                // const value = await AsyncStorage.getItem('businessId');
                const value = await SecureStore.getItemAsync('businessId');
                if (value !== null) {
                    businessId = value;
                }
            } catch (e) {
                console.log("auth token fetching error. (inside catalogueSlice loadServiceDataFromDb)" + e);
            }

            let authToken = ""
            try {
                // const value = await AsyncStorage.getItem('authKey');
                const value = await SecureStore.getItemAsync('authKey');
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
                        package_id: props.edited ? props.data.package_id : props.data.id,
                        date: formatDate(Date.now(), "yyyy-mm-dd"),
                        business_id: businessId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                );
                setPackageDetails([{
                    ...response.data.data[0],
                    service_list: response.data.data[0].service_list === undefined ? response.data.data[0].Services_List : response.data.data[0].service_list
                }]);
                let packageSittingItemsInCart = cartItems.filter(item => item.gender === "packages" && item.package_name !== "");

                let counter = 0;

                const serviceList = response.data.data[0].service_list === undefined ? response.data.data[0].Services_List : response.data.data[0].service_list;

                const data = serviceList.map(item => {
                    counter = 0
                    let index;
                    // const item_id = packageSittingItemsInCart.filter(ele => ele.resource_category_name === item.name &&
                    //     ele.resource_category_id === item.res_cat_id &&
                    //     ele.parent_resource_category_id === item.par_res_cat_id)[0].item_id;

                    // Use a loop to find and remove all matching items
                    while ((index = packageSittingItemsInCart.findIndex(ele =>
                        ele.resource_category_name === item.name &&
                        ele.resource_category_id === item.res_cat_id &&
                        ele.parent_resource_category_id === item.par_res_cat_id
                    )) !== -1) {
                        packageSittingItemsInCart.splice(index, 1);  // Remove the element at found index
                        counter++;  // Increment counter since one element was removed
                    }

                    return {
                        name: item.name,
                        resource_category_id: item.res_cat_id,
                        parent_resource_category_id: item.par_res_cat_id,
                        // item_id: item.item_id,
                        counter: counter,
                    };
                });
                setEditedPackageDetails(data);

                setModifiedEditedPackageDetails(data);
            } catch (e) {
                console.error(e)
            }
        }
        getPackageDetailsFromDB();
    }, []);


    return <Modal visible={props.isVisible} style={styles.packageModal} animationType={props.singlePackage ? "none" : "slide"}
                  presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
        <View style={[styles.headingAndCloseContainer, shadowStyling]}>
            <Text
                style={[textTheme.titleLarge, styles.heading]}>{props.edited ? props.data.resource_category_name : props.data.name === undefined ? props.data.package_name : props.data.name}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={() => {
                    if(props.singlePackage) props.closeOverallModal();
                    else props.onCloseModal();
                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={styles.modalContent}>
            <ScrollView>
                <View style={styles.details}>
                    <Text
                        style={[textTheme.titleSmall, styles.packageName]}>{props.edited ? props.data.resource_category_name : props.data.name === undefined ? props.data.package_name : props.data.name}</Text>
                    <Text
                        style={[textTheme.bodySmall, styles.serviceCount]}>{packageDetails.service_list === undefined ? packageDetails[0].service_list.length : packageDetails.service_list.length} Services</Text>
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
                              data={props.redeem ? packageDetails[0].service_list : packageDetails[0].service_list}
                              renderItem={({item}) =>
                                  <PackageSittingItem data={item}
                                                      redeem={props.redeem}
                                                      addSittingItems={addSittingItems}
                                                      deleteSittingItems={deleteSittingItems}
                                                      edited={props.edited}
                                                      editedData={editedPackageDetails}
                                                      editSittingCountInEditedPackageDetails={editSittingCountInEditedPackageDetails}
                                  />
                              }
                    />
                }
            </ScrollView>
        </View>
        <Divider/>
        <View style={styles.saveButtonContainer}>
            <PrimaryButton onPress={props.edited ? () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                // console.log(editedPackageDetails.every(edited => {
                //     const data = modifiedEditedPackageDetails.filter(modified => edited.name === modified.name && edited.parent_resource_category_id === modified.parent_resource_category_id && edited.resource_category_id === modified.resource_category_id)
                //     return data[0].counter === edited.counter;
                // }))
                editedPackageDetails.forEach(async edited => {
                    const data = modifiedEditedPackageDetails.filter(modified => edited.name === modified.name && edited.parent_resource_category_id === modified.parent_resource_category_id && edited.resource_category_id === modified.resource_category_id)
                    if (data[0].counter === edited.counter) {

                    } else if (data[0].counter > edited.counter) {
                        const iter = data[0].counter - edited.counter;
                        for (let i = 0; i < iter; i++) {
                            // packageDetails.filter(det => );
                            await dispatch(addItemToCart({
                                package_id: props.data.package_id,
                                resource_category: edited.resource_category_id,
                                resource_id: null
                            }))
                        }
                    } else if (data[0].counter < edited.counter) {
                        const iter = edited.counter - data[0].counter;
                        let tempCartItems = cartItems;
                        for (let i = 0; i < iter; i++) {
                            const item_id = tempCartItems.filter(item => item.parent_resource_category_id === edited.parent_resource_category_id && item.resource_category_name === edited.name && edited.resource_category_id === item.resource_category_id)[0].item_id;
                            tempCartItems = tempCartItems.filter(item => item.item_id !== item_id);
                            await dispatch(removeItemFromCart(item_id));
                        }
                    }
                })

                props.onCloseModal();
            } : async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                if (!props.redeem) {
                    await dispatch(addItemToCart({package_id: props.data.id}));
                }
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
            // marginTop: Platform.OS === "ios" ? 50 : 0,
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