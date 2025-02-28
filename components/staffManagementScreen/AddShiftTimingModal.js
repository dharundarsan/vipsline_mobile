import {Modal, Text, View, StyleSheet, ScrollView} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useRef, useState} from "react";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import createShiftTimingAPI from "../../apis/staffManagementAPIs/createShiftTimingAPI";
import {formatTime} from "../../util/Helpers";
import Toast from "../../ui/Toast";
import updateShiftTimingAPI from "../../apis/staffManagementAPIs/updateShiftTimingAPI";
import moment from "moment/moment";
import {useDispatch} from "react-redux";
import {loadShiftTiming, loadStaffsFromDB} from "../../store/staffSlice";
import editStaffAPI from "../../apis/staffManagementAPIs/editStaffAPI";
import {updateNavigationState} from "../../store/NavigationSlice";
import BottomActionCard from "../../ui/BottomActionCard";
import deleteShiftTimingsAPI from "../../apis/staffManagementAPIs/deleteShiftTimingsAPI";

export default function AddShiftTimingModal(props) {

    const dispatch = useDispatch();

    const [shiftName, setShiftName] = useState(props.edit ? props.data.name: "")
    const [startTime, setStartTime] = useState(props.edit ? moment(props.data.start_time, "hh:mm A").toDate() : null);
    const [endTime, setEndTime] = useState(props.edit ? moment(props.data.end_time, "hh:mm A").toDate() : null);

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState(false);


    const shiftNameRef = useRef();
    const startTimeRef = useRef();
    const endTimeRef = useRef();

    const toastRef = useRef();


    async function onSave() {
        const startTimeRefValid = startTimeRef.current();
        const endTimeRefValid = endTimeRef.current();

        const shiftNameRefValid = shiftNameRef.current();

        if (!startTimeRefValid || !endTimeRefValid || !shiftNameRefValid) {
            return;
        }

        const response = await createShiftTimingAPI(
            shiftName,
            formatTime(startTime === undefined ? new Date() : startTime, "hh:mm"),
            formatTime(endTime === undefined ? new Date() : endTime, "hh:mm")
        );

        if(response.data.other_message === "") {
            props.toastRef.current.show(response.data.message);
            dispatch(loadShiftTiming());
            props.onClose();
        }
        else {
            toastRef.current.show(response.data.other_message);
        }


    }

    async function onEdit() {

        const startTimeRefValid = startTimeRef.current();
        const endTimeRefValid = endTimeRef.current();

        const shiftNameRefValid = shiftNameRef.current();

        if (!startTimeRefValid || !endTimeRefValid || !shiftNameRefValid) {
            return;
        }

        console.log(typeof startTime)

        const response = await updateShiftTimingAPI(props.data.id,
            shiftName === props.data.name ? "notChanged" : shiftName,
            formatTime(startTime === undefined ? new Date() : startTime, "hh:mm"),
            formatTime(endTime === undefined ? new Date() : endTime, "hh:mm")
        );

        if(response.data.other_message === "") {
            props.toastRef.current.show(response.data.message)
            dispatch(loadShiftTiming());
            props.onClose();
        }
        else {
            toastRef.current.show(response.data.other_message);
        }
    }



    return <Modal
        visible={props.visible}
        animationType="slide"
        style={styles.modal}
        onRequestClose={props.onClose}
        presentationStyle={"formSheet"}
    >

        <BottomActionCard isVisible={isConfirmStaffDeleteModalVisible}
                          header={"Delete Shift Timings"}
                          content={"Are you sure? This action cannot be undone."}
                          onClose={() => setIsConfirmStaffDeleteModalVisible(false)}
                          onConfirm={async () => {
                              await deleteShiftTimingsAPI(props.data.id);
                              setIsConfirmStaffDeleteModalVisible(false);
                              dispatch(loadShiftTiming());
                              props.onClose();
                          }}
                          onCancel={() => {
                              setIsConfirmStaffDeleteModalVisible(false);
                          }}

        />
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleMedium, {fontSize: 20}, styles.titleText]}>{props.edit ? "Edit Shit Timings" : "Add Shift Timings"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <>
        <ScrollView style={styles.modalContent}>
            <Toast ref={toastRef}/>
            <View style={styles.inputContainer}>
                <CustomTextInput
                    label={"Shift Name"}
                    type={"text"}
                    required
                    placeholder={"Enter Shift Name"}
                    value={shiftName}
                    onChangeText={setShiftName}
                    validator={(name) => {
                        if (name === null || name === undefined || name === "") return "shift name is required";
                        else return true;
                    }}
                    onSave={(callback) => {
                        shiftNameRef.current = callback;
                    }}


                />
                <CustomTextInput
                    label={"Start Time"}
                    type={"time"}
                    required
                    value={startTime}
                    onChangeValue={setStartTime}
                    validator={(time) => {
                        if (time === null || time === undefined) return "start time is required";
                        else return true;
                    }}
                    onSave={(callback) => {
                        startTimeRef.current = callback;
                    }}
                />
                <CustomTextInput
                    label={"End Time"}
                    type={"time"}
                    required
                    value={endTime}
                    onChangeValue={setEndTime}
                    validator={(time) => {
                        if (time === null || time === undefined) return "end time is required";
                        else return true;
                    }}
                    onSave={(callback) => {
                        endTimeRef.current = callback;
                    }}
                />


            </View>
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
        </>

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
    },
    inputContainer: {
        paddingHorizontal: 16,
        marginTop: 16,
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