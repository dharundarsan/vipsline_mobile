import {FlatList, Modal, Platform, ScrollView, StyleSheet, Text, ToastAndroid, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Feather, Ionicons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import CustomTextInput from "../../ui/CustomTextInput";
import Entypo from '@expo/vector-icons/Entypo';
import InvoiceModal from "./InvoiceModal";
import splitPaymentAPI from "../../util/apis/SplitPaymentAPI";
import DropdownModal from "../../ui/DropdownModal";

const PaymentModal = (props) => {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState("cash");
    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(props.price);
    const [splitResponse, setSplitResponse] = useState([]);
    const [addedSplitPayment, setAddedSplitPayment] = useState(null);
    const [stopAPI, setStopAPI] = useState(false);
    const [isSplitPaymentDropdownVisible, setIsSplitPaymentDropdownVisible] = useState(false)
    const [recentlyChanged, setRecentlyChanged] = useState([]);
    const [paymentOrder, setPaymentOrder] = useState(["cash"])
    const [bodyData, setBodyData] = useState([])

    const [splitUpState, setSplitUpState] = useState([
            {
                mode: "cash",
                shown: true,
                amount: 0,
                name: "Cash"
            }, {
                mode: "card",
                shown: false,
                amount: 0,
                name: "Credit / Debit Card"
            }, {
                mode: "digital payments",
                shown: false,
                amount: 0,
                name: "Digital payment"
            },
        ]
    )

    useEffect(() => {
        setPaymentOrder(prev => [...prev, addedSplitPayment]);
        setSplitUpState(prev => prev.map((split) => {
            if (split.name === addedSplitPayment) {
                console.log(addedSplitPayment)
                console.log(split.name === addedSplitPayment)
                return ({
                    ...split,
                    shown: true
                })
            }
            return split;
        }))
        setAddedSplitPayment(null);
    }, [addedSplitPayment]);

    useEffect(() => {
        setTotalPrice(props.price);
        setSplitUpState([
            {
                mode: "cash",
                shown: true,
                amount: props.price,
                name: "Cash"
            }, {
                mode: "card",
                shown: false,
                amount: 0,
                name: "Credit / Debit card"
            }, {
                mode: "digital payments",
                shown: false,
                amount: 0,
                name: "Digial payment"
            },
        ])
    }, [props.price, props.isVisible]);

    useEffect(() => {
        setSplitResponse([]);
        setTotalPrice(props.price);
    }, [selectedPaymentOption]);

    const callAPI = () => {
        if (stopAPI) return;

        const splitApi = async () => {
            let data;
            if (selectedPaymentOption === "split_payment") {
                const shownCount = splitUpState.reduce((acc, item) => {
                    return item.shown ? acc + 1 : acc;
                }, 0);
                console.log(shownCount)
                const aiyoda = recentlyChanged.slice(Math.abs(recentlyChanged.length - shownCount), recentlyChanged.length - 1);
                console.log("aiyoda");
                console.log(aiyoda);
                // return;
                data = {
                    booking_amount: props.price,
                    paid_amount: splitUpState.map(split => {
                        if (split.mode === "cash" && split.shown) {
                            if (shownCount === 3 && paymentOrder.at(-1) === "cash") {
                                return {
                                    mode: "CASH",
                                    amount: 0
                                }
                            }
                            if (shownCount === 2 && aiyoda.includes(split.mode)) {
                                return {
                                    mode: "CASH",
                                    amount: 0
                                }
                            }
                            return {
                                mode: "CASH",
                                amount: split.amount
                            }
                        } else if (split.mode === "card" && split.shown) {
                            if (shownCount === 3 && paymentOrder.at(-1) === "card") {
                                return {
                                    mode: "CARD",
                                    amount: 0
                                }
                            }
                            if (shownCount === 2 && aiyoda.includes(split.mode)) {
                                return {
                                    mode: "CARD",
                                    amount: 0
                                }
                            }
                            return {
                                mode: "CARD",
                                amount: split.amount
                            }
                        } else if (split.mode === "digital payments" && split.shown) {
                            if (shownCount === 3 && paymentOrder.at(-1) === "digital payments") {
                                return {
                                    mode: "DIGITAL PAYMENTS",
                                    amount: 0
                                }
                            }
                            if (shownCount === 2 && aiyoda.includes(split.mode)) {
                                return {
                                    mode: "DIGITAL PAYMENTS",
                                    amount: 0
                                }
                            }
                            return {
                                mode: "DIGITAL PAYMENTS",
                                amount: split.amount
                            }
                        }
                        return null;
                    }).filter(item => item !== null)
                }
            }

            console.log("DATA")
            console.log(data)

            const response = await splitPaymentAPI(data);
            console.log("response")
            console.log(response)
            setSplitResponse(response[0]);
            setStopAPI(true);
        }
        splitApi();
    }

    useEffect(() => {

    }, [splitUpState]);

    useEffect(() => {
        const objectEntries = Object.entries(splitResponse);

        setSplitUpState(prev => prev.map(state => {
            const foundEntry = objectEntries.find(entry => entry[0].toUpperCase() === state.mode.toUpperCase());
            if (foundEntry) {
                return {
                    ...state,
                    amount: parseFloat(foundEntry[1]),
                    shown: true,
                }
            }
            return state;
        }));
    }, [splitResponse]);

    useEffect(() => {
        if (selectedPaymentOption === "card" || selectedPaymentOption === "digital payments") {
            if (parseFloat(totalPrice) > props.price) {
                setTotalPrice(props.price);
            }
        }

        if (parseFloat(totalPrice) < props.price) {
            setSelectedPaymentOption("split_payment");
            return;
        }
        const splitApi = async () => {
            if (selectedPaymentOption === "cash") {
                const response = await splitPaymentAPI({
                    booking_amount: props.price,
                    paid_amount: [{mode: "CASH", amount: totalPrice}]
                });
                setSplitResponse(response);
            } else if (selectedPaymentOption === "split_payment") {
                const response = await splitPaymentAPI({
                    booking_amount: props.price,
                    paid_amount: [{mode: "CASH", amount: totalPrice}]
                });
                setSplitResponse(response);
            }
            console.log(response);
        }
        splitApi();
    }, [totalPrice]);

    return <Modal style={styles.paymentModal} visible={props.isVisible} animationType={"slide"}>
        <DropdownModal isVisible={isSplitPaymentDropdownVisible} onCloseModal={() => {
            setIsSplitPaymentDropdownVisible(false)
        }} dropdownItems={["Cash", "Credit / Debit card", "Digial payment"]} onChangeValue={setAddedSplitPayment}/>
        <InvoiceModal isVisible={isInvoiceModalVisible} onCloseModal={() => {
            setIsInvoiceModalVisible(false)
        }}/>
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
                            buttonStyle={[styles.paymentOptionButton, selectedPaymentOption === "digital payments" ? styles.paymentOptionSelected : {}]}
                            onPress={() => setSelectedPaymentOption("digital payments")}
                            pressableStyle={styles.paymentOptionButtonPressable}>
                            {selectedPaymentOption === "digital payments" ? <View style={styles.tickContainer}>
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
                {selectedPaymentOption === "cash" || selectedPaymentOption === "card" || selectedPaymentOption === "digital payments" ? <>
                    <CustomTextInput type={"text"} label={"Payment"} value={totalPrice.toString()} placeholder={"Price"}
                                     onChangeText={(price) => {
                                         setTotalPrice(price);
                                     }}/>
                    {selectedPaymentOption === "cash" && splitResponse.length > 0 && splitResponse[0] !== undefined ?
                        <CustomTextInput type={"text"} label={"Change"}
                                         value={splitResponse[0].change_to_be_given === undefined ? "" : splitResponse[0].change_to_be_given.toString()}
                                         readOnly={true}/> : null}
                </> : null}
                {selectedPaymentOption === "split_payment" ? <View>
                    <FlatList scrollEnabled={false} data={splitUpState} renderItem={({item, index}) => {
                        const shownCount = splitUpState.reduce((acc, item) => {
                            return item.shown ? acc + 1 : acc;
                        }, 0);
                        console.log("INDEX")
                        console.log(index)
                        console.log(shownCount)
                        console.log(index - 1 === shownCount)
                        if (item.shown) {
                            return <View style={styles.splitInputAndCloseContainer}>
                                <CustomTextInput type={"text"} label={item.name} value={item.amount.toString()} flex={1}

                                                 readOnly={index + 1 === 3}
                                                 onChangeText={(text) => {
                                                     setSplitUpState(prev => prev.map((split) => {
                                                         if (split.mode === item.mode) {
                                                             return ({
                                                                 ...split,
                                                                 amount: text.trim().length === 0 ? 0 : parseFloat(text)
                                                             })
                                                         }
                                                         return split;
                                                     }))
                                                     setStopAPI(false);
                                                     setRecentlyChanged(prev => {
                                                             if (prev.at(-1) === item.mode) return prev
                                                             else return [...prev, item.mode]
                                                         }
                                                     );
                                                     console.log("ONCHANGETEXT");
                                                     console.log(text);
                                                     console.log("ONCHANGE");
                                                     console.log(splitUpState);
                                                 }}
                                                 onEndEditing={(text) => {
                                                     const totalValue = splitUpState.reduce((acc, ele) => {
                                                         if (ele.shown) {
                                                             if (ele.mode === item.mode) return acc + parseFloat(text)
                                                             return acc + ele.amount;
                                                         }
                                                         return acc;
                                                     }, 0)

                                                     if (totalValue > props.price) {
                                                         ToastAndroid.show("Split Payments are not summing upto transaction total. Please check.", ToastAndroid.SHORT);
                                                         return;
                                                     }

                                                     callAPI();
                                                 }}
                                />
                                {index + 1 === shownCount ?
                                    <PrimaryButton buttonStyle={styles.splitInputCloseButton} onPress={() => {
                                        setPaymentOrder(prev => prev.slice(0, prev.length - 1));
                                        setRecentlyChanged(prev => prev.filter(ele => ele !== item.mode));

                                        setSplitUpState(prev => prev.map((split) => {
                                            if (split.mode === paymentOrder.at(0) && shownCount === 2) {
                                                return ({
                                                    ...split,
                                                    amount: props.price,
                                                })
                                            }
                                            if ((split.mode === paymentOrder.at(0) || split.mode === paymentOrder.at(1)) && shownCount === 3) {
                                                return ({
                                                    ...split,
                                                    amount: props.price,
                                                })
                                            }
                                            if (split.mode === item.mode) {
                                                return ({
                                                    ...split,
                                                    amount: 0,
                                                    shown: false
                                                })
                                            }
                                            return split;
                                        }))
                                    }}>
                                        <Ionicons name="close" size={24} color="black"/>
                                    </PrimaryButton> : null}
                            </View>
                        }
                    }}/>
                    {<View style={styles.addPaymentButtonContainer}>
                        <PrimaryButton onPress={() => setIsSplitPaymentDropdownVisible(true)}
                                       buttonStyle={styles.addPaymentButton}
                                       pressableStyle={styles.addPaymentButtonPressable}>
                            <Entypo name="plus" size={15} color="black"/>
                            <Text style={[textTheme.bodyMedium]}>Add payment method</Text>
                        </PrimaryButton>
                    </View>}
                </View> : null}
            </View>
        </ScrollView>
        <Divider/>
        <View style={styles.buttonContainer}>
            <PrimaryButton buttonStyle={styles.optionButton}>
                <Entypo name="dots-three-horizontal" size={24} color="black"/>
            </PrimaryButton>
            <PrimaryButton buttonStyle={styles.checkoutButton} pressableStyle={styles.checkoutButtonPressable}
                           onPress={() => {
                               setIsInvoiceModalVisible(true);
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
        borderRadius: 10,
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
    splitInputAndCloseContainer: {
        gap: 10,
        flexDirection: "row",
    },
    splitInputCloseButton: {
        backgroundColor: Colors.background,
    }
})

export default PaymentModal