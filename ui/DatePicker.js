import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from '../constants/Colors';
import { formatDateYYYYMMDDD } from '../util/Helpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const DatePicker = (props) => {

    const [fromDateVisibility, setFromDateVisibility] = useState(false);
    const [customFromDateData, setCustomFromDateData] = useState(new Date());
    const [toDateVisibility, setToDateVisibility] = useState(false);
    const [customToDateData, setCustomToDateData] = useState(new Date());
    
    useEffect(()=>{
        if(props.isCustomRange){
            setCustomFromDateData(new Date());
            setCustomToDateData(new Date());
        }
    },[props.isCustomRange])
    
    return (
        <View style={props.isCustomRange ? styles.customRangeDateContainer : styles.dateContainer}>
            <Dropdown
                style={props.isCustomRange ? styles.customDropdown : styles.dropdown}
                data={props.dateData}
                labelField="label"
                valueField="value"
                value={props.selectedValue}
                onChange={props.handleSelection}
                // placeholder="Today"
                disable={props.isLoading}
            />
            <DateTimePickerModal
                onConfirm={(date) => {
                    setFromDateVisibility(false);
                    setCustomFromDateData(date)
                    props.handleCustomDateConfirm(1,date)
                }}
                isVisible={fromDateVisibility}
                mode="date"
                date={customFromDateData}
                maximumDate={customToDateData}
                themeVariant="light"
                onCancel={() => setFromDateVisibility(false)}
            />
            <DateTimePickerModal
                onConfirm={(date) => {
                    setToDateVisibility(false);
                    setCustomToDateData(date)
                    props.handleCustomDateConfirm(2, date)
                }}
                minimumDate={customFromDateData}
                isVisible={toDateVisibility}
                mode="date"
                date={customToDateData}
                maximumDate={new Date()}
                themeVariant="light"
                onCancel={() => setToDateVisibility(false)}
            />
            <View style={props.isCustomRange ? styles.customDateBox : styles.dateBox}>
                {props.isCustomRange ? (
                    <View style={styles.customDateContainer}>
                        <Pressable
                            style={styles.datePressable}
                            android_ripple={{ color: Colors.ripple }}
                            onPress={() => setFromDateVisibility(true)}
                        >
                            <Text
                                style={{
                                    fontFamily: "Inter-Bold",
                                    fontSize: 12,
                                    fontWeight: "500",
                                    letterSpacing: 0.1,
                                    lineHeight: 20,
                                }}
                            >
                                {props.selectedFromCustomDate}
                            </Text>
                            <MaterialCommunityIcons
                                name="calendar-month-outline"
                                size={18}
                                color={Colors.darkBlue}
                            />
                        </Pressable>
                        <Text style={{ alignSelf: 'center' }}> TO </Text>
                        <Pressable
                            style={styles.datePressable}
                            android_ripple={{ color: Colors.ripple }}
                            onPress={() => setToDateVisibility(true)}
                        >
                            <Text
                                style={{
                                    fontFamily: "Inter-Bold",
                                    fontSize: 12,
                                    fontWeight: "500",
                                    letterSpacing: 0.1,
                                    lineHeight: 20,
                                }}
                            >
                                {props.selectedToCustomDate}
                            </Text>
                            <MaterialCommunityIcons
                                name="calendar-month-outline"
                                size={18}
                                color={Colors.darkBlue}
                            />
                        </Pressable>
                    </View>
                ) : (
                    <Text style={styles.dateText}>{props.date}</Text>
                )}
            </View>
        </View>
    )
}

export default React.memo(DatePicker)

const styles = StyleSheet.create({
    customRangeDateContainer: {
        // flexDirection: "row",
        // columnGap: 5,
        rowGap: 15,
    },
    dateContainer: {
        flexDirection: "row",
        columnGap: 5,
        marginBottom: 20,
    },
    dropdown: {
        width: "45%",
        backgroundColor: Colors.grey150,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.grey250,
        paddingHorizontal: 10,
    },
    customDropdown: {
        // width: "35%",
        backgroundColor: Colors.grey150,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.grey250,
        paddingHorizontal: 20,
        height: 45,
    },
    dateBox: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.grey250,
        backgroundColor: Colors.grey150,
        width: "55%",
        height: 45,
        alignItems: "center",
        justifyContent: "center",
    },
    customDateBox: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.grey250,
        backgroundColor: Colors.grey150,
        // width: "65%",
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        marginBottom: 15
    },
    customDateContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 10,
    },
    datePressable: {
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 10,
    },
})