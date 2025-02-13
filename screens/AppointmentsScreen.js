import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native'
import { Calendar } from 'react-native-big-calendar'

export default function StaffCalendar() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)

    const staff = [
        { id: '1', name: 'Staff 1' },
        { id: '2', name: 'Staff 2' },
        { id: '3', name: 'Staff 3' },
        { id: '4', name: 'Staff 4' },
    ]

    const bookings = [
        {
            title: 'Booking',
            start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 10, 0),
            end: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 11, 0),
            staffId: '1',
        },
    ]

    const handleCellPress = (time) => {
        const staffId = staff[0].id // Default to the first staff member or set logic for selection
        const selectedStaffMember = staff.find(s => s.id === staffId)
        setSelectedStaff(selectedStaffMember)
        setSelectedTime(time)
        setIsModalVisible(true)
    }

    const renderCustomHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.timeColumnSpace} />
                {staff.map((s) => (
                    <View key={s.id} style={styles.staffHeaderItem}>
                        <Text style={styles.staffName}>{s.name}</Text>
                    </View>
                ))}
            </View>
        )
    }

    const renderCustomEvent = (event) => {
        return (
            <View style={styles.eventContainer}>
                <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Calendar
                date={selectedDate}
                events={bookings}
                height={600}
                mode="custom"
                renderEvent={renderCustomEvent}
                renderHeader={renderCustomHeader}
                onPressCell={(time) => handleCellPress(time)}
                eventCellStyle={(event) => {
                    const staffIndex = staff.findIndex(s => s.id === event.staffId)
                    return {
                        left: `${(staffIndex / staff.length) * 100}%`,
                        width: `${100 / staff.length}%`,
                    }
                }}
            />
            <Modal
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Book {selectedStaff?.name} at {selectedTime?.toLocaleTimeString()}?
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                // console.log(`Booking confirmed for ${selectedStaff?.name} at ${selectedTime?.toLocaleTimeString()}`)
                                setIsModalVisible(false)
                            }}
                            style={styles.confirmButton}
                        >
                            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
    },
    timeColumnSpace: {
        width: 60,
    },
    staffHeaderItem: {
        flex: 1,
        alignItems: 'center',
    },
    staffName: {
        fontWeight: 'bold',
    },
    eventContainer: {
        backgroundColor: 'blue',
        padding: 2,
        borderRadius: 4,
    },
    eventTitle: {
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    confirmButton: {
        marginTop: 10,
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: 'white',
        textAlign: 'center',
    },
})
