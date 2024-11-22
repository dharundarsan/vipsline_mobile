import { Modal, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import DatePickerForwardBackward from "../../ui/DatePickerForwardBackward";
import DateRangePicker from "./DateRangePicker";
import {loadExpensesFromDb, updateCurrentCategoryId, updateFilters, updateOldCopy} from "../../store/ExpensesSlice";
import {Ionicons} from "@expo/vector-icons";
import textTheme from "../../constants/TextTheme";

export default function ExpenseFilters({ isVisible, onClose }) {
    const dispatch = useDispatch();

    const { category, range, fromDate, toDate, oldCopy } = useSelector(state => state.expenses);

    const categories = useSelector(state => state.expenses.categories);
    console.log((categories.find(item => item.name === category)?.id))

    useEffect(() => {
        dispatch(updateOldCopy({ fromDate, toDate, category, range }));
    }, []);

    const handleApply = async () => {
        dispatch(updateFilters({ fromDate, toDate, category, range }));
        dispatch(updateCurrentCategoryId(category === "All expenses" ? -1 : categories.find(item => item.name === category).id))
        await dispatch(loadExpensesFromDb());
        onClose();
    };

    return (
        <Modal style={{ flex: 1 }} visible={isVisible} animationType="slide" presentationStyle={"formSheet"} onRequestClose={onClose}>
            <View style={styles.advancedFilters}>
                <View style={styles.header}>
                    <Text style={[styles.headerText, textTheme.titleLarge]}>Filters</Text>
                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        onPress={() => {
                            onClose();
                            dispatch(updateFilters(oldCopy));
                        }}
                    >
                        <Ionicons name="close" size={25} color="black" />
                    </PrimaryButton>
                </View>
                <View style={styles.body}>
                    <CustomTextInput
                        label="Category"
                        type="dropdown"
                        dropdownItems={["All expenses"].concat(( categories.map(item => item.name)))}
                        onChangeValue={(value) => dispatch(updateFilters({ category: value, range, fromDate, toDate }))}
                        value={category}
                    />
                    <CustomTextInput
                        label="Select Range"
                        type="dropdown"
                        dropdownItems={["Today", "Week", "Month", "Year", "Custom range"]}
                        onChangeValue={(value) => dispatch(updateFilters({ range: value, category, fromDate, toDate }))}
                        value={range}
                    />
                    {range === "Custom range" ? (
                        <DateRangePicker category={category} range={range} fromDate={fromDate} toDate={toDate} />
                    ) : (
                        <DatePickerForwardBackward
                            label="Date"
                            type={range}
                            fromDate={fromDate}
                            toDate={toDate}
                            category={category}
                            range={range}
                        />
                    )}
                </View>
            </View>
            <View style={styles.bottomButtonContainer}>
                <PrimaryButton
                    label="Clear filters"
                    buttonStyle={styles.clearButton}
                    textStyle={[textTheme.titleMedium, {color: Colors.highlight}]}
                    onPress={() => dispatch(updateFilters({ fromDate: moment().format("YYYY-MM-DD"), toDate: moment().format("YYYY-MM-DD"), category: "All expenses", range: "Today" }))}
                />
                <PrimaryButton label="Apply" buttonStyle={styles.applyButton} onPress={handleApply} />
            </View>
        </Modal>
    );
}




const styles = StyleSheet.create({
    advancedFilters: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        width: '100%',
        backgroundColor: Colors.grey150,
        justifyContent: 'center'

    },
    body: {
        marginTop: 32,
        paddingHorizontal: 16
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.grey150,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    headerText: {
        paddingVertical: 12
    },
    advancedFiltersText: {
        marginLeft: 16
    },
    dropdownContainer: {
        paddingHorizontal: 16,
        marginTop: 8
    },
    lastVisitedText: {
        marginTop: 16,
        marginLeft: 16
    },
    dateInputContainer: {
        marginHorizontal: 12
    },
    filterDateContainer: {
        borderWidth: 1,
        marginHorizontal: 16,
        borderColor: Colors.grey250,
        marginTop: 8,
        paddingVertical: 24,
        borderRadius: 4
    },
    bottomButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 32,
        paddingVertical: 20,
        paddingHorizontal: 16,
        width: "100%",
        borderTopWidth: 1
    },
    clearButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
        flex: 1
    },
    applyButton: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        flex: 1
    },
    applyText: {
        color: Colors.white
    },
    clearFilterText: {
        color: Colors.black
    },

})