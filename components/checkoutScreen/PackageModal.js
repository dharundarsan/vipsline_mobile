import {ActivityIndicator, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import axios from "axios";
import {formatDate} from "../../util/Helpers";
import Entypo from '@expo/vector-icons/Entypo';
import {addItemsToPackageCart, addItemToCart, loadCartFromDB} from "../../store/cartSlice";
import packageSittingItem from "./PackageSittingItem";
import PackageSittingItem from "./PackageSittingItem";
import {useDispatch} from "react-redux";

const PackageModal = (props) => {
    const [packageDetails, setPackageDetails] = useState([]);
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
            try {
                const response = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URI}/package/detail`,
                    {
                        package_id: props.data.id,
                        date: formatDate(Date.now(), "yyyy-mm-dd"),
                        business_id: process.env.EXPO_PUBLIC_BUSINESS_ID,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.EXPO_PUBLIC_AUTH_KEY}`
                        }
                    }
                );
                setPackageDetails(response.data.data);
            } catch (e) {

            }
        }
        getPackageDetailsFromDB();
    }, []);

    return <Modal visible={props.isVisible} style={styles.packageModal} animationType={"slide"}>
        <View style={styles.headingAndCloseContainer}>
            <Text style={[textTheme.titleLarge, styles.heading]}>{props.data.name}</Text>
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
                    <Text style={[textTheme.titleSmall, styles.packageName]}>Transformation Package</Text>
                    <Text style={[textTheme.bodySmall, styles.serviceCount]}>10 Services</Text>
                    <Text style={[textTheme.bodySmall, styles.expireText]}>This package will expire on <Text
                        style={styles.expireDate}>30 November
                        2023</Text></Text>
                    <Text style={[textTheme.bodyMedium, styles.price]}>₹ 2500</Text>
                </View>
                {packageDetails.length === 0 ? <ActivityIndicator/> :
                    <FlatList scrollEnabled={false} data={packageDetails[0].service_list}
                              renderItem={({item}) => <PackageSittingItem data={item}
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
                dispatch(addItemToCart({package_id: props.data.id}));
                selectedSittingItems.forEach((item) => {
                    dispatch(addItemToCart({
                        package_id: props.data.id,
                        resource_category: item.res_cat_id,
                        resource_id: null
                    }));
                })
                props.closeOverallModal()
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