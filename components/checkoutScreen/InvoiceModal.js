import {Modal, Platform, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React from "react";
import Colors from "../../constants/Colors";
import Feather from '@expo/vector-icons/Feather';
import {Row, Rows, Table} from "react-native-table-component";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const InvoiceModal = (props) => {
    const dummyData=[["ITEM","STAFF","QTY","AMOUNT"],["ITEM","STAFF","QTY","AMOUNT"],["ITEM","STAFF","QTY","AMOUNT"],["ITEM","STAFF","QTY","AMOUNT"]];

    return <Modal style={styles.invoiceModal} animationType={"slide"} visible={props.isVisible}>
        <View style={styles.headingAndCloseContainer}>
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
                            <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.background} />
                        </PrimaryButton>
                    </View>
                    <PrimaryButton buttonStyle={styles.actionsButton} textStyle={styles.actionsButtonText} label={"Actions"}/>
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
                        <Text style={textTheme.titleMedium}>Naturals Unisex Salon and Spa</Text>
                        <Text style={textTheme.bodyLarge}>No: 20 TVH cross lane Lakshmi</Text>
                        <Text style={textTheme.bodyLarge}>Chennai 600119, Tamilnadu</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Contact : </Text>1029384756</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Email : </Text>allan.david@gmail.com</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Contact : </Text>GT1234567896521</Text>
                    </View>
                    <View style={styles.invoiceNumberAndDateContainer}>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Invoice no : </Text>VINV00123/2024</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Invoice date : </Text>01
                            Aug,
                            2023</Text>
                    </View>
                    <View style={styles.invoiceDetailsOutlineCard}>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Name : </Text>allan.david@gmail.com</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Contact : </Text>GT1234567896521</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Email : </Text>allan.david@gmail.com</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>Prepaid : </Text>GT1234567896521</Text>
                        <Text style={textTheme.bodyLarge}><Text style={textTheme.titleMedium}>GSTIN : </Text>allan.david@gmail.com</Text>
                    </View>
                    <Table style={styles.cartItemTable}>
                        <Row textStyle={{textAlign:"center", fontWeight:"bold"}} style={styles.cartItemTableHead} data={["ITEM","STAFF","QTY","AMOUNT"]} />
                        {dummyData.map((item, index) => <Row key={index.toString()} data={item} style={styles.cartItemTableRow} textStyle={{textAlign:"center"}} />)}
                    </Table>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>Discount</Text>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {"9000"}</Text>
                    </View>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>Sub Total</Text>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {"9000"}</Text>
                    </View>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>CGST (9%)</Text>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {"9000"}</Text>
                    </View>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>SGST (9%)</Text>
                        <Text style={[textTheme.bodyLarge, styles.checkoutDetailText]}>₹ {"9000"}</Text>
                    </View>
                    <Divider/>
                    <View style={styles.calculatepriceRow}>
                        <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>Total</Text>
                        <Text style={[textTheme.titleMedium, styles.checkoutDetailText]}>₹ {"1300.00"}</Text>
                    </View>
                    <View style={styles.paymentModeContainer}>
                        <Text style={[textTheme.titleMedium]}>Payment Mode</Text>
                        <Table style={styles.paymentModeTable}>
                            <Row textStyle={{}} style={styles.paymentModeTableHead} data={["Date & Time","Mode","Amount","Status"]} />
                            {dummyData.map((item, index) => <Row key={index} data={item} style={styles.paymentModeTableRow} textStyle={{}} />)}
                        </Table>
                    </View>
                </View>
                <Divider color={Colors.highlight}/>
                <View style={styles.termsAndConditions}>
                    <Text style={[textTheme.titleMedium]}>Terms & conditions: </Text>
                    <Text style={[textTheme.bodyMedium]}>1. you have only salon services available</Text>
                    <Text style={[textTheme.bodyMedium]}>2. you have only salon services available</Text>
                    <Text style={[textTheme.bodyMedium]}>3. you have only salon services available</Text>
                    <Text style={[textTheme.bodyMedium]}>4. you have only salon services available</Text>
                </View>
            </View>
            <Text style={[textTheme.titleMedium, styles.thankYouText]}>Thank you! Visit again</Text>
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
        width:"70%",
        flexDirection: "row"
    },
    backToCheckoutButton:{
        borderTopRightRadius:0,
        borderBottomRightRadius:0,
        flex:4,
    },
    backToCheckoutOptionsButton:{
        flex:1,
        marginLeft:1,
        borderTopLeftRadius:0,
        borderBottomLeftRadius:0,
    },
    actionsButton:{
        width:"70%",
        backgroundColor:Colors.background,
        borderWidth:1,
        borderColor:Colors.grey500,
        flex:1,
        flexDirection:"row"
    },
    actionsButtonText:{
        color: Colors.black
    },
    invoiceHeadingContainer: {
        marginVertical: 15,
        alignItems: "center"
    },
    invoiceHeading: {},
    invoiceHeadingText: {},
    invoice: {
        marginBottom:20,
    },
    invoiceNumberAndDateContainer: {
        borderWidth: 1,
        borderColor: Colors.grey300,
        // borderRadius:0,
        paddingVertical: 10,
        paddingHorizontal: 15,
        gap: 5,
    },
    invoiceDetailsOutlineCard:{
        paddingVertical: 10,
        paddingHorizontal: 15,
        gap:5,
        borderColor:Colors.highlight,
        borderWidth:1,
        borderRadius:8,
        margin:20,
    },
    cartItemTable:{
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    cartItemTableHead:{
        backgroundColor:"#E7E8FF",
        paddingVertical:10
    },
    cartItemTableRow:{
        borderBottomColor:Colors.grey300,
        borderBottomWidth:1,
        paddingVertical:10,
    },
    calculatepriceRow:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingVertical: 5,
        paddingHorizontal: 35,
    },
    paymentModeContainer:{
        marginHorizontal:15,
        marginTop:20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor:Colors.grey400,
        borderWidth:1,
        borderRadius:8,
    },
    paymentModeTable:{

    },
    paymentModeTableHead:{
        paddingVertical:10,
        borderBottomColor:Colors.grey300,
        borderBottomWidth:1,
    },
    paymentModeTableRow:{
        paddingVertical:7,
        borderBottomColor:Colors.grey300,
        borderBottomWidth:1,
    },
    termsAndConditions:{
        gap:3,
        marginHorizontal:20,
        marginVertical:20,
    },
    thankYouText:{
        textAlign:"center",
        marginBottom:30,
    }
});

export default InvoiceModal;