import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomSwiper from "../common/CustomSwiper";
import DatePickerForwardBackward from "../../ui/DatePickerForwardBackward"; // Path to your CustomSwiper component


const Sample = () => {
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())


    return (
        <View style={styles.screen}>
            <Text>drgfs</Text>
            <DatePickerForwardBackward
                label={"date picker"}
                type={"Today"}
                fromDate={fromDate}
                toDate={toDate}
                setFromDateToDate={(fromDate, toDate) => {
                    console.log(fromDate, toDate)
                    setFromDate(fromDate)
                    setToDate(toDate)
                }}


            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: '#f0f0f0',
        width: '100%',
        borderWidth: 1
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Sample;
