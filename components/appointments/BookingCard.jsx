import {View, StyleSheet, Text, Pressable, Image} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import userIcon from "../../assets/icons/appointments/user.png"
import callIcon from "../../assets/icons/appointments/call.png"
import calendarIcon from "../../assets/icons/appointments/calendar.png"
import {Feather} from "@expo/vector-icons";

const BookingCard = (props) => {
    let statusColor;
    if (props.data.status === "COMPLETED") {
        statusColor = "#D4D4D4"
    } else if (props.data.status === "BOOKED") {
        statusColor = "#9DDDE0"
    } else if (props.data.status === "CONFIRMED") {
        statusColor = "#D5C6F5"
    } else if (props.data.status === "NO SHOW") {
        statusColor = "#F67A6F"
    } else if (props.data.status === "IN-SERVICE") {
        statusColor = "#FAC5DC"
    } else if (props.data.status === "CANCELLED") {
        statusColor = "#D1373F"
    }

    return <Pressable android_ripple={{color: Colors.ripple}} style={styles.bookingCard}>
        <View style={{
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: Colors.grey300,
            marginBottom: 10,
            paddingVertical: 20,
        }}>
            <View style={{marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 10}}>
                <Image source={userIcon} style={{
                    height: 20,
                    width: 20
                }}/>
                <Text style={[textTheme.bodyMedium, {fontSize: 15, fontWeight: "700"}]}>{props.data.user_name}</Text>
            </View>
            <View style={{marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 10}}>
                <Image source={callIcon} style={{
                    height: 18,
                    width: 18
                }}/>
                <Text style={[textTheme.bodyMedium, {fontSize: 15,}]}>{props.data.user_contact}</Text>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 15}}>
                <View style={{marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 10}}>
                    <Image source={calendarIcon} style={{
                        height: 18,
                        width: 17
                    }}/>
                    <Text style={[textTheme.bodyMedium, {fontSize: 15,}]}>Date: {props.data.appointment_date}</Text>
                </View>
                <View style={{
                    flexDirection:"row", alignItems:"center", gap:5
                }}>
                    <Feather name="clock" size={18} color="black" />
                    <Text style={[textTheme.bodyMedium, {fontSize: 15,}]}>{props.data.start_time}</Text>
                </View>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={[textTheme.bodyMedium, {fontSize: 15, fontWeight: 700}]}>Total Amount</Text>
                <Text style={[textTheme.bodyMedium, {fontSize: 15, fontWeight: 700}]}>₹ {props.data.price}</Text>
            </View>
            {/*<View style={{height: 1, width: "100%", backgroundColor: "#E5E5E5", marginBottom: 10}}/>*/}
        </View>
        <View style={{flexDirection: "row", justifyContent: "flex-end", gap: 15, marginRight: 15, marginBottom: 10}}>
            <View style={{
                borderWidth: 1,
                borderColor: Colors.highlight,
                borderRadius: 6,
                paddingVertical: 3,
                paddingHorizontal: 8
            }}>
                <Text style={[textTheme.bodyMedium, {fontSize: 14}]}>View Details</Text>
            </View>
            <View style={{
                backgroundColor: statusColor,
                borderRadius: 6,
                paddingVertical: 3,
                paddingHorizontal: 8
            }}>
                <Text style={[textTheme.bodyMedium, {fontSize: 14}]}>{props.data.status}</Text>
            </View>
        </View>
    </Pressable>
}

const styles = StyleSheet.create({
    bookingCard: {
        backgroundColor: "white",
        borderWidth: 0.5,
        borderRadius: 6,
        marginBottom: 20,
        borderColor:Colors.grey400,
    }
})

export default BookingCard