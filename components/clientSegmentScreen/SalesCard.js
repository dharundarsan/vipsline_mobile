import {View, Text, StyleSheet} from 'react-native';
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import Divider from "../../ui/Divider";
import {capitalize} from "@reduxjs/toolkit/src/query/utils";
import {capitalizeFirstLetter, convertTo12HourFormatWithSeconds, dateFormatter, formatDate} from "../../util/Helpers";

export const SalesCard = (props) => {
    function statusButton(status) {
        const _status = capitalizeFirstLetter(status)
        return <View style={{
            padding: 3,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: _status === "Completed" ? Colors.grey300: Colors.error,
        }}>
            <Text style={[textTheme.bodyMedium, {color: _status === "Cancelled" ? Colors.white : Colors.black}]}>{_status}</Text>
        </View>
    }



    return <View style={[styles.container]}>
        <View style={styles.innerContainer}>
            <View>
                <Text style={[textTheme.titleMedium]}>sale</Text>
                <Text>{dateFormatter(props.date, 'short') + ",  " + convertTo12HourFormatWithSeconds(props.time)}</Text>
            </View>
            <Text>{statusButton(props.status)}</Text>
        </View>
            <Text style={[textTheme.bodyMedium, styles.invoiceNumberText]}>Invoice number:
                <Text style={[textTheme.bodyMedium, {color: Colors.highlight}]}> {props.invoiceNumber}</Text>
            </Text>
        <Text style={[textTheme.bodyMedium, styles.servicesText]}>
            {props.service}
        </Text>
        <Divider style={{marginTop: 16}}/>
        <View style={styles.totalContainer}>
            <Text style={[textTheme.titleSmall]}>
                Total
            </Text>
            <Text style={[textTheme.titleSmall]}>
                ₹{props.total}
            </Text>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        borderRadius: 6,
        width: '100%',
        padding: 16

    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8
    },
    invoiceNumberText: {
        marginTop: 8
    },
    servicesText: {
        marginTop: 16
    }
})