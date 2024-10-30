import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { Row, Table } from "react-native-table-component";
import Colors from "../../constants/Colors";
import React, {useEffect} from "react";
import { shadowStyling } from "../../util/Helpers";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function PrepaidDetailModal(props) {
    const prepaidDetails = useSelector(state => state.clientInfo.prepaidDetails);
    const details = useSelector(state => state.clientInfo.details);

    if (prepaidDetails === undefined) {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={textTheme.titleMedium}>No prepaid history</Text>
            </View>
        );
    }

    const tableHead = [
        "Date & Time", "Transaction type", "Amount paid", "Bonus value",
        "Prepaid Balance", "Payment method", "Prepaid source", "Description", "Invoice",
    ];

    let tableData = prepaidDetails.map(detail => [
        detail["date-time"],
        detail.transactionType,
        detail.amount_paid.toString(),
        detail.bonus_value === null ? "" :
            detail.bonus_value.toString(),
        detail.wallet_balance.toString(),
        detail.paymentMode,
        detail.source,
        detail.description,
        detail.business_invoice_no
    ]);

    useEffect(() => {
        tableData = prepaidDetails.map(detail => [
            detail["date-time"],
            detail.transactionType,
            detail.amount_paid.toString(),
            detail.bonus_value === null ? "" :
            detail.bonus_value.toString(),
            detail.wallet_balance.toString(),
            detail.paymentMode,
            detail.source,
            detail.description,
            detail.business_invoice_no
        ]);

    }, []);



    const calculateColumnWidths = () => {
        return tableHead.map((header, index) => {
            const headerWidth = header.length * 10;
            const maxDataWidth = tableData.reduce((maxWidth, row) => {
                const cellContent = row[index] || '';
                return Math.max(maxWidth, cellContent.length * 10);
            }, 0);
            return Math.max(headerWidth, maxDataWidth);
        });
    };

    const widthArr = calculateColumnWidths();

    return (
        <Modal style={{ flex: 1 }}
               visible={props.isVisible}
               animationType={"slide"}>
            <View style={styles.PrepaidDetail}>
                <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
                    <Text style={[textTheme.titleLarge, styles.selectClientText]}>Prepaid History</Text>
                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={props.closeModal}>
                        <Ionicons name="close" size={25} color="black" />
                    </PrimaryButton>
                </View>
                <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                    <Text style={[textTheme.titleLarge]}>Prepaid Balance</Text>
                    <Text style={[textTheme.titleLarge]}>₹{details.wallet_balance}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flex: 1}}>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
                        <Row
                            data={tableHead}
                            style={styles.head}
                            textStyle={styles.text}
                            widthArr={widthArr}
                        />
                        {tableData.map((rowData, rowIndex) => (
                            <Row
                                key={rowIndex}
                                data={rowData.map((cell, cellIndex) => {
                                    // Determine the text color based on conditions
                                    let textColor = 'black'; // Default color

                                    if (cellIndex === 1) { // Transaction type
                                        textColor = cell === 'Credit' ? 'green' : 'red';
                                    } else if (cellIndex === 8) { // Invoice number
                                        textColor = Colors.highlight;
                                    }

                                    return (
                                        <Text style={[styles.text, { color: textColor }]}>
                                            {cell}
                                        </Text>
                                    );
                                })}
                                widthArr={widthArr}
                                style={{
                                    borderColor: '#c8e1ff',
                                    borderBottomWidth: 1,
                                }}
                            />
                        ))}
                    </Table>
                </ScrollView>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    PrepaidDetail: {
        flex: 1,
        alignItems: 'center',
    },
    head: {
        backgroundColor: Colors.grey100,
        borderColor: Colors.grey250,
    },
    text: {
        margin: 6,
        textAlign: 'center',
    },
    closeAndHeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    selectClientText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    }
});
