import {ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {
    decrementFutureBookingsPageNumber, incrementBookingsHistoryPageNumber,
    incrementFutureBookingsPageNumber, loadBookingsHistoryFromDB,
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
import LazyLoader from "../../ui/LazyLoader";
import moment from "moment";
import {useFocusEffect} from "@react-navigation/native";
import InfiniteScrollerList from "../../ui/InfiniteScrollerList";
import {FAB} from "react-native-paper";
import AddBookingsModal from "../../components/appointments/AddBookingsModal";
import {useModal} from "../../ModalProvider";
import Toast from "../../ui/Toast";
import ViewBookingModal from "../../apis/appointmentsAPIs/ViewBookingModal";

const ActiveBookings = () => {
    const futureBookings = useSelector(state => state.appointments.futureBookings);
    const isFetching = useSelector(state => state.appointments.futureBookingsIsFetching);
    const futureBookingsCount = useSelector(state => state.appointments.futureBookingsCount);
    const futureBookingsMaxEntry = useSelector(state => state.appointments.futureBookingsMaxEntry);
    const futureBookingsFilterDate = useSelector(state => state.appointments.futureBookingsFilterDate);
    const futureBookingsPageNo = useSelector(state => state.appointments.futureBookingsPageNo);
    const dispatch = useDispatch()
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [isAddBookingsModalVisible, setIsAddBookingsModalVisible] = useState(false);
    const toastRef = useRef(null);

    useLayoutEffect(() => {
        const apiCall = async () => {
            await dispatch(loadFutureBookingsFromDB())
        }
        apiCall()

    }, [futureBookingsFilterDate]);

    useFocusEffect(
        useCallback(() => {
            dispatch(setFutureBookingsFilterDate(moment().toISOString()));
        }, [dispatch])
    );

    const {showModal} = useModal();

    return <View style={{flex: 1, backgroundColor: "white"}}>
        {isAddBookingsModalVisible && <AddBookingsModal isVisible={isAddBookingsModalVisible}
                                                        onClose={() => {
                                                            setIsAddBookingsModalVisible(false);
                                                        }}
                                                        showToast={(message, error) => {
                                                            dispatch(loadFutureBookingsFromDB())
                                                            toastRef.current.show(message, error)
                                                        }}/>}

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

        <ScrollView style={{flex: 1, padding: 20, marginBottom: 30}}>
            <AppointmentsDatePicker date={new Date(futureBookingsFilterDate)}
                                    minimumDate={new Date()}
                                    onRightArrowPress={() => {
                                        const nextDate = moment(futureBookingsFilterDate).toDate();
                                        nextDate.setDate(nextDate.getDate() + 1); // Add 1 day
                                        dispatch(setFutureBookingsFilterDate(moment(nextDate).toISOString()));
                                    }}
                                    onLeftArrowPress={() => {
                                        const prevDay = moment(futureBookingsFilterDate).toDate();
                                        prevDay.setDate(prevDay.getDate() - 1); // Subtract 1 day
                                        dispatch(setFutureBookingsFilterDate(moment(prevDay).toISOString()));
                                    }}
                                    handleConfirm={(selectedDate) => {
                                        dispatch(setFutureBookingsFilterDate(moment(selectedDate).toISOString()))
                                    }}
                                    range={"day"}
            />
            {futureBookings.length === 0 ?
                <View style={{height: 500}}>
                    <Text style={[textTheme.titleMedium, {flex: 1, textAlign: "center", textAlignVertical: "center"}]}>No
                        Active
                        Bookings</Text>
                </View> : <InfiniteScrollerList
                    scrollEventThrottle={100}
                    style={{paddingHorizontal: 0}}
                    onFetchTrigger={() => {
                        dispatch(incrementFutureBookingsPageNumber())
                        dispatch(loadFutureBookingsFromDB())
                    }}
                    endOfListMessage={""}
                    fallbackTextOnEmptyData={"No Active Bookings"}
                    triggerThreshold={100}
                    totalLength={futureBookingsCount}
                    data={futureBookings}
                    isLoading={isFetching}
                    renderItem={({item}) => <BookingCard data={item}/>}
                />}
        </ScrollView>
        <FAB
            icon={"plus"}
            style={{
                backgroundColor: Colors.highlight,
                position: 'absolute',
                bottom: 32,
                right: 32,
            }}
            color={Colors.white}
            onPress={() => {
                setIsAddBookingsModalVisible(true);
            }}
        />
        <Toast ref={toastRef}/>
    </View>
};

const styles = StyleSheet.create({})

export default ActiveBookings;