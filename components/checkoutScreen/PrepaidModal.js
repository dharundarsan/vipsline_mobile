import {Modal, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import CustomTextInput from "../../ui/CustomTextInput";
import {addItemToCart} from "../../store/cartSlice";
import {useDispatch} from "react-redux";

const PrepaidModal = (props) => {
    const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
    const [prepaidSource, setPrepaidSource] = useState();
    const [prepaidAmount, setPrepaidAmount] = useState()
    const [prepaidBonus, setPrepaidBonus] = useState()
    const [description, setDescription] = useState()
    const dispatch = useDispatch();
    return <Modal style={styles.prepaidModal} visible={props.isVisible} animationType={"slide"}>
        <View style={styles.headingAndCloseContainer}>
            <Text style={[textTheme.titleLarge, styles.heading]}>Add Prepaid</Text>
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
                <CustomTextInput label={"Date"} type={"date"} value={selectedDate} onChangeValue={setSelectedDate}/>
                <CustomTextInput label={"Prepaid Source"} type={"dropdown"}
                                 dropdownItems={["Add prepaid", "Balance carry forward"]} value={prepaidSource}
                                 onChangeValue={setPrepaidSource}/>
                <CustomTextInput label={"Prepaid amount"} type={"text"} placeholder={"0.00"} value={prepaidAmount}
                                 onChangeText={setPrepaidAmount}/>
                <CustomTextInput label={"Prepaid Bonus"} type={"text"} placeholder={"0.00"} value={prepaidBonus}
                                 onChangeText={setPrepaidBonus}/>
                <CustomTextInput label={"Description"} type={"multiLine"} value={description}
                                 onChangeText={setDescription}/>
                <View style={styles.noteContainer}>
                    <View style={styles.noteLeftBar}></View>
                    <Text style={[textTheme.bodyMedium]}>Note: Total Prepaid Credit = (Prepaid amount + Bonus
                        Value)</Text>
                </View>
                <Text style={[textTheme.titleMedium, styles.totalCreditText]}>Total Prepaid Credit: $7000</Text>
            </ScrollView>
        </View>
        <Divider/>
        <View style={styles.saveButtonContainer}>
            <PrimaryButton onPress={() => {
                props.onCloseModal();
                dispatch(addItemToCart({
                    description: description,
                    wallet_amount: prepaidAmount,
                    wallet_bonus: prepaidBonus
                }));
            }} label={"Save"}/>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    prepaidModal: {
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