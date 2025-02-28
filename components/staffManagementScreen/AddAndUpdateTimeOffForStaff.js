import {Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import {Divider, RadioButton} from "react-native-paper";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import React, {useEffect, useRef, useState} from "react";
import CustomTextInput from "../../ui/CustomTextInput";
import {useSelector} from "react-redux";
import {deleteTimeOffTypeAPI} from "../../apis/staffManagementAPIs/deleteTimeOffTypeAPI";
import {loadTimeOffTypeFromDb} from "../../store/staffSlice";
import BottomActionCard from "../../ui/BottomActionCard";
import createTimeOffRequestAPI from "../../apis/staffManagementAPIs/createTimeOffRequestAPI";
import moment from "moment";
import getTimeOffRequestIdAPI from "../../apis/staffManagementAPIs/getStaffTimeOffRequestIdAPI";
import Toast from "../../ui/Toast";
import updateTimeOffRequestAPI from "../../apis/staffManagementAPIs/updateTimeOffRequestAPI";
import deleteTimeOffRequestAPI from "../../apis/staffManagementAPIs/deleteTimeOffRequestAPI";

export default function AddAndUpdateTimeOffForStaff(props) {
    const [radioButton, setRadioButton] = useState(props.currentDayWorkingData.permission ? 2 : 1);
    const [staffMember, setStaffMember] = useState(props.currentDayWorkingData.name);
    const [leaveOrPermissionType, setLeaveOrPermissionType] = useState("");
    const [startDate, setStartDate] = useState(props.edit ? null : null);
    const [endDate, setEndDate] = useState(props.edit ? null : null);
    const [startTime, setStartTime] = useState(props.edit ? null : null);
    const [endTime, setEndTime] = useState(props.edit ? null : null);
    const [notes, setNotes] = useState(props.edit ? "" : "");
    const [timeOffTypeId, setTimeOffTypeId] = useState("")

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState(false);


    const timeOffType = useSelector(state => state.staff.timeOffType);

    // console.log(props.currentDayWorkingData)

    // console.log(JSON.stringify(timeOffType, null, 2));
    //

    // console.log(timeOffType.filter((item, index) => item.type === "LEAVE").map((item, index) => item.name))

    const timeOffTypeRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const startTimeRef = useRef(null);
    const endTimeRef = useRef(null);

    const toastRef = useRef(null);

    // console.log(startDate)


    useEffect(() => {
        async function getStaffRequestId() {

            function dateConverter(date) {
                const [day, month, year] = date.split(" ");

                const months = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                };

                return new Date(year, months[month], day);
            }
            const response = await getTimeOffRequestIdAPI(props.currentDayWorkingData.timeOffRequestId);

            if(response.data.other_message === null) {
                const data = response.data.data[0];

                console.log((data.start_date === "") ?
                    null :
                    dateConverter(data.start_date))

                setStartDate(
                    data.start_date === "" ?
                        null :
                        dateConverter(data.start_date));
                setEndDate(
                data.end_date === "" ?
                        null :
                        dateConverter(data.end_date));
                setStartTime(
                    data.start_time === "" || data.start_time === null ?
                        null :
                        moment(data.start_time, "h:mm A").toDate());
                setEndTime(
                    data.end_time === "" || data.end_time === null ?
                        null :
                        moment(data.end_time, "h:mm A").toDate());
                setLeaveOrPermissionType(
                    (radioButton === 1 && data.time_off_type === "LEAVE") ||
                    (radioButton === 2 && data.time_off_type === "PERMISSION") ?
                        data.leave_type_name : ""
                )
                setNotes(data.reason)

            }
            else {
                console.log(response.data.other_message);
            }


        }

        if(props.edit) {
            getStaffRequestId()

        }
    }, [radioButton]);



    async function onSave() {
        // console.log(timeOffTypeRef.current);


        const timeOffTypeValid = timeOffTypeRef.current();
        const startDateValid = startDateRef.current();
        const endDateValid = radioButton === 1 ? endDateRef.current() : true;
        const startTimeValid = radioButton === 2 ? startTimeRef.current() : true;
        const endTimeValid = radioButton === 2 ? endTimeRef.current(): true;

        if(!startTimeValid || !endTimeValid || !timeOffTypeValid || !startDateValid || !endDateValid){
            return;
        }

        const response = await createTimeOffRequestAPI(
            props.currentDayWorkingData.resource_id,
            moment(startDate).format("YYYY-MM-DD"),
            moment(endDate).format("YYYY-MM-DD"),
            moment(startTime, "h:mm A").format("HH:mm"),
            moment(endTime, "h:mm A").format("HH:mm"),
            timeOffTypeId,
            notes,
            radioButton === 1 ? "leave" : "permission"
        )

        if(response.data.other_message === null || response.data.other_message === "") {
            props.toastRef.current.show(response.data.message);
            props.setOnUpdate(prev => !prev);
            props.onClose();
        }
        else {
            toastRef.current.show(response.data.other_message);
        }




    }
    async function onEdit() {
        const timeOffTypeValid = timeOffTypeRef.current();
        const startDateValid = startDateRef.current();
        const endDateValid = radioButton === 1 ? endDateRef.current() : true;
        const startTimeValid = radioButton === 2 ? startTimeRef.current() : true;
        const endTimeValid = radioButton === 2 ? endTimeRef.current(): true;

        if(!startTimeValid || !endTimeValid || !timeOffTypeValid || !startDateValid || !endDateValid){
            return;
        }

        const response = await updateTimeOffRequestAPI(
            props.currentDayWorkingData.resource_id,
            moment(startDate).format("YYYY-MM-DD"),
            moment(endDate).format("YYYY-MM-DD"),
            moment(startTime, "h:mm A").format("HH:mm"),
            moment(endTime, "h:mm A").format("HH:mm"),
            timeOffTypeId,
            props.currentDayWorkingData.timeOffRequestId,
            notes,
            radioButton === 1 ? "leave" : "permission"
        )

        if(response.data.other_message === null || response.data.other_message === "") {
            props.toastRef.current.show(response.data.message);
            props.setOnUpdate(prev => !prev);
            props.onClose();
        }
        else {
            toastRef.current.show(response.data.other_message);
        }
    }





    return <Modal
        visible={props.visible}
        animationType={"slide"}
        style={styles.modal}
        onRequestClose={props.onClose}
        presentationStyle={"formSheet"}
    >
        <Toast ref={toastRef}/>
        {
            isConfirmStaffDeleteModalVisible &&
            <BottomActionCard isVisible={isConfirmStaffDeleteModalVisible}
                              header={"Delete Shift Timings"}
                              content={"Are you sure? This action cannot be undone."}
                              onClose={() => setIsConfirmStaffDeleteModalVisible(false)}
                              onConfirm={async () => {
                                  const response = await deleteTimeOffRequestAPI(props.currentDayWorkingData.timeOffRequestId);
                                  if(response.data.other_message === "") {
                                      props.setOnUpdate(prev => !prev);
                                      props.toastRef.current.show(response.data.message)
                                      props.onClose();
                                  }
                                  else {
                                      toastRef.current.show(response.data.other_message);
                                  }
                                  setIsConfirmStaffDeleteModalVisible(false);

                              }}
                              onCancel={() => {
                                  setIsConfirmStaffDeleteModalVisible(false);
                              }}

            />
        }
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleMedium, {fontSize: 20,}, styles.titleText]}>{props.edit ? "Edit Time Off" : "Add Time Off"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={styles.modalContent}>
            <ScrollView>
            <View style={styles.radioButtonContainer}>
                <PrimaryButton
                    buttonStyle={styles.radioButton}
                    pressableStyle={styles.radioButtonPressable}
                    onPress={() => setRadioButton(1)}
                >
                    <RadioButton
                        value={"leave"}
                        color={Colors.highlight}
                        onPress={() => setRadioButton(1)}
                        status={radioButton === 1 ? "checked" : "unchecked"}
                        uncheckedColor={Colors.highlight}


                    />
                    <Text>
                        Leave
                    </Text>
                </PrimaryButton>


                <PrimaryButton
                    buttonStyle={styles.radioButton}
                    pressableStyle={[styles.radioButtonPressable]}
                    onPress={() => setRadioButton(2)}
                >
                    <RadioButton
                        value={"permission"}
                        color={Colors.highlight}
                        onPress={() => setRadioButton(2)}
                        status={radioButton === 2 ? "checked" : "unchecked"}
                        uncheckedColor={Colors.highlight}
                    />
                    <Text>
                        Permission
                    </Text>
                </PrimaryButton>
            </View>
            <CustomTextInput
                label={"Staff member"}
                type={"text"}
                value={staffMember}
                readOnly
                onChangeText={(value) => {
                    setStaffMember(value);
                }}
                required

            />
            <CustomTextInput
                label={(radioButton === 1 ? "Leave" : "Permission") + " type"}
                type={"dropdown"}
                placeholder={(radioButton === 1 ? "Leave" : "Permission") + " type"}
                dropdownItems={
                    radioButton === 1 ?
                        timeOffType.filter(item => item.type === "LEAVE").map(item => item.name) :
                        timeOffType.filter(item => item.type === "PERMISSION").map(item => item.name)
                }
                onChangeValue={(value) => {
                    setLeaveOrPermissionType(value);
                    const type = timeOffType.find(item => item.name === value);
                    setTimeOffTypeId(type.id)

                }}
                value={leaveOrPermissionType}
                required
                validator={(item) => {
                    if(item === "" || item === undefined || item === null){
                        return radioButton === 1 ? "Leave is required" : "Permission is required";
                    }
                    else {
                        return true
                    }
                }}
                onSave={(callback) => {
                    timeOffTypeRef.current = callback;
                }}

            />
            <CustomTextInput
                label={"Start date"}
                type={"date"}
                onChangeValue={(value) => {
                    setStartDate(value);
                }}
                value={startDate}
                required
                validator={(item) => {
                    if(item === "" || item === undefined || item === null){
                        return "start date is required";
                    }
                    else {
                        return true
                    }
                }}
                onSave={(callback) => {
                    startDateRef.current = callback;
                }}
            />
            {
                radioButton === 1 ?
                    <CustomTextInput
                        label={"End date"}
                        type={"date"}
                        onChangeValue={(value) => {
                            setEndDate(value);
                        }}
                        value={endDate}
                        required
                        validator={(item) => {
                            if(item === "" || item === undefined || item === null){
                                return "end date is required";
                            }
                            else {
                                return true
                            }
                        }}
                        onSave={(callback) => {
                            endDateRef.current = callback;
                        }}
                    /> :
                    <View style={{flexDirection: "row", gap: 8}}>
                        <CustomTextInput
                            label={"Start time"}
                            type={"time"}
                            flex
                            onChangeValue={(value) => {
                                setStartTime(value);
                            }}
                            value={startTime}
                            required
                            validator={(item) => {
                                if(radioButton === 1) {
                                    return true
                                }
                                else if(item === "" || item === undefined || item === null){
                                    return "start time is required";
                                }
                                else {
                                    return true
                                }
                            }}
                            onSave={(callback) => {
                                if(radioButton === 2) {
                                    startTimeRef.current = callback;
                                }
                                else {
                                    startTimeRef.current = true;
                                }

                            }}
                            labelTextStyle={{flex: 1}}
                            placeholder={"Start time"}

                        />
                        <CustomTextInput
                        label={"End time"}
                        type={"time"}
                        flex
                        onChangeValue={(value) => {
                            setEndTime(value);
                        }}
                        value={endTime}
                        required
                        validator={(item) => {
                            if(radioButton === 1) {
                                return true
                            }
                            else if(item === "" || item === undefined || item === null){
                                return "end time is required";
                            }
                            else {
                                return true
                            }
                        }}
                        onSave={(callback) => {
                            if(radioButton === 2) {
                                endTimeRef.current = callback;
                            }
                            else {
                                endTimeRef.current = () => true;
                            }
                        }}
                        labelTextStyle={{flex: 1}}
                        placeholder={"End time"}
                    />
                    </View>
            }
            <CustomTextInput
                label={"Notes"}
                type={"multiLine"}
                placeholder={"Add description notes"}
                value={notes}
                onChangeText={(value) => {
                    setNotes(value);
                }}
            />
            </ScrollView>
            <View style={styles.bottomContainer}>
                {
                    props.edit ?
                        <PrimaryButton
                            onPress={async () => {
                                setIsConfirmStaffDeleteModalVisible(true);
                            }}
                            buttonStyle={{
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: Colors.grey400
                            }}
                            pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>
                            <MaterialIcons name="delete-outline" size={28} color={Colors.error}/>
                        </PrimaryButton> :
                        <PrimaryButton
                            label={"Cancel"}
                            buttonStyle={styles.cancelButton}
                            textStyle={styles.cancelButtonText}
                            onPress={props.onClose}
                        />
                }

                <PrimaryButton
                    label={props.edit ? "Update" : "Save"}
                    buttonStyle={styles.saveButton}
                    onPress={props.edit ? onEdit : onSave}
                />
            </View>

        </View>

    </Modal>
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 40 : 0,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    titleText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
    modal: {
        flex: 1,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 12
    },
    radioButtonContainer: {
        flexDirection: "row",
        gap: 8,
        marginVertical: 32
    },
    radioButtonPressable: {
        flexDirection: "row",
        paddingVertical: 0,
        justifyContent: "flex-start",
        gap: 8,
        paddingHorizontal: 12
    },
    radioButton: {
        backgroundColor: Colors.white,

    },
    bottomContainer: {
        paddingHorizontal: 16,
        flexDirection: "row",
        gap: 18,
        marginBottom: 6
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey500,
    },
    cancelButtonText: {
        color: Colors.black,
    },
    saveButton: {
        flex: 1,
    }
})