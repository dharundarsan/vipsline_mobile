import {Modal, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import Colors from "../../constants/Colors";
import Feather from '@expo/vector-icons/Feather';
import {Row, Table} from "react-native-table-component";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useDispatch, useSelector} from "react-redux";
import {checkNullUndefined, dateFormatter, shadowStyling} from "../../util/Helpers";
import {useEffect, useRef, useState} from "react";
import {loadWalletPriceFromDb} from "../../store/invoiceSlice";
import DropdownModal from "../../ui/DropdownModal";
import {useNavigation} from "@react-navigation/native";
import sendEmailAPI from "../../util/apis/sendEmailAPI";
import sendSMSAPI from "../../util/apis/sendSMSAPI";
import BottomModal from "../../ui/BottomModal";
import cancelInvoiceAPI from "../../util/apis/cancelInvoiceAPI";
import * as SecureStore from 'expo-secure-store';
import clearCartAPI from "../../util/apis/clearCartAPI";
import {clearClientInfo} from "../../store/clientInfoSlice";
import {
    clearCalculatedPrice,
    clearLocalCart,
    clearSalesNotes,
    loadCartFromDB,
    modifyClientMembershipId,
    modifyPrepaidDetails
} from "../../store/cartSlice";
import * as Haptics from "expo-haptics";
import Toast from "../../ui/Toast";
// import {ALERT_TYPE, AlertNotificationRoot, Toast} from "react-native-alert-notification";


const InvoiceModal = (props) => {

    const details = useSelector(state => state.invoice.details);
    const bookingId = useSelector(state => state.invoice.booking_id1);

    const invoiceDetails = useSelector(state => state.invoice.invoiceDetails);

    const selectedClientDetails = useSelector(state => state.clientInfo.details);
    // console.log(selectedClientDetails)

    const dispatch = useDispatch();


    const navigation = useNavigation();

    const [actionModalVisibility, setActionModalVisibility] = useState(false);
    const [optionModalVisibility, setOptionModalVisibility] = useState(false);

    const [SMSModalVisibility, setSMSModalVisibility] = useState(false);
    const [emailModalVisibility, setEmailModalVisibility] = useState(false);
    const [cancelInvoiceModalVisibility, setCancelInvoiceModalVisibility] = useState(false);

    const phoneNoRef = useRef(null);
    const emailRef = useRef(null);
    const cancelReasonRef = useRef(null);

    const [email, setEmail] = useState(selectedClientDetails.username);
    const [phone, setPhone] = useState(["+91", selectedClientDetails.mobile_1]);
    const [cancelReason, setCancelReason] = useState("");

    const [isCancelled, setIsCancelled] = useState(false);

    // const [businessId, setBusinessId] = useState("");

    const calculatedPrice = useSelector(state => state.cart.calculatedPrice);

    const businessId = useSelector(state => state.authDetails.businessId);

    const walletBalance = useSelector(state => state.invoice.walletBalance);

    const toastRef = useRef(null);


    let centralGST = (details.total * 0.09);
    let stateGST = (details.total * 0.09);

    async function getBusinessId() {
        try {
            // const value = await AsyncStorage.getItem('businessId');
            const value = await SecureStore.getItemAsync('businessId');
            if (value !== null) {
                return value;
            }
        } catch (e) {
        }
    }


    let extraCharges = 0;
    {
        details.extra_charges && details.extra_charges.length > 0 && details.extra_charges.map((item, index) => {
            extraCharges += item.amount;
        })
    }


    const listOfBusinesses = useSelector(state => state.businesses.listOfBusinesses);
    // let selectedBusinessDetails = "";
    // getBusinessId().then(r => {
    //     setBusinessId(r);
    // });
    const selectedBusinessDetails = listOfBusinesses.filter((item) => {
        return item.id === businessId
    })[0];


    const businessName = selectedBusinessDetails.name;
    const businessContact = selectedBusinessDetails.mobile_1;
    const businessAddress = selectedBusinessDetails.address;
    const businessEmail = selectedBusinessDetails.email;

    useEffect(() => {
        // TODO

        // Toast.show({
        //     type: ALERT_TYPE.SUCCESS,
        //     title: "Updated successfully",
        //     textBody: "Invoice generated",
        //     autoClose: 1500,
        // });

        toastRef.current.show("Updated successfully", 2000);
    }, []);

    useEffect(() => {
        async function api() {
            try {
                dispatch(await loadWalletPriceFromDb(selectedClientDetails.id));
            } catch (e) {
            }
        }

        api();
    }, [selectedClientDetails]);


    const calculateTotalDifference = (organizedList) => {
        return organizedList.reduce((total, category) => {
            const categoryTotal = category.list.reduce((subTotal, item) => {
                return subTotal + (item.service_cost - item.price);
            }, 0);
            return total + categoryTotal;
        }, 0);
    };

    const totalDiscountPercent = calculateTotalDifference(details.organized_list);

    const textStyle1 = {
        textAlign: "center",
        fontWeight: "bold"
    };


    const textStyle2 = {
        textAlign: "center"
    }



    return <Modal style={styles.invoiceModal} animationType={"slide"}
                  visible={props.isVisible}
        // presentationStyle="pageSheet" onRequestClose={()=>{
        //     clearCartAPI();
        //     dispatch(modifyClientMembershipId({type: "clear"}))
        //     dispatch(clearSalesNotes());
        //     dispatch(clearLocalCart());
        //     dispatch(clearClientInfo());
        //     dispatch(clearCalculatedPrice());
        //     dispatch(modifyPrepaidDetails({type: "clear"}))
        // }}
    >
        <Toast ref={toastRef}/>
        {/*<AlertNotificationRoot theme={"light"}*/}
        {/*                       toastConfig={{titleStyle: {fontSize: 15}, textBodyStyle: {fontSize: 12}}}*/}
        {/*                       colors={[{*/}
        {/*                           // label: Colors.white,*/}
        {/*                           card: Colors.grey200,*/}
        {/*                           // card: "#ff7171",*/}
        {/*                           // card: "#b73737",*/}
        {/*                       }]}>*/}


        <View style={[styles.headingAndCloseContainer, shadowStyling]}>


            <DropdownModal
                isVisible={actionModalVisibility}
                onCloseModal={() => {
                    setActionModalVisibility(false)
                }}
                dropdownItems={[
                    "SMS",
                    "Email",
                    "Thermal Print",
                    "A4 Print",
                    "Cancel Invoice"
                ]}
                iconImage={[
                    require("../../assets/icons/invoiceIcons/send.png"),
                    require("../../assets/icons/invoiceIcons/mail.png"),
                    require("../../assets/icons/invoiceIcons/printer.png"),
                    require("../../assets/icons/invoiceIcons/printer.png"),
                    require("../../assets/icons/invoiceIcons/cancel.png"),
                ]}
                imageHeight={24}
                imageWidth={24}
                primaryViewChildrenStyle={styles.dropdownInnerContainer}
                onChangeValue={(value) => {
                    if (value === "SMS") {
                        setSMSModalVisibility(true);
                    } else if (value === "Email") {
                        setEmailModalVisibility(true);
                    } else if (value === "Cancel Invoice") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                        setCancelInvoiceModalVisibility(true);
                    }
                }}
            />

            <BottomModal
                visible={SMSModalVisibility}
                title={"Send SMS"}
                placeholder={"Enter Phone Number"}
                type={"phoneNo"}
                label={"Client Mobile"}
                buttonOneName={"Cancel"}
                buttonTwoName={"Send"}
                onCloseModal={() => setSMSModalVisibility(false)}
                onChangeText={(text) => setPhone(text)}
                value={phone[1]}
                buttonTwoOnPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                    const phoneNoValid = phoneNoRef.current();
                    if (phoneNoValid) {
                        toastRef.current.show(await sendSMSAPI(selectedClientDetails.name, phone[1]), 2000);
                        setSMSModalVisibility(false)
                    }
                }}
                buttonOneOnPress={() => setSMSModalVisibility(false)}
                onSave={(callback) => {
                    phoneNoRef.current = callback;
                }}
                validator={(text) => text.length !== 10 ? "Phone number is invalid" : true}
            />
            <BottomModal
                visible={emailModalVisibility}
                title={"Send Email"}
                placeholder={"Enter email address"}
                type={"email"}
                label={"Client email"}
                buttonOneName={"Cancel"}
                buttonTwoName={"Send"}
                onCloseModal={() => setEmailModalVisibility(false)}
                onChangeText={(text) => setEmail(text)}
                value={checkNullUndefined(email) ? email.trim() : ""}
                buttonTwoOnPress={async () => {
                    const emailValid = emailRef.current();
                    if (emailValid) {
                        let msg = await sendEmailAPI(email, bookingId);
                        setEmailModalVisibility(false);
                        if (msg === "success") {
                            toastRef.current.show("email send successfully", 1000);
                        }
                    }
                }}
                buttonOneOnPress={() => setEmailModalVisibility(false)}
                validator={(text) => !text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ? "Email is invalid" : true}
                onSave={(callback) => {
                    emailRef.current = callback;
                }}
            />

            <BottomModal
                title={"Cancel Invoice"}
                visible={cancelInvoiceModalVisibility}
                placeholder={"Enter the Valid Reason"}
                onCloseModal={() => {
                    setCancelInvoiceModalVisibility(false)
                    setCancelReason("")
                }}
                type={"multiLine"}
                label={"Reason"}
                buttonOneName={"Cancel Invoice"}
                validator={(text) => text.trim().length === 0 ? "Provide a valid Reason" : true}
                onSave={(callback) => {
                    cancelReasonRef.current = callback;
                }}
                value={cancelReason}
                onChangeText={(text) => setCancelReason(text)}
                buttonOneOnPress={async () => {
                    const cancelInvoiceValidation = cancelReasonRef.current();
                    if (cancelInvoiceValidation) {
                        setIsCancelled(true);
                        setCancelInvoiceModalVisibility(false);
                        toastRef.current.show(await cancelInvoiceAPI(cancelReason, bookingId), 2000);

                        setCancelReason("");
                    }
                }}
                buttonOneStyle={{borderColor: Colors.error, borderWidth: 1.5}}
                buttonOneTextStyle={{color: Colors.error}}

            />

            <DropdownModal
                isVisible={optionModalVisibility}
                onCloseModal={() => {
                    setOptionModalVisibility(false)
                }}
                dropdownItems={[
                    "Go to Appointment",
                    "Booking history"
                ]}
                iconImage={[
                    require("../../assets/icons/invoiceIcons/send.png"),
                    require("../../assets/icons/invoiceIcons/mail.png"),
                ]}
                imageHeight={24}
                imageWidth={24}
                primaryViewChildrenStyle={styles.dropdownInnerContainer}

                onChangeValue={(value) => {
                    if (value === "Go to Appointment") {
                    } else if (value === "Booking history") {
                    }
                }}

            />
            {/*<Text style={[textTheme.titleLarge,
styles.heading]}>Invoice</Text>*/}
            <PrimaryButton
                buttonStyle={styles.closeButton}
                onPress={() => {
                    // setCancelInvoiceModalVisibility(true)
                    clearCartAPI();
                    dispatch(clearSalesNotes());
                    dispatch(modifyClientMembershipId({type: "clear"}))
                    dispatch(clearSalesNotes());
                    dispatch(clearLocalCart());
                    dispatch(clearClientInfo());
                    dispatch(clearCalculatedPrice());
                    dispatch(modifyPrepaidDetails({type: "clear"}))
                    props.onCloseModal();
                }
                }
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <ScrollView>

            <View style={styles.modalContent}>
                {
                    isCancelled ?
                        <View style={styles.cancelledContainer}>
                            <Text style={[textTheme.titleMedium, styles.cancelledText]}>
                                CANCELLED
                            </Text>
                        </View> :
                        <></>
                }
                <View style={styles.logoAndButtonContainer}>
                    <Feather name="check-circle" size={50}
                             color={Colors.highlight}/>
                    <Text style={[textTheme.titleMedium]}>Checkout
                        Complete!</Text>
                    <View style={styles.backAndDropdownButtonContainer}>
                        <PrimaryButton
                            buttonStyle={styles.backToCheckoutButton}
                            label={"Back to checkout"}
                            onPress={() => {
                                clearCartAPI();
                                dispatch(modifyClientMembershipId({type: "clear"}))
                                dispatch(clearSalesNotes());
                                dispatch(clearLocalCart());
                                dispatch(clearClientInfo());
                                dispatch(clearCalculatedPrice());
                                dispatch(modifyPrepaidDetails({type: "clear"}))
                                props.onCloseModal();
                            }}
                        />
                        <PrimaryButton
                            onPress={() => setOptionModalVisibility(true)}
                            buttonStyle={styles.backToCheckoutOptionsButton}>
                            <MaterialIcons name="keyboard-arrow-down"
                                           size={24}
                                           color={Colors.background}
                            />
                        </PrimaryButton>
                    </View>
                    {
                        !isCancelled ?
                            <PrimaryButton
                                buttonStyle={styles.actionsButton}
                                textStyle={styles.actionsButtonText}
                                label={"Actions"}
                                onPress={() => {
                                    setActionModalVisibility(true);
                                }}
                            /> :
                            <></>
                    }


                </View>
                <Divider/>
                <View style={styles.invoiceHeadingContainer}>
                    <View style={styles.invoiceHeading}>
                        <Text style={[textTheme.titleMedium,
                            styles.invoiceHeadingText]}>Invoice</Text>
                    </View>
                </View>
                <Divider thickness={0.5} color={Colors.highlight}/>
                <View style={styles.invoice}>
                    <View style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        gap: 3
                    }}>
                        <Text
                            style={textTheme.titleMedium}>{businessName}</Text>
                        <Text
                            style={textTheme.bodyLarge}>{businessAddress}</Text>
                        <Text style={textTheme.bodyLarge}><Text
                            style={textTheme.titleMedium}>Contact
                            : </Text>{businessContact}</Text>
                        <Text style={textTheme.bodyLarge}><Text
                            style={textTheme.titleMedium}>Email
                            : </Text>{businessEmail}</Text>
                        <Text style={textTheme.bodyLarge}><Text
                            //     style={textTheme.titleMedium}>Contact : </Text>
                            // </Text>
                            // <Text style={textTheme.bodyLarge}><Text
                            style={textTheme.titleMedium}>GSTIN : </Text>{selectedBusinessDetails.gstin}
                        </Text>
                    </View>
                    <View style={styles.invoiceNumberAndDateContainer}>
                        <Text style={textTheme.bodyLarge}><Text
                            style={textTheme.titleMedium}>Invoice no :
                        </Text>{invoiceDetails.business_invoice_num}</Text>
                        <Text style={textTheme.bodyLarge}><Text
                            style={textTheme.titleMedium}>Invoice date :
                        </Text>{invoiceDetails.invoice_created_date}</Text>
                    </View>
                    <View style={styles.invoiceDetailsOutlineCard}>
                        <Text style={textTheme.bodyLarge}><Text
                            style={textTheme.titleMedium}>Name
                            : </Text>{selectedClientDetails.name}</Text>
                        <Text style={textTheme.bodyLarge}><Text
                            style={textTheme.titleMedium}>Contact
                            : </Text>{selectedClientDetails.mobile_1}</Text>
                        {
                            checkNullUndefined(selectedClientDetails.username) && selectedClientDetails.username.trim() !== "" ?
                                <Text style={textTheme.bodyLarge}><Text
                                    style={textTheme.titleMedium}>Email
                                    : </Text>{selectedClientDetails.username.trim()}</Text> :
                                <></>
                        }
                        {
                            walletBalance.wallet_balance > 0 ?
                                <Text style={textTheme.bodyLarge}>
                                    <Text style={textTheme.titleMedium}>Prepaid :
                                    </Text> {walletBalance.wallet_balance}</Text> :
                                <></>
                        }
                        {
                            selectedClientDetails.customer_gst !== null && selectedBusinessDetails.customer_gst !== "" && selectedBusinessDetails.customer_gst !== undefined ?
                                <Text style={textTheme.bodyLarge}><Text
                                    style={textTheme.titleMedium}>GSTIN
                                    : </Text>{selectedClientDetails.customer_gst}</Text> :
                                <></>
                        }
                    </View>
                    {
                        checkNullUndefined(details) ?
                            checkNullUndefined(details.organized_list) && checkNullUndefined(details.organized_list.length) &&
                            <Table style={styles.cartItemTable}>
                                <Row
                                    textStyle={textStyle1}
                                    style={styles.cartItemTableHead}
                                    data={["ITEM", "STAFF", "QTY", "AMOUNT"]}
                                />


                                {
                                    checkNullUndefined(details) ?
                                        checkNullUndefined(details.organized_list) && checkNullUndefined(details.organized_list.length) &&

                                        details.organized_list.map((item) => (
                                                checkNullUndefined(item.list) && checkNullUndefined(item.list.length) &&
                                                item.list.map((innerItem, index) => {
                                                    // setTotalDiscount(prev => prev + innerItem.discount_percent);
                                                    return (
                                                        (item.gender === "GENERAL" || item.gender === "GENERAL & KIDS") && innerItem.parent_category_name === "custom_service" ?
                                                            <></> :
                                                            <>

                                                                <Row
                                                                    key={index}
                                                                    data={
                                                                        [
                                                                            innerItem.resource_service,
                                                                            innerItem.resource_name,
                                                                            innerItem.count,
                                                                            (innerItem.service_cost).toFixed(2)

                                                                        ]
                                                                    }
                                                                    style={styles.cartItemTableRow}
                                                                    textStyle={textStyle2}
                                                                />
                                                                {
                                                                    checkNullUndefined(item.gender === "Membership") && item.gender === "Membership" && innerItem.parent_category_name === "membership" ?
                                                                        <View style={styles.durationDetails}>
                                                                            <Text>
                                                                                Duration: {innerItem.duration} days
                                                                            </Text>
                                                                            <Text>
                                                                                Start date: {innerItem.valid_from} | Expiry
                                                                                date: {innerItem.valid_till}
                                                                            </Text>
                                                                        </View> :
                                                                        <></>
                                                                }
                                                                {
                                                                    checkNullUndefined(item.gender === "Packages") && item.gender === "Packages" && innerItem.parent_category_name === "packages" ?
                                                                        <View style={styles.durationDetails}>
                                                                            <Text>
                                                                                Duration: {innerItem.duration} days
                                                                            </Text>
                                                                            <Text>
                                                                                Start date: {innerItem.valid_from} | Expiry
                                                                                date: {innerItem.valid_till}
                                                                            </Text>

                                                                        </View> : <></>

                                                                }

                                                            </>)

                                                })

                                            )
                                        ) : <></>
                                }
                            </Table>
                            : <></>
                    }
                    {
                        invoiceDetails.total_discount_in_price !== 0 ?
                            <View style={styles.calculatepriceRow}>
                                <Text style={[textTheme.bodyLarge,
                                    styles.checkoutDetailText]}>Discount</Text>
                                <Text
                                    style={[textTheme.bodyLarge,
                                        styles.checkoutDetailText]}>₹ {invoiceDetails.total_discount_in_price.toFixed(2)}</Text>
                            </View>
                            : null
                    }
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge,
                            styles.checkoutDetailText]}>Sub Total</Text>
                        <Text
                            style={[textTheme.bodyLarge,
                                styles.checkoutDetailText]}>₹
                            {(details.sub_total_with_discount).toFixed(2)}</Text>
                    </View>
                    <Divider/>
                    {
                        extraCharges ?
                            <View style={styles.calculatepriceRow}>
                                <Text style={[textTheme.bodyLarge,
                                    styles.checkoutDetailText]}>Extra Charges</Text>
                                <Text
                                    style={[textTheme.bodyLarge,
                                        styles.checkoutDetailText]}>₹
                                    {extraCharges}

                                </Text>
                            </View> :
                            <></>
                    }
                    {
                        extraCharges ?
                            <Divider/> :
                            <></>
                    }
                    {
                        calculatedPrice[0].tax_details.map((item, index) => (
                            <View key={index} style={styles.calculatepriceRow}>
                                <Text style={[textTheme.bodyLarge,
                                    styles.checkoutDetailText]}>{item.name} {item.percent}%</Text>
                                <Text style={[textTheme.bodyLarge,
                                    styles.checkoutDetailText]}>₹ {(item.value)}</Text>
                            </View>
                        ))

                    }


                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.titleMedium,
                            styles.checkoutDetailText]}>Total</Text>
                        <Text
                            style={[textTheme.titleMedium,
                                styles.checkoutDetailText]}>₹ {details.total.toFixed(2)}</Text>
                    </View>
                    <View style={styles.paymentModeContainer}>
                        <Text style={[textTheme.titleMedium]}>Payment
                            Mode</Text>
                        <Table style={styles.paymentModeTable}>
                            <Row style={styles.paymentModeTableHead}
                                 data={["Date & Time", "Mode", "Amount", "Status"]}
                                 textStyle={textStyle2}
                            />
                            {
                                checkNullUndefined(invoiceDetails.split_payment) ? invoiceDetails.split_payment.map((item, index) => {
                                        return <Row
                                            key={index}
                                            data={[item.date + " " + item.time,
                                                item.mode_of_payment, (item.amount).toFixed(2), "Paid"]}
                                            style={styles.paymentModeTableRow}
                                            textStyle={textStyle2}
                                        />
                                    })
                                    : <></>
                            }
                        </Table>
                    </View>
                </View>
                <Divider color={Colors.highlight}/>
                {
                    checkNullUndefined(invoiceDetails.footer_message_1) &&
                    invoiceDetails.footer_message_1.trim().length !== 0 ?
                        <View style={styles.termsAndConditions}>
                            <Text
                                style={[textTheme.titleMedium]}>Terms & conditions: </Text>
                            <Text
                                style={[textTheme.bodyMedium]}>{invoiceDetails.footer_message_1}</Text>

                        </View> :
                        <></>
                }
            </View>
            {
                checkNullUndefined(invoiceDetails.footer_message_2) &&
                invoiceDetails.footer_message_2.trim().length !== 0 ?
                    <Text
                        style={[textTheme.titleMedium,
                            styles.thankYouText]}>{invoiceDetails.footer_message_2}</Text> :
                    <></>
            }
            {/*<Toast ref={toastRef} />*/}
        </ScrollView>
        {/*</AlertNotificationRoot>*/}


    </Modal>
}

const styles = StyleSheet.create({
    invoiceModal: {
        flex: 1
    },
    headingAndCloseContainer: {
        marginTop: Platform.OS === "ios" ? 50 : 0,
        paddingVertical: 28,
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
        // position: 'relative'
    },
    logoAndButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        marginVertical: 20,
    },
    backAndDropdownButtonContainer: {
        width: "70%",
        flexDirection: "row"
    },
    backToCheckoutButton: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        flex: 4,

    },
    backToCheckoutOptionsButton: {
        flex: 1,
        marginLeft: 1,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    actionsButton: {
        width: "70%",
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.grey500,
        flex: 1,
        flexDirection: "row"
    },
    actionsButtonText: {
        color: Colors.black
    },
    invoiceHeadingContainer: {
        marginVertical: 15,
        alignItems: "center"
    },
    invoiceHeading: {},
    invoiceHeadingText: {},
    invoice: {
        marginBottom: 20,
    },
    invoiceNumberAndDateContainer: {
        borderWidth: 1,
        borderColor: Colors.grey300,
        // borderRadius:0,
        paddingVertical: 10,
        paddingHorizontal: 15,
        gap: 5,
    },
    invoiceDetailsOutlineCard: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        gap: 5,
        borderColor: Colors.highlight,
        borderWidth: 1,
        borderRadius: 8,
        margin: 20,
    },
    cartItemTable: {
        position: 'relative',
        paddingVertical: 10,
        paddingHorizontal: 15,
        zIndex: 1
    },
    cartItemTableHead: {
        position: 'relative',
        zIndex: 2,
        backgroundColor: "#E7E8FF",
        paddingVertical: 10
    },
    cartItemTableRow: {
        borderBottomColor: Colors.grey300,
        borderBottomWidth: 1,
        paddingVertical: 10,
        zIndex: 1
    },
    calculatepriceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 35,
    },
    paymentModeContainer: {
        marginHorizontal: 15,
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: Colors.grey400,
        borderWidth: 1,
        borderRadius: 8,
    },
    paymentModeTable: {},
    paymentModeTableHead: {
        paddingVertical: 10,
        borderBottomColor: Colors.grey300,
        borderBottomWidth: 1,
    },
    paymentModeTableRow: {
        paddingVertical: 7,
        borderBottomColor: Colors.grey300,
        borderBottomWidth: 1,
    },
    termsAndConditions: {
        gap: 3,
        marginHorizontal: 20,
        marginVertical: 20,
    },
    thankYouText: {
        textAlign: "center",
        marginBottom: 30,
    },
    dropdownInnerContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        // borderWidth: 1,
        width: '100%',
        paddingHorizontal: 32
    },
    cancelledContainer: {
        borderWidth: 1.5,
        borderColor: Colors.error,
        borderRadius: 8,
        position: "absolute",
        width: "100%",
        backgroundColor: Colors.white,
        top: '40%',      // Adjust the placement
        left: '0%',     // Adjust the placement
        transform: [{rotate: '-35deg'}],  // Rotate the stamp diagonally
        // opacity: 0.6,    // Slight transparency
        alignItems: 'center',
        paddingVertical: 8,
        zIndex: 1
    },
    cancelledText: {
        color: Colors.error,
        letterSpacing: 4
    },
    durationDetails: {
        width: "100%",
        backgroundColor: Colors.grey200,
        padding: 12
    }
});

export default InvoiceModal;
