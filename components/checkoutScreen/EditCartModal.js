import {Modal, Platform, StyleSheet, Text, ToastAndroid, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, Feather} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import MembershipItem from "./MembershipItem";
import CustomTextInput from "../../ui/CustomTextInput";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import getDiscountAPI from "../../util/apis/getDiscountAPI";
import Divider from "../../ui/Divider";
import {useDispatch, useSelector} from "react-redux";
import {
    addItemToEditedCart, editMembership,
    loadCartFromDB,
    updateCalculatedPrice,
    updateCustomItem,
} from "../../store/cartSlice";
import calculateCartPriceAPI from "../../util/apis/calculateCartPriceAPI";
import {formatDate} from "../../util/Helpers";
import * as Haptics from "expo-haptics";

const EditCartModal = (props) => {
    console.log(props.data)
    const [selectedDiscountMode, setSelectedDiscountMode] = useState("cash");
    const [discountValue, setDiscountValue] = useState(props.data.edited ? props.data.disc_value : props.data.discounted_price === 0 ? 0 : props.data.price - props.data.discounted_price);
    const [discountAmount, setDiscountAmount] = useState(props.data.edited ? props.data.disc_value : props.data.discounted_price === 0 ? 0 : props.data.price - props.data.discounted_price);
    const [price, setPrice] = useState(props.data.price);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const editedCart = useSelector((state) => state.cart.editedCart);

    useEffect(() => {
        setPrice(props.data.price)
        setDiscountValue(props.data.edited ? props.data.disc_value : props.data.discounted_price === 0 ? 0 : props.data.price - props.data.discounted_price)
        setDiscountAmount(props.data.edited ? props.data.disc_value : props.data.discounted_price === 0 ? 0 : props.data.price - props.data.discounted_price)
    }, [props]);


    useEffect(() => {
        const api = async () => {
            if (selectedDiscountMode === "percentage") {
                setDiscountAmount(await getDiscountAPI({
                    price: price,
                    disc_percent: discountValue
                }))
            } else {
                setDiscountAmount(parseFloat(discountValue));
            }
        }

        api();
    }, [selectedDiscountMode]);

    return <Modal visible={props.isVisible} animationType={"slide"} style={styles.editCartModal}
                  presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
        <View style={styles.headingAndCloseContainer}>
            <Text style={[textTheme.titleLarge, styles.heading]}>Edit {props.data.resource_category_name}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={styles.modalContent}>
            <CustomTextInput labelTextStyle={textTheme.titleMedium} type={"number"} label={"Quantity"} value={"1"}
                             readOnly={true}/>
            <CustomTextInput labelTextStyle={textTheme.titleMedium} type={"price"} label={"Price"}
                             value={price.toString()}
                             onChangeText={
                                 (value) => {
                                     if (value === "") setPrice(0)
                                     else setPrice(parseFloat(value));
                                 }
                             }

            />
            {props.data.gender === "membership" ? null :
                <>
                    <View style={styles.editDiscountContainer}>
                        <CustomTextInput labelTextStyle={textTheme.titleMedium} flex={1} type={"number"}
                                         label={"Enter discount"}
                                         value={discountValue.toString()}
                                         onChangeText={(value) => {
                                             if (value === "") {
                                                 setDiscountValue(0)
                                                 setDiscountAmount(0);
                                                 return;
                                             } else if (selectedDiscountMode === "percentage" && parseFloat(value) > 100) setDiscountValue(prev => prev);
                                             else if (selectedDiscountMode === "cash" && parseFloat(value) > parseFloat(price)) {
                                                 setDiscountValue(prev => prev);
                                                 return;
                                             } else setDiscountValue(parseFloat(value));
                                             if (selectedDiscountMode === "cash") {
                                                 setDiscountAmount(parseFloat(value));
                                             }
                                         }}
                                         onEndEditing={async (value) => {
                                             if (selectedDiscountMode === "percentage") {
                                                 setDiscountAmount(await getDiscountAPI({
                                                     price: price,
                                                     disc_percent: discountValue
                                                 }))
                                             }
                                         }}
                        />
                        <PrimaryButton
                            onPress={() => {
                                setSelectedDiscountMode("percentage")
                            }}
                            buttonStyle={[styles.percentAndAmountButton, selectedDiscountMode === "percentage" ? {backgroundColor: Colors.highlight} : {}, {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                marginLeft: 10
                            }]} pressableStyle={styles.percentAndAmountPressable}>
                            <Feather name="percent" size={20}
                                     color={selectedDiscountMode === "percentage" ? Colors.white : Colors.black}/>
                        </PrimaryButton>
                        <PrimaryButton
                            onPress={() => {
                                setSelectedDiscountMode("cash")
                            }}
                            buttonStyle={[styles.percentAndAmountButton, selectedDiscountMode === "cash" ? {backgroundColor: Colors.highlight} : {}, {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                            }]} pressableStyle={styles.percentAndAmountPressable}>
                            <MaterialIcons name="currency-rupee" size={20}
                                           color={selectedDiscountMode === "cash" ? Colors.white : Colors.black}/>
                        </PrimaryButton>
                    </View>
                    <CustomTextInput labelTextStyle={textTheme.titleMedium} type={"price"} label={"Discount amount"}
                                     value={discountAmount.toString()}
                                     readOnly={true}/>
                </>}
        </View>
        <Divider/>
        <View style={styles.addToCartButtonContainer}>
            <PrimaryButton onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                if (discountAmount > price) {
                    ToastAndroid.show("Discount should not be greater than price", ToastAndroid.SHORT);
                    return;
                }
                if (price !== parseFloat(props.data.price) || discountAmount !== 0 || discountValue !== 0) {
                    if (props.data.gender === "Women" || props.data.gender === "Men" || props.data.gender === "Kids" || props.data.gender === "General") {
                        dispatch(await addItemToEditedCart({
                            ...props.data,
                            amount: price,
                            total_price: price,
                            price: price,
                            bonus_value: 0,
                            disc_value: discountAmount,
                            itemId: props.data.item_id,
                            item_id: props.data.item_id,
                            membership_id: props.data.membership_id,
                            res_cat_id: props.data.resource_category_id,
                            resource_id: props.data.resource_id,
                            type: selectedDiscountMode === "cash" ? "AMOUNT" : "PERCENT",
                            valid_from: "",
                            valid_till: "",
                            wallet_amount: props.data.wallet_amount,
                            edited: true
                        }))
                    } else if (props.data.gender === "Products") {
                        dispatch(await addItemToEditedCart({
                            ...props.data,
                            amount: price,
                            bonus_value: 0,
                            disc_value: discountAmount,
                            itemId: props.data.item_id,
                            item_id: props.data.item_id,
                            membership_id: 0,
                            product_id: props.data.product_id,
                            resource_id: props.data.resource_id,
                            type: selectedDiscountMode === "cash" ? "AMOUNT" : "PERCENT",
                            total_price: price,
                            price: price,
                            res_cat_id: props.data.resource_category_id,
                            valid_from: "",
                            valid_till: "",
                            wallet_amount: props.data.wallet_amount,
                            edited: true
                        }))
                    } else if (props.data.gender === "membership") {
                        const date = new Date(Date.now()).setHours(0, 0, 0, 0)
                        const validFromDate = date;
                        const validUntilDate = date + (props.data.duration * 24 * 60 * 60 * 1000)
                        await dispatch(editMembership({
                            id: props.data.id === undefined ? props.data.membership_id : props.data.id,
                            data: {
                                amount: price,
                                price: price,
                                total_price: price,
                                bonus_value: 0,
                                disc_value: discountAmount,
                                type: "AMOUNT",
                                id: props.data.membership_id,
                                res_cat_id: props.data.resource_category_id,
                                valid_from: props.data.valid_from === undefined ? formatDate(validFromDate, "yyyy-mm-dd") : props.data.valid_from,
                                valid_until: props.data.valid_until === undefined ? formatDate(validUntilDate, "yyyy-mm-dd") : props.data.valid_until,
                            }
                        }))
                        // await dispatch(loadCartFromDB());
                    }
                    dispatch(updateCalculatedPrice());
                    props.onCloseModal()
                } else {
                    props.onCloseModal()
                }
            }} label={"Save"}/>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    editCartModal: {
        flex: 1,
    }
    ,
    headingAndCloseContainer: {
        paddingHorizontal:
            20,
        paddingVertical:
            15,
    }
    ,
    heading: {
        textAlign: "center",
        fontWeight:
            500
    }
    ,
    closeButton: {
        position: "absolute",
        right:
            0,
        top:
            5,
        backgroundColor:
        Colors.background,
    }
    ,
    modalContent: {
        flex: 1,
        padding:
            30,
    }
    ,
    editDiscountContainer: {
        flexDirection: "row",
        alignItems:
            "center",
        alignContent:
            "center",
        // alignSelf:"center",
    }
    ,
    percentAndAmountButton: {
        marginTop: 10,
        borderColor:
        Colors.grey400,
        borderWidth:
            1,
        backgroundColor:
        Colors.background,
        alignSelf:
            "center",
    }
    ,
    percentAndAmountPressable: {}
    ,
    addToCartButtonContainer: {
        marginHorizontal: 30,
        marginTop:
            20,
        marginBottom:
            20,
    }
});

export default EditCartModal;