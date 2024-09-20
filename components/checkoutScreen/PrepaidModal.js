import {Modal, Platform, ScrollView, StyleSheet, Text, ToastAndroid, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React, {useRef, useState} from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import CustomTextInput from "../../ui/CustomTextInput";
import {
    addItemToCart,
    addItemToEditedCart, cartSlice,
    modifyPrepaidDetails,
    updateCalculatedPrice,
    updateEditedCart
} from "../../store/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {shadowStyling} from "../../util/Helpers";

const PrepaidModal = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
    const [prepaidSource, setPrepaidSource] = useState("Add prepaid");
    const [prepaidAmount, setPrepaidAmount] = useState(props.edited ? props.data.wallet_amount : 0)
    const [prepaidBonus, setPrepaidBonus] = useState(props.edited ? props.data.wallet_bonus : 0)
    const [description, setDescription] = useState(props.edited ? props.data.wallet_bonus : "")
    const dispatch = useDispatch();
    const prepaidAmountRef = useRef(null);
    const prepaid_wallet = useSelector(state => state.cart.prepaid_wallet)


    return <Modal style={styles.prepaidModal} visible={props.isVisible} animationType={"slide"}
                  presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
        <View style={[styles.headingAndCloseContainer, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.heading]}>Add Prepaid</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <View style={styles.modalContent}>
            <ScrollView>
                <CustomTextInput label={"Date"} type={"date"} value={selectedDate} onChangeValue={setSelectedDate}/>
                <CustomTextInput label={"Prepaid Source"} type={"dropdown"}
                                 dropdownItems={["Add prepaid", "Balance carry forward"]} value={prepaidSource}
                                 onChangeValue={setPrepaidSource}/>
                <CustomTextInput label={"Prepaid amount"} type={"price"} placeholder={"0.00"}
                                 value={prepaidAmount.toString()}
                                 validator={(text) => {
                                     if (parseFloat(text) === 0 || text === "") return "Price is required";
                                     else return true;
                                 }}
                                 onSave={(callback) => {
                                     prepaidAmountRef.current = callback;
                                 }}
                                 onEndEditing={(price) => {
                                     if (price === "") return 0
                                     setPrepaidAmount(parseFloat(price))
                                 }}
                                 onChangeText={setPrepaidAmount}/>
                <CustomTextInput label={"Prepaid Bonus"} type={"price"} placeholder={"0.00"}
                                 value={prepaidBonus.toString()}
                                 onChangeText={setPrepaidBonus}
                                 onEndEditing={(price) => {
                                     if (price === "") setPrepaidBonus(0)
                                     else setPrepaidBonus(parseFloat(price))
                                 }}/>
                <CustomTextInput label={"Description"} type={"multiLine"} value={description}
                                 onChangeText={setDescription}/>
                <View style={styles.noteContainer}>
                    <View style={styles.noteLeftBar}></View>
                    <Text style={[textTheme.bodyMedium]}>Note: Total Prepaid Credit = (Prepaid amount + Bonus
                        Value)</Text>
                </View>
                <Text style={[textTheme.titleMedium, styles.totalCreditText]}>Total Prepaid Credit
                    ₹{prepaidAmount + prepaidBonus}</Text>
            </ScrollView>
        </View>
        <Divider/>
        <View style={styles.saveButtonContainer}>
            <PrimaryButton onPress={() => {
                if (!prepaidAmountRef.current()) return;
                if (prepaidBonus > prepaidAmount) {
                    ToastAndroid.show("Prepaid bonus should be lesser or equal to actual amount", ToastAndroid.LONG)
                    return;
                }
                if (props.edited) {
                    dispatch(modifyPrepaidDetails({
                        type: "add", payload: [{
                            bonus_value: parseFloat(prepaidBonus).toString(),
                            description: description,
                            source: "add_prepaid",
                            wallet_amount: parseFloat(prepaidAmount).toString(),
                            mobile: "",
                            resource_id: "",
                        }]
                    }))
                    dispatch(addItemToEditedCart({
                        ...props.data,
                        itemId: props.data.item_id,
                        total_price: parseFloat(prepaidAmount),
                        price: parseFloat(prepaidAmount),
                        description: description,
                        wallet_amount: parseFloat(prepaidAmount),
                        wallet_bonus: prepaidBonus
                    }));
                    dispatch(updateCalculatedPrice());
                    props.onCloseModal();
                } else {
                    if (prepaid_wallet[0].wallet_amount !== "") {
                        ToastAndroid.show("Prepaid already in the cart", ToastAndroid.SHORT)
                        return;
                    }
                    dispatch(addItemToCart({
                        description: description,
                        wallet_amount: parseFloat(prepaidAmount),
                        wallet_bonus: prepaidBonus
                    }));
                    dispatch(modifyPrepaidDetails({
                        type: "add", payload: [{
                            bonus_value: prepaidBonus.toString(),
                            description: description,
                            source: "add_prepaid",
                            wallet_amount: parseFloat(prepaidAmount).toString(),
                            mobile: "",
                            resource_id: "",
                        }]
                    }))
                    props.onCloseModal();
                    props.closeOverallModal()
                }
            }} label={"Save"}/>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    prepaidModal: {
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
    noteContainer: {
        borderRadius: 5,
        backgroundColor: Colors.grey100,
        overflow: "hidden",
        padding: 10,
    },
    noteLeftBar: {
        position: "absolute",
        backgroundColor: Colors.highlight,
        width: 2,
        height: "200%",
        left: 0,
    },
    totalCreditText: {
        alignSelf: "flex-end",
        marginTop: 20,
    },
    saveButtonContainer: {
        marginHorizontal: 30,
        marginTop: 20,
        marginBottom: 20,
    }
});

export default PrepaidModal;