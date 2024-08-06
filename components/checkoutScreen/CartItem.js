import {View, StyleSheet, Text, TextInput, ScrollView} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import Divider from "../../ui/Divider";
import TextTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import {Feather} from '@expo/vector-icons';
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {MaterialIcons} from '@expo/vector-icons';
import {useDispatch} from "react-redux";
import {deleteItemFromCart} from "../../store/cartSlice";

const CartItem = (props) => {
    const dispatch = useDispatch();
    const removeItemHandler = () => {
        dispatch(deleteItemFromCart(props.data.key));
    }

    return <>
        <View style={styles.cartItem}>
            <View style={styles.itemNameAndDetailsContainer}>
                <Text style={[TextTheme.bodyLarge, styles.itemNameText]}>{props.data.name}</Text>
                <View style={styles.itemDetailsContainer}>
                    <Text style={[TextTheme.labelLarge, styles.itemQuantityText]}>1x</Text>
                    <View style={styles.amountContainer}>
                        <Text style={[TextTheme.bodyLarge, styles.currencySymbol]}>₹</Text>
                        <Text style={[TextTheme.bodyLarge, styles.amountText]}>{props.data.discounted_price == null ? props.data.price : props.data.discounted_price}</Text>
                        <PrimaryButton buttonStyle={styles.editAmountButton}
                                       pressableStyle={styles.editAmountPressable}>
                            <Feather style={styles.editAmountIcon} name="edit-2" size={15} color="black"/>
                            {/*<Feather  name="edit" size={22} color="black"/>*/}
                        </PrimaryButton>
                    </View>
                    <PrimaryButton buttonStyle={styles.closeIconButton} pressableStyle={styles.closeIconPressable}
                                   onPress={removeItemHandler}>
                        <Ionicons name="close" size={24} color="black"/>
                    </PrimaryButton>
                </View>
            </View>
            <View style={styles.staffAndDiscountContainer}>
                <PrimaryButton buttonStyle={styles.staffButton} pressableStyle={styles.staffPressable}>
                    <View style={styles.staffContainer}>
                        <Text style={[textTheme.bodyMedium, styles.staffText]}>Select Staff</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={24} color="black"/>
                    </View>
                </PrimaryButton>

                {/*{props.data.discount_percent === 0 && props.data.discount_amount === 0 ? null :*/}
                {/*    <Text*/}
                {/*        style={[textTheme.labelLarge, styles.discountText]}>{props.data.discount_amount !== 0 ? `Discount ${props.data.discount_amount}₹` : `Discount ${props.data.discount_percent}%`}</Text>*/}
                {/*}*/}
            </View>
        </View>
        <Divider/>

    </>
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    cartItem: {
        // flex: 1,
        marginVertical: 10,
        marginHorizontal: 20,
    },
    itemNameAndDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemNameText: {
        maxWidth: "50%",
    },
    itemDetailsContainer: {
        alignItems: "center",
        flexDirection: "row",
    },
    itemQuantityText: {
        fontWeight: "900",
        marginRight: 10,
    },
    amountContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.grey400,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    currencySymbol: {
        paddingRight: 5,
        paddingLeft: 10,
        paddingVertical: 5,
        borderLeftColor: Colors.transparent,
        borderTopColor: Colors.transparent,
        borderBottomColor: Colors.transparent,
        borderRightColor: Colors.grey400,
        borderWidth: 1,
        fontWeight: "500",
    },
    amountText: {
        maxWidth: 80,
        fontWeight: "500",
        color: Colors.black,
        marginRight: 6,
        marginLeft: 10,
        marginVertical: 0,
    },
    editAmountButton: {
        backgroundColor: Colors.transparent,
    },
    editAmountPressable: {
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    editAmountIcon: {
        paddingHorizontal: 5,
        color: Colors.grey600
    },
    closeIconButton: {
        backgroundColor: Colors.transparent,
        marginRight: -15,
        marginLeft: 5,
    },
    closeIconPressable: {
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    staffAndDiscountContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    discountText: {
        color: Colors.button,
        fontWeight: "bold",
        // alignSelf: "flex-end",
        // marginHorizontal: 55,
        // marginTop: 3,
    },
    staffButton: {
        // alignSelf: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey600,
        backgroundColor: Colors.transparent,
        padding: 0,
    },
    staffPressable: {
        padding: 0,
        margin: 0,
    },
    staffText: {
        color: Colors.error
    },
    staffContainer: {
        flexDirection: "row",
        alignItems: "center",
    }


});

export default CartItem;