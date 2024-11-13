// DatePickerForwardBackward.js
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import PrimaryButton from "./PrimaryButton";
import Colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import { updateFilters } from "../store/ExpensesSlice";

const format = 'ddd DD MMM YYYY';

function formatDateRange(view, fromDate, toDate = fromDate) {
    let startDate, endDate, format = 'ddd DD MMM YYYY';
    switch (view) {
        case 'Month':
            startDate = moment(fromDate).startOf('month');
            endDate = moment(toDate).endOf('month');
            break;
        case 'Week':
            startDate = moment(fromDate).startOf('week');
            endDate = moment(toDate).endOf('week');
            break;
        case 'Year':
            startDate = moment(fromDate).startOf('year');
            endDate = moment(toDate).endOf('year');
            break;
        default:
            return moment(fromDate).format(format);
    }
    return `${startDate.format(format)} - ${endDate.format(format)}`;
}

export default function DatePickerForwardBackward({ label, type, fromDate, toDate, category, range }) {
    const dispatch = useDispatch();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [forwardVisibility, setForwardVisibility] = useState(false);
    const [backwardVisibility, setBackwardVisibility] = useState(true);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    useEffect(() => {
        if(type === "Today") {

        }
        else {
            dispatch(updateFilters({
                category,
                range,
                fromDate: moment(formatDateRange(type, fromDate, toDate).split(" - ")[0].trim()).format("YYYY-MM-DD"),
                toDate: moment(formatDateRange(type, fromDate, toDate).split(" - ")[1].trim()).format("YYYY-MM-DD"),
            }))
        }
    }, [type]);

    useEffect(() => {
        if(range === "Today") {
            if(moment(fromDate).isSame(moment(), 'day')) {
                setForwardVisibility(false);
            }
            else {
                setForwardVisibility(true);
            }
        }
        else {
            if(moment(toDate).toDate() >= moment().toDate()) {
                setForwardVisibility(false)
            }
            else {
                setForwardVisibility(true)
            }

        }
    }, [toDate, type, fromDate]);


    const handleConfirm = (date) => {
        dispatch(updateFilters({
            fromDate: moment(date).format("YYYY-MM-DD"),
            toDate: moment(date).format("YYYY-MM-DD"),
            category,
            range
        }));
        hideDatePicker();
    };

    const changeDate = (increment = true) => {
        const newDate = moment(fromDate)[increment ? 'add' : 'subtract'](1, "days").format("YYYY-MM-DD");

        dispatch(updateFilters({ fromDate: newDate, toDate: newDate, category, range }));
    };

    return (
        <View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={new Date(fromDate)}
                maximumDate={new Date()}
            />
            <Text style={textTheme.titleSmall}>{label}</Text>
            <View style={styles.datePicker}>
                <PrimaryButton buttonStyle={styles.backButton} onPress={() => {
                    if(range === "Today") {
                        changeDate(false);
                    }
                    else {
                        dispatch(updateFilters({
                            range,
                            category,
                            fromDate: moment(new Date(fromDate)).subtract(1, type.toLowerCase()).format("YYYY-MM-DD"),
                            toDate: moment(new Date(toDate)).subtract(1, type.toLowerCase()).format("YYYY-MM-DD"),
                        }));

                    }
                }}>
                    <MaterialIcons name="keyboard-arrow-left" size={24} color={backwardVisibility ? "black" : 'grey'} />
                </PrimaryButton>
                <Pressable onPress={showDatePicker} style={styles.datePickerButton} android_ripple={{ color: Colors.ripple }}>
                    <Text style={textTheme.bodyMedium}>
                        {type === "Today" ? moment(fromDate).format('ddd, DD MMM YYYY') : formatDateRange(type, fromDate, toDate)}
                    </Text>
                </Pressable>
                <PrimaryButton buttonStyle={styles.forwardButton} onPress={() => {
                    if(range === "Today") {
                        if(forwardVisibility) {
                            changeDate();
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        if(moment(toDate).toDate() > moment().toDate()) {
                            return ;
                        }
                        dispatch(updateFilters({
                            range,
                            category,
                            fromDate: moment(new Date(fromDate)).add(1, type.toLowerCase()).format("YYYY-MM-DD"),
                            toDate: moment(new Date(toDate)).add(1, type.toLowerCase()).format("YYYY-MM-DD"),
                        }));
                    }
                }}>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color={!forwardVisibility ? "grey" : "black"} />
                </PrimaryButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    datePicker: {
        borderWidth: 1,
        borderColor: Colors.grey500,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 6,
        overflow: 'hidden',
        marginTop: 4
    },
    backButton: {
        backgroundColor: Colors.white,
        borderRightWidth: 1,
        borderRightColor: Colors.grey500,
        borderRadius: 0
    },
    forwardButton: {
        backgroundColor: Colors.white,
        borderLeftWidth: 1,
        borderLeftColor: Colors.grey500,
        borderRadius: 0
    },
    datePickerButton: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: 10
    }
});
