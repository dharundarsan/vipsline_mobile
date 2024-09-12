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
import checkoutBooking from "../../util/apis/checkoutBookingAPI";
import checkoutBookingAPI from "../../util/apis/checkoutBookingAPI";
import {useDispatch, useSelector} from "react-redux";
import {loadBookingDetailsFromDb, loadInvoiceDetailsFromDb, updateBookingId} from "../../store/invoiceSlice";
import updateAPI from "../../util/apis/updateAPI";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import updateLiveStatusAPI from "../../util/apis/updateLiveStatusAPI";
import {shadowStyling} from "../../util/Helpers";

const PaymentModal = (props) => {
    const dispatch = useDispatch();


    const [selectedPaymentOption, setSelectedPaymentOption] = useState("cash");
    const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(props.price);
    const [splitResponse, setSplitResponse] = useState([]);
    const [addedSplitPayment, setAddedSplitPayment] = useState(null);
    const [stopAPI, setStopAPI] = useState(false);
    const [isSplitPaymentDropdownVisible, setIsSplitPaymentDropdownVisible] = useState(false)
    const [recentlyChanged, setRecentlyChanged] = useState([]);
    const [paymentOrder, setPaymentOrder] = useState(["cash"])
    const [isError, setIsError] = useState(false);
    const [bodyData, setBodyData] = useState([])
    const [shownCount, setShownCount] = useState(0)
    const invoiceDetails = useSelector(state => state.invoice.details);


    const [splitUpState, setSplitUpState] = useState([
            {
                mode: "cash",
                shown: true,
                amount: 0,
                name: "Cash"
            }, {
                mode: "card",
                shown: true,
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

    const cartSliceState = useSelector((state) => state.cart);
    const details = useSelector(state => state.clientInfo.details);

    useEffect(() => {
        if (addedSplitPayment !== null) setPaymentOrder(prev => [...prev, addedSplitPayment]);
        setSplitUpState(prev => prev.map((split) => {
            setShownCount(prev.reduce((acc, item) => {
                return item.shown ? acc + 1 : acc;
            }, 0))
            // const shownCount = splitUpState.reduce((acc, item) => {
            //     return item.shown ? acc + 1 : acc;
            // }, 0);
            if (split.name === addedSplitPayment) {
                if (shownCount === 0) {
                    return ({
                        ...split,
                        amount: props.price,
                        shown: true
                    })
                } else {
                    return ({
                        ...split,
                        shown: true
                    })
                }
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
                shown: true,
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

    const callSplitAPI = () => {
        if (stopAPI) return;

        const splitApi = async () => {
            let data;
            if (selectedPaymentOption === "split_payment") {
                // const shownCount = splitUpState.reduce((acc, item) => {
                //     return item.shown ? acc + 1 : acc;
                // }, 0);
                                const aiyoda = recentlyChanged.slice(Math.abs(recentlyChanged.length - shownCount), recentlyChanged.length - 1);
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


            const response = await splitPaymentAPI(data);
                                    setSplitResponse(response[0]);
            setStopAPI(true);
        }
        splitApi();
    }

    useEffect(() => {
        let totalCount = 0;
        splitUpState.map((prev => {
            if (prev.shown) {
                totalCount += prev.amount;
            }
        }))
        if (totalCount === props.price)
            setIsError(false);

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

        setShownCount(splitUpState.reduce((acc, item) => {
            return item.shown ? acc + 1 : acc;
        }, 0))
    }, [splitResponse]);

    const callCashAPI = () => {
        if (selectedPaymentOption === "card" || selectedPaymentOption === "digital payments") {
            if (parseFloat(totalPrice) > props.price) {
                setTotalPrice(props.price);
            }
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
                    }
        splitApi();
    }
    const insets = useSafeAreaInsets();
    return <Modal style={styles.paymentModal} visible={props.isVisible} animationType={"slide"}>
        <DropdownModal isVisible={isSplitPaymentDropdownVisible} onCloseModal={() => {
            setIsSplitPaymentDropdownVisible(false)
        }} dropdownItems={["Cash", "Credit / Debit card", "Digial payment"]} onChangeValue={setAddedSplitPayment}/>
        {
            isInvoiceModalVisible && Object.keys(invoiceDetails).length !== 0 ?
                <InvoiceModal data={props.data} isVisible={isInvoiceModalVisible} onCloseModal={() => {
                    setIsInvoiceModalVisible(false);
                    props.onCloseModal();
                }}/> :
                null
        }

        <View style={[styles.headingAndCloseContainer,{marginTop:insets.top}, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.heading]}>Select Payment</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <ScrollView>
            <View style={styles.modalContent}>
                <View style={styles.paymentOptionsContainer}>
                    <View style={styles.paymentOptionsRow}>
                        <PrimaryButton
                            buttonStyle={[styles.paymentOptionButton, selectedPaymentOption === "cash" ? styles.paymentOptionSelected : {}]}
                            onPress={() => setSelectedPaymentOption("cash")}
                            pressableStyle={styles.paymentOptionButtonPressable}>
                            {selectedPaymentOption === "cash" ? <View style={styles.tickContainer}>
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={24}
                                                        color={Colors.highlight}/>
                            </View> : null}
                            <MaterialCommunityIcons name="cash" size={30} color={Colors.green}/>
                            <Text>Cash</Text>
                        </PrimaryButton>
                        <PrimaryButton
                            buttonStyle={[styles.paymentOptionButton, selectedPaymentOption === "card" ? styles.paymentOptionSelected : {}]}
                            onPress={() => setSelectedPaymentOption("card")}
                            pressableStyle={styles.paymentOptionButtonPressable}>
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
                        <PrimaryButton
                            buttonStyle={[styles.paymentOptionButton, selectedPaymentOption === "split_payment" ? styles.paymentOptionSelected : {}]}
                            onPress={() => setSelectedPaymentOption("split_payment")}
                            pressableStyle={styles.paymentOptionButtonPressable}>
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
                    <CustomTextInput type={"number"} label={"Payment"} value={totalPrice.toString()}
                                     placeholder={"Price"}
                                     onChangeText={(price) => {
                                                                                                                           if (price.trim().length === 0) {
                                             setTotalPrice(0)
                                             return
                                         }
                                         if (price.split(" ").length > 1) return;
                                         if (price.split(".").length > 2) return;

                                         setTotalPrice(price);
                                     }}
                                     onEndEditing={(value) => {
                                         if (parseFloat(value) < props.price) {
                                             setSelectedPaymentOption("split_payment")
                                         }
                                         callCashAPI()
                                     }}
                    />
                    {selectedPaymentOption === "cash" && splitResponse.length > 0 && splitResponse[0] !== undefined ?
                        <CustomTextInput type={"number"} label={"Change"}
                                         value={splitResponse[0].change_to_be_given === undefined ? "" : splitResponse[0].change_to_be_given.toString()}
                                         readOnly={true}/> : null}
                </> : null}
                {selectedPaymentOption === "split_payment" ? <View>
                    <FlatList scrollEnabled={false} data={splitUpState} renderItem={({item, index}) => {
                        // const shownCount = splitUpState.reduce((acc, item) => {
                        //     return item.shown ? acc + 1 : acc;
                        // }, 0);
                        if (item.shown) {
                            return <View style={styles.splitInputAndCloseContainer}>
                                <CustomTextInput
                                    textInputStyle={isError ? {borderColor: Colors.error} : {borderColor: Colors.green}}
                                    type={"number"} label={item.name} value={item.amount.toString()} flex={1}
                                    readOnly={shownCount === 3 && item.name === paymentOrder.at(-1)}
                                    onChangeText={(text) => {
                                        if (text.split(" ").length > 1) return;
                                        if (text.split(".").length > 2) return;
                                        setSplitUpState(prev => prev.map((split) => {
                                            if (split.mode === item.mode) {
                                                if (text.trim().at(-1) === ".") {
                                                    return ({
                                                        ...split,
                                                        amount: text.trim()
                                                    })
                                                } else {
                                                    return ({
                                                        ...split,
                                                        amount: text.trim().length === 0 ? 0 : parseFloat(text)
                                                    })
                                                }
                                            }
                                            return split;
                                        }))
                                        setStopAPI(false);
                                        setRecentlyChanged(prev => {
                                                if (prev.at(-1) === item.mode) return prev
                                                else return [...prev, item.mode]
                                            }
                                        );
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
                                            setIsError(true);
                                            ToastAndroid.show("Split Payments are not summing upto transaction total. Please check.", ToastAndroid.SHORT);
                                            return;
                                        } else if (totalValue > props.price) {
                                            setIsError(false);
                                        }

                                        callSplitAPI();
                                    }}
                                />
                                <PrimaryButton buttonStyle={styles.splitInputCloseButton} onPress={() => {
                                    // setPaymentOrder(prev => prev.slice(0, prev.length - 1));
                                    setPaymentOrder(prev => prev.filter((order) => order !== item.mode));
                                    setRecentlyChanged(prev => prev.filter(ele => ele !== item.mode));
                                    setSplitUpState(prev => prev.map((split) => {
                                        if (split.mode === paymentOrder.at(0) && shownCount === 2) {
                                            return ({
                                                ...split,
                                                amount: props.price,
                                            })
                                        }
                                        return split;
                                    }))
                                    // if ((split.mode === paymentOrder.at(0) || split.mode === paymentOrder.at(1)) && shownCount === 3) {
                                    //     if (split.mode === paymentOrder.at(0)){
                                    //         return ({
                                    //             ...split,
                                    //             amount: props.price,
                                    //         })
                                    //     } else if (split.mode === paymentOrder.at(1)){
                                    //         return ({
                                    //             ...split,
                                    //             amount: 0,
                                    //         })
                                    //     }
                                    // }
                                    setSplitUpState(prev => prev.map((split) => {
                                        setShownCount(prev => prev - 1);
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
                                </PrimaryButton>
                            </View>
                        }
                    }}/>
                    {shownCount !== 3 ? <View style={styles.addPaymentButtonContainer}>
                        <PrimaryButton onPress={() => setIsSplitPaymentDropdownVisible(true)}
                                       buttonStyle={styles.addPaymentButton}
                                       pressableStyle={styles.addPaymentButtonPressable}>
                            <Entypo name="plus" size={15} color="black"/>
                            <Text style={[textTheme.bodyMedium]}>Add payment method</Text>
                        </PrimaryButton>
                    </View> : null}
                </View> : null}
            </View>
        </ScrollView>
        <Divider/>
        <View style={[styles.buttonContainer,{paddingBottom:insets.bottom}]}>
            <PrimaryButton buttonStyle={styles.optionButton}>
                <Entypo name="dots-three-horizontal" size={24} color="black"/>
            </PrimaryButton>
            <PrimaryButton buttonStyle={styles.checkoutButton} pressableStyle={styles.checkoutButtonPressable}
                           onPress={ async() => {
                                   setIsInvoiceModalVisible(true);
                               try {
                                   await checkoutBookingAPI(details.id, cartSliceState).then(response => {
                                       if(response.data === null) {
                                           return
                                       }
                                    updateAPI(response[0].booking_id, selectedPaymentOption, splitUpState);
                                    updateLiveStatusAPI(response[0].booking_id);
                                    dispatch(updateBookingId(response[0].booking_id));
                                    dispatch(loadBookingDetailsFromDb(response[0].booking_id));
                                    dispatch(loadInvoiceDetailsFromDb(response[0].booking_id));
                                   })
                                   console.clear();
                                   // Assuming dispatch is an asynchronous action creator
                               } catch (error) {
                                   console.error("An error occurred:", error);
                                   // Handle the error appropriately here
                               }
                           }}>
                <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>Total Amount</Text>
                <View style={styles.checkoutButtonAmountAndArrowContainer}>
                    <Text style={[textTheme.titleMedium, styles.checkoutButtonText]}>₹ {props.price}</Text>
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
        // marginTop: Platform.OS === "ios" ? 50 : 0,
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
        marginTop: 10,
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
        paddingVertical: 20,
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