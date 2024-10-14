import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useRef, useState} from "react";
import Colors from "../../constants/Colors";
import { formatDate, shadowStyling, showToast } from "../../util/Helpers";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { addCustomItems, addItemToCart, updateCalculatedPrice, updateCustomItem } from "../../store/cartSlice";
import { useDispatch } from "react-redux";
import CustomTextInput from "../../ui/CustomTextInput";
import * as Haptics from "expo-haptics";
import Toast from "../../ui/Toast";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddCustomItemModal = (props) => {
    const [itemName, setItemName] = useState(props.edited ? props.data.name : "");
    const [itemPrice, setItemPrice] = useState(props.edited ? props.data.price : 0);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const itemNameRef = useRef();
    const itemPriceRef = useRef();
    const toastRef = useRef(null);
    return <Modal visible={props.isVisible} onCancel={props.onCloseModal} animationType={"slide"}
        presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
        <Toast ref={toastRef}/>
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
                <CustomTextInput label={"Custom Item Name"} type={"text"} onChangeText={setItemName} value={itemName} 
                validator={(text) => {
                    if (text.trim().length === 0) {
                        return "Please enter item name"
                    }
                    else return true;
                }}
                onSave={(callback)=>{
                    itemNameRef.current = callback;
                }}
                />
                <CustomTextInput label={"Price"}
                    type={"price"}
                    placeholder={"0.00"}
                    value={itemPrice.toString()}
                    onChangeText={setItemPrice}
                    onEndEditing={price => {
                        if (price === "") setItemPrice(0)
                        else setItemPrice(parseFloat(price))
                    }}
                    validator={(text) => {
                        if (text == 0) {
                            return "First name is required"
                        }
                        else return true;
                    }}
                    onSave={(callback)=>{
                        itemPriceRef.current = callback
                    }}
                    />
            </View>
            <View style={styles.addToCartButtonContainer}>
                <PrimaryButton onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                    const itemNameValid = itemNameRef.current();
                    const itemPriceValid = itemPriceRef.current();
                    if(!itemNameValid || !itemPriceValid) return;
                    if (itemName.trim() === "") {
                        toastRef.current.show("Please enter item name", 2000);
                        return;
                    }
                    if (itemPrice === 0 || !parseFloat(itemPrice)) {
                        toastRef.current.show("Invalid amount", 2000);
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