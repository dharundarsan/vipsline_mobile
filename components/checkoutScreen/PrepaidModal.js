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
import * as Haptics from "expo-haptics";
import Toast from "../../ui/Toast";

const PrepaidModal = (props) => {
    const prepaid_wallet = useSelector(state => state.cart.prepaid_wallet)
    const appointment_date = useSelector(state => state.cart.appointment_date);
    const [selectedDate, setSelectedDate] = useState(new Date(appointment_date));
    const [prepaidSource, setPrepaidSource] = useState("Add prepaid");
    // const [prepaidAmount, setPrepaidAmount] = useState(props.edited ? props.data.wallet_amount : 0)
    const [prepaidAmount, setPrepaidAmount] = useState(props.edited ? prepaid_wallet[0].wallet_amount : 0)
    // const [prepaidBonus, setPrepaidBonus] = useState(props.edited ? props.data.wallet_bonus : 0)
    const [prepaidBonus, setPrepaidBonus] = useState(props.edited ? prepaid_wallet[0].bonus_value : 0)
    const [description, setDescription] = useState(props.edited ? prepaid_wallet[0].description : "")
    const dispatch = useDispatch();
    const prepaidAmountRef = useRef(null);

    const toastRef = useRef(null);


    return <Modal style={styles.prepaidModal} visible={props.isVisible} animationType={"slide"}
                  presentationStyle="pageSheet" onRequestClose={props.onCloseModal}>
        <Toast ref={toastRef}/>
        <View style={[styles.headingAndCloseContainer, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.heading]}>{props.edited ? "Edit Prepaid" : "Add Prepaid"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <View style={styles.modalContent}>
            <ScrollView>
                <CustomTextInput label={"Date"} type={"date"} readOnly={true} value={selectedDate} onChangeValue={setSelectedDate}/>
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
                <CustomTextInput label={"Bonus amount"} type={"price"} placeholder={"0.00"}
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
                    ₹{parseFloat(prepaidAmount) + parseFloat(prepaidBonus)}</Text>
            </ScrollView>
        </View>
        <Divider/>
        <View style={styles.saveButtonContainer}>
            <PrimaryButton onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                if (!prepaidAmountRef.current()) return;
                if (prepaidBonus > prepaidAmount) {
                    toastRef.current.show("Prepaid bonus should be lesser or equal to actual amount", 2000);
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
                        toastRef.current.show("Prepaid already in the cart", 2000);
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