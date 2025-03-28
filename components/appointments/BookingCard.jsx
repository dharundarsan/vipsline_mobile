import {View, StyleSheet, Text, Pressable, Image, TouchableOpacity, Linking} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import userIcon from "../../assets/icons/appointments/user.png"
import callIcon from "../../assets/icons/appointments/call.png"
import calendarIcon from "../../assets/icons/appointments/calendar.png"
import {Feather} from "@expo/vector-icons";
import AddBookingsModal from "./AddBookingsModal";
import React, {useState} from "react";
import ViewBookingModal from "../../apis/appointmentsAPIs/ViewBookingModal";
import {loadFutureBookingsFromDB} from "../../store/appointmentsSlice";
import {useDispatch} from "react-redux";
import moment from "moment";
import {getStatusColorAndText} from "../../util/appointmentsHelper";

const BookingCard = (props) => {
    const [isViewBookingModalVisible, setIsViewBookingModalVisible] = useState(false);
    let statusColor = getStatusColorAndText(props.data.status).color;

    const dispatch = useDispatch();

    return <Pressable onPress={() => {
        setIsViewBookingModalVisible(true);
    }} android_ripple={{color: Colors.ripple}} style={styles.bookingCard}>

        {isViewBookingModalVisible && <ViewBookingModal
            data={props.data}
            activeBookingToastRef={props.activeBookingToastRef}
            isVisible={isViewBookingModalVisible}
            onClose={() => {
                dispatch(loadFutureBookingsFromDB())
                setIsViewBookingModalVisible(false);
            }}/>}

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
            <View style={{marginBottom: 10, alignSelf: "flex-start"}}>
                <TouchableOpacity
                    style={{flexDirection: "row", gap: 5, alignItems: "center"}}
                    onPress={() => {
                        const url = `tel:${props.data.user_contact}`;
                        Linking.openURL(url).catch(err => console.error("Couldn't open dialer", err));
                    }}>
                    <Feather name="phone" size={18} color={Colors.highlight}/>
                    <Text style={[textTheme.bodyMedium, {
                        fontSize: 15,
                        color: Colors.highlight
                    }]}>{props.data.user_contact}</Text>
                    {/*<Text style={{fontWeight: 600, color: Colors.highlight}}>CALL</Text>*/}
                </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 15}}>
                <View style={{marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 10}}>
                    <Image source={calendarIcon} style={{
                        height: 18,
                        width: 17
                    }}/>
                    <Text
                        style={[textTheme.bodyMedium, {fontSize: 15,}]}>Date: {moment(props.data.appointment_date, "YYYY-MM-DD").format("DD MMM YYYY")}</Text>
                </View>
                <View style={{
                    flexDirection: "row", alignItems: "center", gap: 5
                }}>
                    <Feather name="clock" size={18} color="black"/>
                    <Text
                        style={[textTheme.bodyMedium, {fontSize: 15,}]}>{moment(props.data.start_time, "hh:mm:ss").format("hh:mm A")}</Text>
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
                fontWeight: "bold",
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
        borderColor: Colors.grey400,
    }
})

export default BookingCard