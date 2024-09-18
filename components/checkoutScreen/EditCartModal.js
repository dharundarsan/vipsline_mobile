import {Modal, Platform, StyleSheet, Text, View} from "react-native";
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

const EditCartModal = (props) => {
    const [selectedDiscountMode, setSelectedDiscountMode] = useState("percentage");
    const [discountValue, setDiscountValue] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [price, setPrice] = useState(props.data.price);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const editedCart = useSelector((state) => state.cart.editedCart);

    useEffect(() => {
        // setPrice(props.data.total_price === undefined ? props.data.price : props.data.total_price)
        setPrice(props.data.price)
        setDiscountValue(0)
        setDiscountAmount(0)
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

    return <Modal visible={props.isVisible} animationType={"slide"} style={styles.editCartModal}>
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
                            type: "AMOUNT",
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
                            type: "AMOUNT",
                            total_price: price,
                            price: price,
                            res_cat_id: props.data.resource_category_id,
                            valid_from: "",
                            valid_till: "",
                            wallet_amount: props.data.wallet_amount,
                            edited: true
                        }))
                    } else if (props.data.gender === "membership") {
                        await dispatch(editMembership({
                            id: props.data.id === undefined ? props.data.membership_id : props.data.id, data: {
                                amount: price,
                                price: price,
                                total_price: price,
                                bonus_value: 0,
                                disc_value: discountAmount,
                                type: "AMOUNT",
                                id: props.data.membership_id,
                                res_cat_id: props.data.resource_category_id
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
        marginTop: Platform.OS === "ios" ? 50 : 0,
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