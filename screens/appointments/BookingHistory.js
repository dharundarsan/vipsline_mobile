import {ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {
    decrementBookingsHistoryPageNumber,
    incrementBookingsHistoryPageNumber,
    loadBookingsHistoryFromDB, resetBookingsHistoryPageNo, setBookingsHistoryFilterDate, updateBookingsHistoryMaxEntry
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
import isCloseToBottom from "../../util/isCloseToBottom";
import moment from "moment";
import LazyLoader from "../../ui/LazyLoader";
import InfiniteScrollerList from "../../ui/InfiniteScrollerList";

const BookingHistory = () => {
    const bookingsHistory = useSelector(state => state.appointments.bookingsHistory);
    const isFetching = useSelector(state => state.appointments.bookingsHistoryIsFetching);
    const bookingsHistoryCount = useSelector(state => state.appointments.bookingsHistoryCount);
    const bookingsHistoryMaxEntry = useSelector(state => state.appointments.bookingsHistoryMaxEntry);
    const bookingsHistoryFilterDate = useSelector(state => state.appointments.bookingsHistoryFilterDate);
    const bookingsHistoryPageNo = useSelector(state => state.appointments.bookingsHistoryPageNo);
    const dispatch = useDispatch()
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);


    useLayoutEffect(() => {
        const apiCall = async () => {
            await dispatch(loadBookingsHistoryFromDB())
        }
        apiCall()
    }, [bookingsHistoryFilterDate]);

    return <View style={{flex: 1, backgroundColor: "white", paddingVertical: 15}}>
        {isEntryModalVisible && (
            <EntryPicker
                setIsModalVisible={setIsEntryModalVisible}
                onPress={(number) => {
                    console.log(number)
                    dispatch(updateBookingsHistoryMaxEntry(number))
                    setIsEntryModalVisible(false);
                }}
                maxEntry={bookingsHistoryMaxEntry}
                isVisible={isEntryModalVisible}
            />
        )}

        {/*<ScrollView style={{flex: 1, padding: 20, marginBottom: 30}}>*/}
        <View style={{paddingHorizontal: 15}}>
            <AppointmentsDatePicker date={new Date(bookingsHistoryFilterDate)}
                                    maximumDate={new Date()}
                // minimumDate={new Date(new Date().setDate(16))}
                                    onRightArrowPress={() => {
                                        const nextDate = moment(bookingsHistoryFilterDate).toDate();
                                        nextDate.setDate(nextDate.getDate() + 1); // Add 1 day
                                        dispatch(setBookingsHistoryFilterDate(moment(nextDate).toISOString()));
                                    }}
                                    onLeftArrowPress={() => {
                                        const prevDay = moment(bookingsHistoryFilterDate).toDate();
                                        prevDay.setDate(prevDay.getDate() - 1); // Subtract 1 day
                                        dispatch(setBookingsHistoryFilterDate(moment(prevDay).toISOString()));
                                    }}
                                    handleConfirm={(selectedDate) => {
                                        dispatch(setBookingsHistoryFilterDate(moment(selectedDate).toISOString()))
                                    }}
                                    range={"day"}
            />
        </View>

        <InfiniteScrollerList
            scrollEventThrottle={100}
            style={{paddingHorizontal: 15}}
            onFetchTrigger={() => {
                dispatch(incrementBookingsHistoryPageNumber())
                dispatch(loadBookingsHistoryFromDB())
            }}
            fallbackTextOnEmptyData={"No Bookings History"}
            triggerThreshold={100}
            totalLength={bookingsHistoryCount}
            data={bookingsHistory}
            isLoading={isFetching}
            fallbackTextContainerStyle={{height: 500}}
            fallbackTextStyle={{color: "black", ...textTheme.titleMedium}}
            renderItem={({item}) => <BookingCard data={item}/>}
        />
    </View>
};

const styles = StyleSheet.create({
    pagination: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
    },
    disabled: {
        opacity: 0.4,
    },
    entryButtonContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginLeft: 16,
        backgroundColor: Colors.white,
    },
    paginationInnerContainer: {
        flexDirection: 'row',
        marginRight: 16,
        alignItems: "center",
    },
    pageForwardButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    pageBackwardButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginHorizontal: 16
    },
    buttonInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        // color: Colors.primary,
        marginBottom: 10,
    },
    innerContainer: {
        width: '100%',
        paddingVertical: 15,
    },
})

export default BookingHistory;