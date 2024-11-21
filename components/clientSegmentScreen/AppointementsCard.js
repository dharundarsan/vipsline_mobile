import {View, Text, StyleSheet} from 'react-native';
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import Divider from "../../ui/Divider";
import {capitalizeFirstLetter, convertTo12HourFormatWithSeconds, dateFormatter} from "../../util/Helpers";

export const AppointmentsCard = (props) => {

    function backgroundColorsPicker(status) {
        const _status = capitalizeFirstLetter(status)

        if(_status === "Booked") {
                return Colors.booked
        } else if(_status === "Confirmed") {
            return Colors.confirmed
        }else if(_status === "In service") {
            return Colors.inService
        }else if(_status === "No show") {
            return Colors.error
        }else if(_status === "Completed") {
            return Colors.grey300
        } else {
            return Colors.error
        }

    }


    function statusButton(status) {
        const _status = capitalizeFirstLetter(status)

        return <View style={{
            padding: 3,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: backgroundColorsPicker(_status) ,
        }}>
            <Text style={[textTheme.bodyMedium, {color: _status === "Cancelled" ? Colors.white : Colors.black}]}>{_status}</Text>
        </View>
    }


    return <View style={[styles.container]}>
        <View style={styles.innerContainer}>
            <View>
                <Text style={[textTheme.titleMedium]}>Appointments</Text>
                <Text>{props.date + ",  " + props.time}</Text>
            </View>
            <Text>{statusButton(props.status)}</Text>
        </View>
        <Text style={[textTheme.bodyMedium, styles.servicesText]}>
            {props.service}
        </Text>
        <Text style={[textTheme.bodyMedium, styles.staffNameText]}>staff: <Text style={[textTheme.bodyMedium, {color: Colors.black}]}>{props.staffName}</Text></Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 8}}>
            <Text style={[textTheme.bodyMedium, {color: Colors.grey400}]}>staff time: <Text style={[textTheme.bodyMedium, {color: Colors.black}]}>{props.time}</Text></Text>
            <Text style={[textTheme.bodyMedium, {color: Colors.grey400}]}>Duration: <Text style={[textTheme.bodyMedium, {color: Colors.black}]}>{props.duration}</Text></Text>
        </View>

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
    servicesText: {
        marginTop: 8
    },
    staffNameText: {
        color: Colors.grey400,
        marginTop: 8
    }

})