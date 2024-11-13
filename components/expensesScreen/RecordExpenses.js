import { Modal, Text, View, StyleSheet, ScrollView } from "react-native";
import { shadowStyling } from "../../util/Helpers";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import addExpensesAPI from "../../util/apis/addExpensesAPI";
import {useDispatch, useSelector} from "react-redux";
import {getExpenseSubCategoryId, loadExpensesFromDb} from "../../store/ExpensesSlice";
import moment from "moment";
import editExpensesAPI from "../../util/apis/editExpensesAPI";

export default function RecordExpenses(props) {
    const dispatch = useDispatch();

    const currentExpense = useSelector(state => state.expenses.currentExpense);
    const currentExpenseId = useSelector(state => state.expenses.currentExpensesId);

    const [expenseData, setExpenseData] = useState({
        expenseDate: props.type === "add" ? null : moment(currentExpense.date).toDate(),
        expenseAmountType: props.type === "add" ? "" : currentExpense.expense_category,
        expenseType: props.type === "add" ? "" : currentExpense.expense_sub_category,
        amount: props.type === "add" ? "" : currentExpense.amount+"",
        paymentMode: props.type === "add" ? "" : currentExpense.payment_mode,
        reference: props.type === "add" ? "" : currentExpense.reference,
        notes: props.type === "add" ? "" : currentExpense.notes,
    });

    const id = useSelector(state => state.expenses.id);
    const subId = useSelector(state => state.expenses.subId);



    const updateExpenseData = (field, value) => {
        setExpenseData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };


    return (
        <Modal
            visible={props.isVisible}
            animationType={"slide"}
            style={styles.modal}
        >
            <View style={styles.recordExpense}>
                <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
                    <Text style={[textTheme.titleLarge, styles.selectClientText]}>
                        {props.type === "add" ? "Record Expenses" : "Update Expenses"}
                    </Text>
                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={() => {
                            props.closeModal();
                        }}
                    >
                        <Ionicons name="close" size={25} color="black" />
                    </PrimaryButton>
                </View>
                <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
                    <CustomTextInput
                        labelTextStyle={textTheme.titleSmall}
                        label={"Date"}
                        type={"date"}
                        value={expenseData.expenseDate ? new Date(expenseData.expenseDate) : null}
                        onChangeValue={(date) => updateExpenseData("expenseDate", date)}
                        maximumDate={new Date()}
                    />
                    <CustomTextInput
                        label={"Expense Amount"}
                        labelTextStyle={textTheme.titleSmall}
                        type={"dropdown"}
                        dropdownItems={["daily"]}
                        value={expenseData.expenseAmountType}
                        onChangeValue={(value) => updateExpenseData("expenseAmountType", value)}
                    />
                    <CustomTextInput
                        label={"Expense Type"}
                        labelTextStyle={textTheme.titleSmall}
                        type={"dropdown"}
                        dropdownItems={["default"]}
                        value={expenseData.expenseType}
                        onChangeValue={(value) => updateExpenseData("expenseType", value)}
                    />
                    <CustomTextInput
                        label={"Amount"}
                        labelTextStyle={textTheme.titleSmall}
                        type={"price"}
                        value={expenseData.amount}
                        onChangeText={(value) => updateExpenseData("amount", value)}
                        placeholder={"0.00"}
                    />
                    <CustomTextInput
                        label={"Payment Mode"}
                        labelTextStyle={textTheme.titleSmall}
                        type={"dropdown"}
                        dropdownItems={["Cash", "Card", "Digital Payment"]}
                        value={
                        expenseData.paymentMode === "CASH" ?
                            "Cash" : expenseData.paymentMode === "CARD" ?
                            "Card" : "Digital Payment"}
                        onChangeValue={(value) => updateExpenseData("paymentMode", value)}
                    />
                    <CustomTextInput
                        label={"Reference"}
                        labelTextStyle={textTheme.titleSmall}
                        type={"text"}
                        placeholder={"Reference"}
                        value={expenseData.reference}
                        onChangeText={(value) => updateExpenseData("reference", value)}
                    />
                    <CustomTextInput
                        label={"Notes"}
                        labelTextStyle={textTheme.titleSmall}
                        type={"multiLine"}
                        placeholder={"Notes"}
                        value={expenseData.notes}
                        onChangeText={(value) => updateExpenseData("notes", value)}
                    />
                </ScrollView>
                <View style={[styles.bottomButtonContainer, { gap: props.type === "add" ? undefined : 8 }]}>
                    {props.type === "add" ? null : (
                        <PrimaryButton buttonStyle={styles.deleteIcon} onPress={props.onDelete}>
                            <AntDesign name="delete" size={24} color="black" />
                        </PrimaryButton>
                    )}
                    <PrimaryButton
                        label={props.type === "add" ? "Save Expense" : "Update Expense"}
                        buttonStyle={styles.saveButton}
                        pressableStyle={styles.saveButtonPressable}
                        onPress={async () => {
                            if(props.type === "add") {
                                const res = await addExpensesAPI(expenseData, id, subId);
                                if(res) {
                                    dispatch(loadExpensesFromDb());
                                    props.closeModal()
                                }
                            }
                            else {
                                const res = await editExpensesAPI(expenseData, id, subId, currentExpenseId);
                                if(res) {
                                    dispatch(loadExpensesFromDb());
                                    props.closeModal()
                                }
                            }
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: { flex: 1 },
    recordExpense: {
        alignItems: "center",
        flex: 1,
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
    },
    saveButton: { flex: 1 },
    saveButtonPressable: {},
    bottomButtonContainer: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 0.6,
        borderColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row'
    },
    deleteIcon: {
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.grey250
    }
});
