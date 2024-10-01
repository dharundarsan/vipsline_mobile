import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import { formatDate, shadowStyling, showToast } from "../../util/Helpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { addCustomItems, addItemToCart, updateCalculatedPrice, updateCustomItem } from "../../store/cartSlice";
import { useDispatch } from "react-redux";
import CustomTextInput from "../../ui/CustomTextInput";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddCustomItemModal = (props) => {
    const [itemName, setItemName] = useState(props.edited ? props.data.name : "");
    const [itemPrice, setItemPrice] = useState(props.edited ? props.data.price : 0);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    return <Modal visible={props.isVisible} onCancel={props.onCloseModal} animationType={"slide"}
        presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
        <KeyboardAvoidingView style={{ flex: 1,paddingBottom:insets.bottom }} keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}
        behavior="height">
            <View style={[styles.headingAndCloseContainer, shadowStyling]}>
                <Text style={[textTheme.titleLarge, styles.heading]}>Edit Custom Item</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    onPress={props.onCloseModal}
                >
                    <Ionicons name="close" size={25} color="black" />
                </PrimaryButton>
            </View>
            <View style={styles.modalContent}>
                <CustomTextInput label={"Custom Item Name"} type={"text"} onChangeText={setItemName} value={itemName} />
                <CustomTextInput label={"Price"}
                    type={"price"}
                    placeholder={"0.00"}
                    value={itemPrice.toString()}
                    onChangeText={setItemPrice}
                    onEndEditing={price => {
                        if (price === "") setItemPrice(0)
                        else setItemPrice(parseFloat(price))
                    }} />
            </View>
            <View style={styles.addToCartButtonContainer}>
                <PrimaryButton onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                    if (itemName.trim() === "") {
                        showToast({
                            type: "error",
                            text1: "Please enter item name",
                        });
                        return;
                    }
                    if (itemPrice === 0 || !parseFloat(itemPrice)) {
                        showToast({
                            type: "error",
                            text1: "Invalid Amount",
                        });
                        return;
                    }
                    let price;

                    if (itemName === "") price = 0
                    else price = parseFloat(itemPrice)

                    if (props.edited) {
                        dispatch(updateCustomItem({
                            amount: price,
                            price: price,
                            total_price: price,
                            item_id: props.data.item_id,
                        }))
                        props.onCloseModal();
                    } else {
                        dispatch(addCustomItems({
                            name: itemName,
                            price: price.toString(),
                            resource_category_name: null,
                            total_price: price.toString(),
                            category: "custom_item",
                            gender: "custom_item",
                            amount: price.toString(),
                            resource_id: null,
                        }))
                        props.onCloseModal();
                        props.closeOverallModal()
                    }
                    dispatch(updateCalculatedPrice());
                }} label={props.edited ? "Save" : "Add to cart"} />
            </View>
        </KeyboardAvoidingView>
        <Toast />
    </Modal>
}

const styles = StyleSheet.create({
    addCustomItemModal: {
        flex: 1,
    },
    headingAndCloseContainer: {
        // marginTop: Platform.OS === "ios" ? 50 : 0,
        paddingHorizontal: 20,
        paddingVertical: 15,
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
        padding: 30,
    },
    nameInputContainer: {
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    addToCartButtonContainer: {
        marginHorizontal: 30,
        marginTop: 20,
        marginBottom: 30,
    }
})

export default AddCustomItemModal;