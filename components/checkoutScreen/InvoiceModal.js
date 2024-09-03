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
import {checkNullUndefined, dateFormatter} from "../../util/Helpers";
import {useEffect, useState} from "react";
import {loadWalletPriceFromDb} from "../../store/invoiceSlice";
import DropdownModal from "../../ui/DropdownModal";

const InvoiceModal = (props) => {

    const details = useSelector(state => state.invoice.details);

    const dispatch = useDispatch();

    const [actionModalVisibility, setActionModalVisibility] = useState(false);
    const [optionModalVisibility, setOptionModalVisibility] = useState(false);


    const actualData = details.organized_list;

    let totalDiscount = 0;

    let centralGST = (details.total * 0.09);
    let stateGST = (details.total * 0.09);

    const splitPayment = details.split_payment;

    const selectedBusinessDetails = useSelector(state => state.businesses.selectedBusiness);

    const businessName = selectedBusinessDetails.name;
    const businessContact = selectedBusinessDetails.mobile_1;
    const businessAddress = selectedBusinessDetails.address;
    const businessEmail = selectedBusinessDetails.email;
    const GSTIn = selectedBusinessDetails.gstin;

    const selectedClientDetails = useSelector(state => state.clientInfo.details);

    useEffect(() => {
        dispatch(loadWalletPriceFromDb(selectedClientDetails.id))
    }, []);



    return <Modal style={styles.invoiceModal} animationType={"slide"} visible={props.isVisible}>
        <View style={styles.headingAndCloseContainer}>
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


            />
            {/*<Text style={[textTheme.titleLarge, styles.heading]}>Invoice</Text>*/}
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
                <View style={styles.logoAndButtonContainer}>
                    <Feather name="check-circle" size={50} color={Colors.highlight}/>
                    <Text style={[textTheme.titleMedium]}>Checkout Complete!</Text>
                    <View style={styles.backAndDropdownButtonContainer}>
                        <PrimaryButton buttonStyle={styles.backToCheckoutButton} label={"Back to checkout"}/>
                        <PrimaryButton buttonStyle={styles.backToCheckoutOptionsButton}>
                            <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.background}/>
                        </PrimaryButton>
                    </View>

                    <PrimaryButton
                        buttonStyle={styles.actionsButton}
                        textStyle={styles.actionsButtonText}
                        label={"Actions"}
                        onPress={() => {
                            setActionModalVisibility(true);
                        }}
                    />

                </View>
                <Divider/>
                <View style={styles.invoiceHeadingContainer}>
                    <View style={styles.invoiceHeading}>
                        <Text style={[textTheme.titleMedium, styles.invoiceHeadingText]}>Invoice</Text>
                    </View>
                </View>
                <Divider thickness={0.5} color={Colors.highlight}/>
                <View style={styles.invoice}>
                    <View style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        gap: 3
                    }}>
                        <Text style={textTheme.titleMedium}>{businessName}</Text>
                        <Text style={textTheme.bodyLarge}>{businessAddress}</Text>
                        {/*<Text style={textTheme.bodyLarge}>Chennai 600119, Tamilnadu</Text>*/}
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Contact
                            : </Text>{businessContact}</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Email
                            : </Text>{businessEmail}</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Contact : </Text></Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>GSTIN : </Text>{GSTIn}
                        </Text>
                    </View>
                    <View style={styles.invoiceNumberAndDateContainer}>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Invoice no : </Text>{details.business_invoice_num}</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Invoice date : </Text>{details.invoice_created_date}</Text>
                    </View>
                    <View style={styles.invoiceDetailsOutlineCard}>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Name
                            : </Text>{selectedClientDetails.name}</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Contact
                            : </Text>{selectedClientDetails.mobile_1}</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Email
                            : </Text>{selectedClientDetails.username}</Text>
                                <Text style={textTheme.bodyLarge}>
                                    <Text style={textTheme.titleMedium}>Prepaid : </Text>{details.wallet_balance}</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>GSTIN
                            : </Text>{selectedClientDetails.customer_gst}</Text>
                    </View>
                    <Table style={styles.cartItemTable}>
                        <Row
                            textStyle={StyleSheet.flatten({textAlign: "center", fontWeight: "bold"})}
                            style={styles.cartItemTableHead}
                            data={["ITEM", "STAFF", "QTY", "AMOUNT"]}
                        />


                        {actualData && actualData.length > 0 && actualData.map((item) => (
                            item.list && item.list.length > 0 && item.list.map((innerItem, index) => {
                                totalDiscount += (innerItem.service_cost * innerItem.discount_percent) / 100;
                                return <Row
                                    key={index}
                                    data={[innerItem.resource_service, innerItem.resource_name, innerItem.count, (innerItem.service_cost).toFixed(2)]}
                                    style={styles.cartItemTableRow}
                                    textStyle={StyleSheet.flatten({textAlign: "center"})}
                                />

                            })
                        ))}

                    </Table>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>Discount</Text>
                        <Text
                            style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {(totalDiscount).toFixed(2)}</Text>
                    </View>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>Sub Total</Text>
                        <Text
                            style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {(details.sub_total_with_discount).toFixed(2)}</Text>
                    </View>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>CGST (9%)</Text>
                        <Text
                            style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {(centralGST).toFixed(2)}</Text>
                    </View>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>SGST (9%)</Text>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {(stateGST).toFixed(2)}</Text>
                    </View>
                    <Divider/>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Total</Text>
                        <Text
                            style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {(details.total + centralGST + stateGST).toFixed(2)}</Text>
                    </View>
                    <View style={styles.paymentModeContainer}>
                        <Text style={[textTheme.titleMedium]}>Payment Mode</Text>
                        <Table style={styles.paymentModeTable}>
                            <Row style={styles.paymentModeTableHead} data={["Date & Time", "Mode", "Amount", "Status"]}
                                 textStyle={{textAlign: "center"}}/>
                            {
                                splitPayment.map((item, index) => (
                                    <Row
                                        data={[dateFormatter(item.date, 'short') + " " + item.time, item.mode_of_payment, (item.amount).toFixed(2), "Paid"]}
                                        style={styles.paymentModeTableRow}
                                        textStyle={{textAlign: "center"}}
                                    />
                                ))
                            }
                        </Table>
                    </View>
                </View>
                <Divider color={Colors.highlight}/>
                {
                    checkNullUndefined(details.footer_message_1) && details.footer_message_1.trim().length !== 0 ?
                        <View style={styles.termsAndConditions}>
                            <Text style={[textTheme.titleMedium]}>Terms & conditions: </Text>
                            <Text style={[textTheme.bodyMedium]}>{details.footer_message_1}</Text>

                        </View> :
                        null
                }
            </View>
            {
                checkNullUndefined(details.footer_message_2) && details.footer_message_2.trim().length !== 0 ?
                    <Text
                        style={[textTheme.titleMedium, styles.thankYouText]}>{details.footer_message_2}</Text> :
                    null
            }
        </ScrollView>
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
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    cartItemTableHead: {
        backgroundColor: "#E7E8FF",
        paddingVertical: 10
    },
    cartItemTableRow: {
        borderBottomColor: Colors.grey300,
        borderBottomWidth: 1,
        paddingVertical: 10,
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
    }
});

export default InvoiceModal;