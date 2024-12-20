import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Pressable} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Feather} from "@expo/vector-icons";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import {useDispatch, useSelector} from "react-redux";
import {updateFilters} from "../../store/ExpensesSlice";


const DateRangePicker = (props) => {

    const dispatch = useDispatch();

    const [isStartPickerVisible, setStartPickerVisible] = useState(false);
    const [isEndPickerVisible, setEndPickerVisible] = useState(false);


    // Show/hide the date picker for the start date
    const showStartDatePicker = () => setStartPickerVisible(true);
    const hideStartDatePicker = () => setStartPickerVisible(false);

    // Show/hide the date picker for the end date
    const showEndDatePicker = () => setEndPickerVisible(true);
    const hideEndDatePicker = () => setEndPickerVisible(false);

    const handleConfirmStartDate = (date) => {
        dispatch(updateFilters({
            customRangeStartDate: moment(date).format("YYYY-MM-DD"),
            customRangeEndDate: props.toDate,
            category: props.category,
            range: props.range,
            fromDate: "",
            toDate: ""
        }))
        hideStartDatePicker();
    };

    const handleConfirmEndDate = (date) => {
        dispatch(updateFilters({
            customRangeStartDate: props.fromDate,
            customRangeEndDate: moment(date).format("YYYY-MM-DD"),
            category: props.category,
            range: props.range,
            fromDate: "",
            toDate: ""
        }))
        hideEndDatePicker();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dateRangeContainer}>
                <Pressable style={styles.dateButton} onPress={showStartDatePicker} android_ripple={{color: Colors.ripple}}>
                    <Text style={[textTheme.bodyLarge, {flex: 1, textAlign: 'center'}]}>
                        {props.fromDate !== "" ? moment(props.fromDate).format('ddd, DD MMM YYYY') : 'Select Start Date'}
                    </Text>
                    <Feather name="calendar" size={24} color="grey" style={styles.calenderIcon}/>
                </Pressable>
                {
                    !props.startDateRangeIsValid &&
                    <Text style={{alignSelf: "flex-start", color: Colors.error, marginTop: 4}}>Start date is required</Text>
                }

                <Text style={styles.toText}>TO</Text>


                <Pressable style={styles.dateButton} onPress={showEndDatePicker} android_ripple={{color: Colors.ripple}}>
                    <Text style={[textTheme.bodyLarge, {flex: 1, textAlign: 'center'}]}>
                        {props.toDate !== "" ? moment(props.toDate).format('ddd DD MMM YYYY') : 'Select End Date'}
                    </Text>
                    <Feather name="calendar" size={24} color="grey" style={styles.calenderIcon}/>
                </Pressable>
                {
                    !props.endDateRangeIsValid &&
                    <Text style={{alignSelf: "flex-start", color: Colors.error, marginTop: 4}}>End date is required</Text>
                }
            </View>

            <DateTimePickerModal
                isVisible={isStartPickerVisible}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={hideStartDatePicker}
                // date={props.fromDate === "" ? new Date() : new Date(props.fromDate)}

            />

            <DateTimePickerModal
                isVisible={isEndPickerVisible}
                mode="date"
                onConfirm={handleConfirmEndDate}
                onCancel={hideEndDatePicker}
                // date={props.toDate === "" ? new Date() : new Date(props.toDate)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {

    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateRangeContainer: {
        alignItems: 'center',
        width: "100%",
    },
    dateButton: {
        borderWidth: 1,
        borderColor: Colors.grey500,
        borderRadius: 5,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        overflow: 'hidden'
    },
    toText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 8
    },
    calenderIcon: {
        padding: 6,
        height: '100%',
        borderLeftWidth: 1,
        backgroundColor: Colors.grey300,
        borderLeftColor: Colors.grey500,
        paddingVertical: 10
    }
});

export default DateRangePicker;
