import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import { View, ScrollView, StyleSheet, Modal, Text } from 'react-native';
import {Button, Divider, DataTable, Checkbox} from 'react-native-paper';
import axios from 'axios';
import getRegularShiftsAPI from "../../apis/staffManagementAPIs/getRegularShiftsAPI";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import textTheme from "../../constants/TextTheme";
import CustomTextInput from "../../ui/CustomTextInput";
import {useSelector} from "react-redux";
import ShiftsForWeek from "./ShiftsForWeek";
import moment from "moment";
import * as SecureStore from "expo-secure-store";
import getDefaultStaffSchedulePatternAPI from "../../apis/staffManagementAPIs/getDefaultStaffSchedulePatternAPI";
import Toast from "../../ui/Toast";
import {formatDate} from "../../util/Helpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";


const RegularShifts = (props) => {

    const mappingWeekNames = {
        WEEKLY: "Weekly",
        EVERY_2_WEEKS: "Every 2 weeks",
        EVERY_3_WEEKS: "Every 3 weeks",
        EVERY_4_WEEKS: "Every 4 weeks",
    }

    const changeTracker = {
        "Weekly": 1,
        "Every 2 weeks": 2,
        "Every 3 weeks": 3,
        "Every 4 weeks": 4,
    }

    const [response, setResponse] = useState({});
    const [scheduleType, setScheduleType] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [ends, setEnds] = useState("never");

    const [scheduleTypeChangeTracker, setScheduleTypeChangeTracker] = useState("");
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState();

    const [create, setCreate] = useState(false);

    useLayoutEffect(() => {
        const fetchSchedule = async () => {
            const response = await getRegularShiftsAPI(props.currentDayWorkingData.resource_id);
            setResponse(response.data.data[0]);
            return response
        };

        fetchSchedule().then((response1) => {
            if(Object.keys(response1.data.data[0]).length === 0) {
                console.log("sdgsj")
                setCreate(true)
                getDefaultStaffSchedulePatternAPI(1).then((response2) => {
                    setResponse(response2.data.data[0]);
                    setScheduleType("Weekly");
                    setEnds(response2.end_date === null ? "never" : "Select end date")
                    setEndDate(response2.end_date !== null ? moment(response2.end_date).toDate() : null);
                    setStartDate(moment(response2.start_date).toDate());
                })
                return;
            }

            const response = response1.data.data[0];
            setScheduleType(mappingWeekNames[response.schedule_type]);
            setEnds(response.end_date === null ? "never" : "Select end date")
            setEndDate(response.end_date !== null ? moment(response.end_date).toDate() : null);
            setStartDate(moment(response.start_date).toDate());

        })
    }, []);




    const toastRef = useRef(null);

    const handleConfirm = (selectedDate) => {
        setEndDate(selectedDate);
        setIsDateTimePickerVisible(false);

    };

    const handleCancel = () => {
        setEndDate(null);
        setIsDateTimePickerVisible(false);
    };




    const handleSave = async () => {

    };

    return (
        <Modal
            visible={props.visible}
            animationType={"slide"}
            style={styles.modal}
            onRequestClose={props.onClose}
            presentationStyle={"formSheet"}
        >
            <Toast ref={toastRef}/>
            {
                isDateTimePickerVisible &&
                <DateTimePickerModal
                    isVisible={isDateTimePickerVisible}
                    mode="date"
                    date={endDate === undefined || endDate === null ? new Date() : new Date(endDate)} // Initial date
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    themeVariant="light"
                    style={styles.dateStyle}
                />
            }
            <View style={styles.closeAndHeadingContainer}>
                <Text style={[textTheme.titleLarge, styles.titleText]}>Set Regular Shifts</Text>
                <PrimaryButton buttonStyle={styles.closeButton} pressableStyle={styles.closeButtonPressable} onPress={props.onClose}>
                    <Ionicons name="close" size={25} color="black" />
                </PrimaryButton>
            </View>
            <Divider />
            <ScrollView style={styles.container}>
                <CustomTextInput
                    label={"Schedule type"}
                    type={"dropdown"}
                    value={scheduleType}
                    onChangeValue={(schedule) => {
                        setScheduleTypeChangeTracker(changeTracker[schedule] - changeTracker[scheduleType]);
                        setScheduleType(schedule);
                    }}
                    dropdownItems={[
                        "Weekly",
                        "Every 2 weeks",
                        "Every 3 weeks",
                        "Every 4 weeks",
                    ]}
                />

                <CustomTextInput
                    label={"Start date"}
                    type={"date"}
                    value={startDate}
                    onChangeValue={(startDate) => { setStartDate(startDate); }}
                />

                <View style={styles.endDateContainer}>
                    <CustomTextInput
                        label={"Ends"}
                        type={"dropdown"}
                        value={endDate === null ? ends : formatDate(new Date(endDate))}
                        onChangeValue={(value) => {
                            if(value === "Select end date") {
                                setIsDateTimePickerVisible(true)
                            }
                            else if (value === "never") {
                                setEndDate(null)
                            }
                            setEnds(value);
                        }}
                        dropdownItems={[
                            "never",
                            "Select end date"
                        ]}
                        onLongPress={() => {setEnds("Select end date")}}
                        container={{
                            flexDirection: 'row',
                            marginBottom: 0,
                        }}
                        labelEnabled={false}
                        dropdownPressable={{width: "100%"}}
                        dropdownButton={{
                            flex: 1,
                            marginVertical: 0,
                            borderRadius: 0,
                            borderWidth: 0,
                        }}

                    >
                        <PrimaryButton
                            buttonStyle={styles.dateTimeButtom}
                            pressableStyle={styles.dateTimeButtonPressable}
                            onLongPress={props.onLongPress}
                            onPress={() => setIsDateTimePickerVisible(true)}
                        >
                            <MaterialCommunityIcons
                                style={styles.dateTimeButtonIcon}
                                name="calendar-month-outline"
                                size={24}
                                color={Colors.grey600}
                            />
                        </PrimaryButton>
                    </CustomTextInput>


                </View>

                {
                    Object.values(response).length > 0 &&
                    <ShiftsForWeek
                        currentDayWorkingData={props.currentDayWorkingData}
                        data={response}
                        scheduleTypeChangeTracker={scheduleTypeChangeTracker}
                        scheduleType={scheduleType}
                        startDate={startDate}
                        endDate={endDate}
                        ends={ends}
                        toastRefTop={toastRef}
                        toastRef={props.toastRef}
                        onClose={props.onClose}
                        create={create}

                    />

                }






            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },

    closeAndHeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: { position: "absolute", right: 0, backgroundColor: Colors.white },
    closeButtonPressable: { alignItems: "flex-end" },
    titleText: { fontWeight: "500", flex: 1, justifyContent: "center", textAlign: "center" },
    modal: { flex: 1 },
    endDateContainer: {
        borderWidth: 1,
        borderRadius: 5,
        overflow: "hidden",
        borderColor: Colors.grey400,
    },
    dateTimeButtom: {
        backgroundColor: Colors.background,
        borderRadius: 0,
        borderLeftWidth :1,
        borderLeftColor: Colors.grey400
    },
    dateTimeButtonPressable: {
        paddingVertical: 0,
        paddingHorizontal: 9,
    },
    dateTimeButtonIcon: {

    },
    dateTimeButtonText: {
    },
    dateStyle: {

    }
});

export default RegularShifts;
