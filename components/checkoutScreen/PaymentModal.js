import {Modal, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Feather, Ionicons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useState} from "react";
import Colors from "../../constants/Colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomTextInput from "../../ui/CustomTextInput";
import Entypo from '@expo/vector-icons/Entypo';

const PaymentModal = (props) => {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState("split_payment");

    return <Modal style={styles.paymentModal} visible={props.isVisible} animationType={"slide"}>
        <View style={styles.headingAndCloseContainer}>
            <Text style={[textTheme.titleLarge, styles.heading]}>Select Payment</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <ScrollView>
            <View style={styles.modalContent}>
                <View style={styles.paymentOptionsContainer}>
                    <View style={styles.paymentOptionsRow}>
                        <PrimaryButton buttonStyle={styles.paymentOptionButton}
                                       onPress={() => setSelectedPaymentOption("cash")}
                                       pressableStyle={[styles.paymentOptionButtonPressable, selectedPaymentOption === "cash" ? styles.paymentOptionSelected : {}]}>
                            {selectedPaymentOption === "cash" ? <View style={styles.tickContainer}>
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={24}
                                                        color={Colors.highlight}/>
                            </View> : null}
                            <MaterialCommunityIcons name="cash" size={30} color={Colors.green}/>
                            <Text>Cash</Text>
                        </PrimaryButton>
                        <PrimaryButton buttonStyle={styles.paymentOptionButton}
                                       onPress={() => setSelectedPaymentOption("card")}
                                       pressableStyle={[styles.paymentOptionButtonPressable, selectedPaymentOption === "card" ? styles.paymentOptionSelected : {}]}>
                            {selectedPaymentOption === "card" ? <View style={styles.tickContainer}>
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={24}
                                                        color={Colors.highlight}/>
                            </View> : null}
                            <Ionicons name="card-outline" size={30} color={Colors.green}/>
                            <Text>Debit / Credit card</Text>
                        </PrimaryButton>
                    </View>
                    <View style={styles.paymentOptionsRow}>
                        <PrimaryButton
                            buttonStyle={[styles.paymentOptionButton, selectedPaymentOption === "digital_payment" ? styles.paymentOptionSelected : {}]}
                            onPress={() => setSelectedPaymentOption("digital_payment")}
                            pressableStyle={styles.paymentOptionButtonPressable}>
                            {selectedPaymentOption === "digital_payment" ? <View style={styles.tickContainer}>
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={24}
                                                        color={Colors.highlight}/>
                            </View> : null}
                            <MaterialCommunityIcons name="contactless-payment" size={30} color={Colors.green}/>
                            <Text>Digital Payments</Text>
                        </PrimaryButton>
                        <PrimaryButton buttonStyle={styles.paymentOptionButton}
                                       onPress={() => setSelectedPaymentOption("split_payment")}
                                       pressableStyle={[styles.paymentOptionButtonPressable, selectedPaymentOption === "split_payment" ? styles.paymentOptionSelected : {}]}>
                            {selectedPaymentOption === "split_payment" ? <View style={styles.tickContainer}>
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={24}
                                                        color={Colors.highlight}/>
                            </View> : null}
                            <MaterialCommunityIcons name="table-split-cell" size={30} color={Colors.green}/>
                            <Text>Split Payment</Text>
                        </PrimaryButton>
                    </View>
                </View>
                <CustomTextInput type={"text"} label={"Payment"}/>
                <CustomTextInput type={"text"} label={"Change"}/>
                <View style={styles.addPaymentButtonContainer}>
                    <PrimaryButton buttonStyle={styles.addPaymentButton}
                                   pressableStyle={styles.addPaymentButtonPressable}>
                        <Entypo name="plus" size={15} color="black"/>
                        <Text style={[textTheme.bodyMedium]}>Add payment method</Text>
                    </PrimaryButton>
                </View>
            </View>
        </ScrollView>
        <Divider/>
        <View style={styles.buttonContainer}>
            <PrimaryButton buttonStyle={styles.optionButton}>
                <Entypo name="dots-three-horizontal" size={24} color="black"/>
            </PrimaryButton>
            <PrimaryButton buttonStyle={styles.checkoutButton} pressableStyle={styles.checkoutButtonPressable}
                           onPress={() => {
                               setIsPaymentModalVisible(true)
                           }}>
                <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>Total Amount</Text>
                <View style={styles.checkoutButtonAmountAndArrowContainer}>
                    <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ 5000</Text>
                    <Feather name="arrow-right-circle" size={24} color={Colors.white}/>
                </View>
            </PrimaryButton>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    paymentModal: {
        flex: 1,
    },
    headingAndCloseContainer: {
        marginTop: Platform.OS === "ios" ? 50 : 0,
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
        padding: 25,
    },
    paymentOptionsContainer: {
        marginTop: 40,
        gap: 15,
        marginBottom: 25,
    },
    paymentOptionsRow: {
        gap: 15,
        flexDirection: "row",
    },
    paymentOptionButton: {
        backgroundColor: Colors.background,
        overflow: "visible",
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        flex: 1,
        borderColor: Colors.grey400,
    },
    paymentOptionSelected: {
        borderRadius:10,
        borderColor: Colors.highlight,
        borderWidth: 2,
    },
    tickContainer: {
        position: "absolute",
        right: -15,
        top: -15,
        zIndex: 10,
    },
    paymentOptionButtonPressable: {
        paddingHorizontal: 0,
        paddingVertical: 30,
    },
    addPaymentButtonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    addPaymentButton: {
        backgroundColor: Colors.grey100,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.grey400,
        alignSelf: "flex-start"
    },
    addPaymentButtonPressable: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        gap: 5,
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    buttonContainer: {
        flexDirection: "row",
        margin: 10,
        gap: 10,
        padding: 3,
    },
    optionButton: {
        backgroundColor: Colors.transparent, borderColor: Colors.grey900, borderWidth: 1,
    },
    checkoutButton: {
        flex: 1,
    },
    checkoutButtonPressable: {
        // flex:1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "space-between", // alignItems:"stretch",
        // alignSelf:"auto",
    },
    checkoutButtonAmountAndArrowContainer: {
        flexDirection: "row", gap: 25,
    },
    checkoutButtonText: {
        color: Colors.white
    },
})

export default PaymentModal