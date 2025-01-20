import {ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {
    decrementFutureBookingsPageNumber,
    incrementFutureBookingsPageNumber,
    loadFutureBookingsFromDB,
    resetFutureBookingsPageNo,
    setFutureBookingsFilterDate,
    updateFutureBookingsMaxEntry
} from "../../store/appointmentsSlice";
import {useDispatch, useSelector} from "react-redux";
import BookingCard from "../../components/appointments/BookingCard";
import Pagination from "../../components/clientSegmentScreen/Pagination";
import PrimaryButton from "../../ui/PrimaryButton";
import {AntDesign, FontAwesome6} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import RadioButton from "../../ui/RadioButton";
import textTheme from "../../constants/TextTheme";
import DatePickerForwardBackward from "../../ui/DatePickerForwardBackward";
import AppointmentsDatePicker from "../../components/appointments/AppointmentsDatePicker";
import CustomPagination from "../../components/common/CustomPagination";
import EntryPicker from "../../components/common/EntryPicker";

const ActiveBookings = () => {
    const futureBookings = useSelector(state => state.appointments.futureBookings);
    const isFetching = useSelector(state => state.appointments.futureBookingsIsFetching);
    const futureBookingsCount = useSelector(state => state.appointments.futureBookingsCount);
    const futureBookingsMaxEntry = useSelector(state => state.appointments.futureBookingsMaxEntry);
    const futureBookingsFilterDate = useSelector(state => state.appointments.futureBookingsFilterDate);
    const futureBookingsPageNo = useSelector(state => state.appointments.futureBookingsPageNo);
    const dispatch = useDispatch()
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);

    useLayoutEffect(() => {
        const apiCall = async () => {
            await dispatch(loadFutureBookingsFromDB())
        }
        apiCall()
    }, [futureBookingsFilterDate]);

    return <View style={{flex: 1, backgroundColor: "white"}}>
        {isEntryModalVisible && (
            <EntryPicker
                setIsModalVisible={setIsEntryModalVisible}
                onPress={(number) => {
                    console.log(number)
                    dispatch(updateFutureBookingsMaxEntry(number))
                    setIsEntryModalVisible(false);
                }}
                maxEntry={futureBookingsMaxEntry}
                isVisible={isEntryModalVisible}
            />
        )}

        <ScrollView style={{flex: 1, padding: 20, marginBottom:30}}>
            <AppointmentsDatePicker date={futureBookingsFilterDate}
                                    minimumDate={new Date()}
                                    onRightArrowPress={() => {
                                        const nextDate = new Date(futureBookingsFilterDate.getTime());
                                        nextDate.setDate(nextDate.getDate() + 1); // Add 1 day
                                        dispatch(setFutureBookingsFilterDate(nextDate));
                                    }}
                                    onLeftArrowPress={() => {
                                        const prevDay = new Date(futureBookingsFilterDate.getTime());
                                        prevDay.setDate(prevDay.getDate() - 1); // Subtract 1 day
                                        dispatch(setFutureBookingsFilterDate(prevDay));
                                    }}
                                    handleConfirm={(selectedDate) => {
                                        dispatch(setFutureBookingsFilterDate(new Date(selectedDate.getTime())))
                                    }}/>
            {isFetching ? <View>
                    <ActivityIndicator/>
                </View> :
                futureBookings.length === 0 ? <View style={{
                        height: 600, alignItems: "center", justifyContent: "center"
                    }}>
                        <Text style={[textTheme.titleMedium]}>No Active Bookings</Text>
                    </View> :
                    <View style={{}}>
                        {futureBookings.map(item => <BookingCard data={item}/>)}
                    </View>}
            {futureBookingsCount > 10 && <CustomPagination
                setIsModalVisible={setIsEntryModalVisible}
                maxEntry={futureBookingsMaxEntry}
                incrementPageNumber={() => dispatch(incrementFutureBookingsPageNumber())}
                decrementPageNumber={() => dispatch(decrementFutureBookingsPageNumber())}
                refreshOnChange={async () =>
                    dispatch(loadFutureBookingsFromDB())
                }
                currentCount={futureBookings.length}
                totalCount={futureBookingsCount}
                resetPageNo={() => {
                    dispatch(resetFutureBookingsPageNo())
                }}
                isFetching={false}
                currentPage={futureBookingsPageNo}
            />}
        </ScrollView>
    </View>
};

const styles = StyleSheet.create({

})

export default ActiveBookings;