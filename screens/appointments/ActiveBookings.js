import {ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {
    decrementFutureBookingsPageNumber,
    incrementFutureBookingsPageNumber,
    loadFutureBookingsFromDB, resetFutureBookingsPageNo, updateFutureBookingsMaxEntry
} from "../../store/appointmentsSlice";
import {useDispatch, useSelector} from "react-redux";
import BookingCard from "../../components/appointments/BookingCard";
import Pagination from "../../components/clientSegmentScreen/Pagination";
import PrimaryButton from "../../ui/PrimaryButton";
import {AntDesign, Feather, FontAwesome6} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import RadioButton from "../../ui/RadioButton";
import textTheme from "../../constants/TextTheme";
import {FAB} from "react-native-paper";
import AddBookingsModal from "../../components/appointments/AddBookingsModal";

const ActiveBookings = () => {
    const futureBookings = useSelector(state => state.appointments.futureBookings);
    const isFetching = useSelector(state => state.appointments.futureBookingsIsFetching);
    const totalCount = useSelector(state => state.appointments.futureBookingsCount);
    const maxEntry = useSelector(state => state.appointments.futureBookingsMaxEntry);
    const dispatch = useDispatch()

    const [upperCount, setUpperCount] = useState(10);
    const [lowerCount, setLowerCount] = useState(1);
    const [isBackwardButtonDisabled, setIsBackwardButtonDisabled] = useState(false);
    const [isForwardButtonDisabled, setIsForwardButtonDisabled] = useState(false);
    const [isPaginationModalVisible, setIsPaginationModalVisible] = useState(false);

    const [isAddBookingsModalVisible, setIsAddBookingsModalVisible] = useState(false);

    const options = [
        {label: '10', value: 10},
        {label: '25', value: 25},
        {label: '50', value: 50},
        {label: '100', value: 100},
    ];

    useLayoutEffect(() => {
        dispatch(loadFutureBookingsFromDB())
    }, []);

    useEffect(() => {
        if (lowerCount === 1) {
            setIsBackwardButtonDisabled(true);
        } else {
            setIsBackwardButtonDisabled(false);
        }

        if (upperCount >= totalCount) {
            setIsForwardButtonDisabled(true);
        } else {
            setIsForwardButtonDisabled(false);
        }
    }, [lowerCount, upperCount, maxEntry, totalCount]);

    function backwardButtonHandler() {
        if (!isBackwardButtonDisabled) {
            let lowerCountAfter = lowerCount - maxEntry;
            let upperCountAfter = upperCount - maxEntry;

            if (lowerCountAfter === 1 && upperCountAfter < maxEntry) {
                dispatch(decrementFutureBookingsPageNumber())
                dispatch(loadFutureBookingsFromDB())
                setLowerCount(1);
                setUpperCount(maxEntry);
            } else if (lowerCountAfter < 1 && upperCountAfter < maxEntry) {
                dispatch(decrementFutureBookingsPageNumber())
                dispatch(loadFutureBookingsFromDB())
                setLowerCount(1);
                setUpperCount(maxEntry);
            } else if (upperCountAfter >= 1 && upperCountAfter >= maxEntry) {
                dispatch(decrementFutureBookingsPageNumber())
                dispatch(loadFutureBookingsFromDB())
                setLowerCount(lowerCountAfter);
                setUpperCount(lowerCountAfter - upperCountAfter === maxEntry ? upperCountAfter : lowerCountAfter + maxEntry - 1);
            }
        }
    }

    function forwardButtonHandler() {
        if (!isForwardButtonDisabled) {
            let lowerCountAfter = lowerCount + maxEntry;
            let upperCountAfter = upperCount + maxEntry;

            if (upperCountAfter > totalCount && lowerCountAfter < 0) {
                setLowerCount(totalCount - maxEntry);
                setUpperCount(totalCount);
            } else if (upperCountAfter <= totalCount && lowerCountAfter >= 0) {
                dispatch(incrementFutureBookingsPageNumber())
                dispatch(loadFutureBookingsFromDB())
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
            } else if (upperCountAfter > totalCount && upperCountAfter >= 0) {
                dispatch(incrementFutureBookingsPageNumber())
                dispatch(loadFutureBookingsFromDB())
                setUpperCount(totalCount);
                setLowerCount(lowerCountAfter)
            } else if (lowerCountAfter < 0 && upperCountAfter < totalCount) {
                dispatch(incrementFutureBookingsPageNumber())
                dispatch(loadFutureBookingsFromDB())
                setUpperCount(upperCountAfter)
                setLowerCount(0)
            }
        }
    }

    return <View style={{flex: 1, backgroundColor: "white"}}>
        {isAddBookingsModalVisible && <AddBookingsModal onClose={() => setIsAddBookingsModalVisible(false)}/>}
        {
            isPaginationModalVisible &&
            <Modal
                visible={isPaginationModalVisible}
                animationType="fade"
                transparent={true}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.overlay}
                    onPress={() => setIsPaginationModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Max Count</Text>
                        <View style={styles.innerContainer}>
                            <RadioButton
                                options={options}
                                value={maxEntry}
                                onPress={(value) => {
                                    setIsPaginationModalVisible(false);
                                    dispatch(resetFutureBookingsPageNo());
                                    dispatch(updateFutureBookingsMaxEntry(value));
                                    setLowerCount(1)
                                    setUpperCount(value)
                                    dispatch(loadFutureBookingsFromDB())
                                }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        }
        <ScrollView style={{flex: 1, padding: 20}}>
            {isFetching ? <View>
                    <ActivityIndicator/>
                </View> :
                futureBookings.length === 0 ? <View style={{
                        height: 600, alignItems: "center", justifyContent: "center"
                    }}>
                        <Text style={[textTheme.titleMedium]}>No Active Bookings</Text>
                    </View> :
                    <View style={{marginBottom: 20}}>
                        {futureBookings.map(item => <BookingCard data={item}/>)}
                        {totalCount < 10 ? null : <View style={styles.pagination}>
                            <PrimaryButton
                                pressableStyle={styles.entryButton}
                                buttonStyle={styles.entryButtonContainer}
                                onPress={() => setIsPaginationModalVisible(true)}
                            >
                                <View style={styles.buttonInnerContainer}>
                                    <Text style={styles.entryText}>
                                        {maxEntry}
                                    </Text>
                                    <AntDesign name="caretdown" size={14} color="black" style={{marginLeft: 16}}/>
                                </View>
                            </PrimaryButton>

                            <View style={styles.paginationInnerContainer}>
                                <Text style={styles.pagingText}>
                                    {lowerCount < 0 ? 0 : lowerCount} - {upperCount} of {totalCount}
                                </Text>
                                <PrimaryButton
                                    buttonStyle={[isBackwardButtonDisabled ? [styles.pageBackwardButton, styles.disabled] : [styles.pageBackwardButton]]}
                                    onPress={backwardButtonHandler}
                                >
                                    <FontAwesome6 name="angle-left" size={24} color="black"/>
                                </PrimaryButton>
                                <PrimaryButton
                                    buttonStyle={[isForwardButtonDisabled ? [styles.pageForwardButton, styles.disabled] : [styles.pageForwardButton]]}
                                    onPress={forwardButtonHandler}
                                >
                                    <FontAwesome6 name="angle-right" size={24} color="black"/>
                                </PrimaryButton>
                            </View>
                        </View>}
                    </View>}
        </ScrollView>
        <PrimaryButton buttonStyle={{
            position: "absolute",
            height: 55,
            width: 55,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            backgroundColor: Colors.highlight,
            bottom: 75,
            right: 20,
            zIndex: 1
        }}
                       onPress={() => setIsAddBookingsModalVisible(true)}
                       pressableStyle={{flex: 1}}>
            <Feather name="plus" size={24}
                     color={Colors.white}/>
        </PrimaryButton>
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
        color: Colors.primary,
        marginBottom: 10,
    },
    innerContainer: {
        width: '100%',
        paddingVertical: 15,
    },
})

export default ActiveBookings;