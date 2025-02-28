import {View, Text, StyleSheet, Modal, ScrollView} from "react-native";
import BottomActionCard from "../../ui/BottomActionCard";
import deleteShiftTimingsAPI from "../../apis/staffManagementAPIs/deleteShiftTimingsAPI";
import {loadBusinessClosedDates, loadShiftTiming, loadTimeOffTypeFromDb} from "../../store/staffSlice";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import Toast from "../../ui/Toast";
import CustomTextInput from "../../ui/CustomTextInput";
import Colors from "../../constants/Colors";
import React, {useRef, useState} from "react";
import {useDispatch} from "react-redux";
import createBusinessClosedDatesAPI from "../../apis/staffManagementAPIs/createBusinessClosedDatesAPI";
import {formatDate} from "../../util/Helpers";
import updateBusinessClosedDatesAPI from "../../apis/staffManagementAPIs/updateBusinessClosedDatesAPI";
import moment from "moment";
import deleteBusinessClosedDatesAPI from "../../apis/staffManagementAPIs/deleteBusinessClosedDatesAPI";

export default function AddAndUpdateClosedDatesModal(props) {
    const dispatch = useDispatch();

    const [description, setDescription] = useState(props.edit ? props.data.name : "");
    const [startDate, setStartDate] = useState(props.edit ? moment(props.data.start_date, "DD MMM YYYY", true).toDate() : null);
    const [endDate, setEndDate] = useState(props.edit ? moment(props.data.end_date, "DD MMM YYYY", true).toDate() : null);

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState(false);


    const toastRef = useRef();
    const startDateRef = useRef();
    const endDateRef = useRef();
    const descriptionRef = useRef();


    async function onSave() {
        const descriptionValid = descriptionRef.current();
        const startDateValid = startDateRef.current();
        const endDateValid = endDateRef.current();

        if(!descriptionValid || !startDateValid || !endDateValid) {
            return;
        }

        const response = await createBusinessClosedDatesAPI(
            description,
            formatDate(startDate, "yyyy-mm-dd"),
            formatDate(endDate, "yyyy-mm-dd")
        );



        if(response.data.other_message === "") {
            props.toastRef.current.show(response.data.message);
            props.onClose();
            dispatch(loadBusinessClosedDates());
        }
        else {
            toastRef.current.show(response.data.other_message);
        }

    }

    async function onEdit() {
        const descriptionValid = descriptionRef.current();
        const startDateValid = startDateRef.current();
        const endDateValid = endDateRef.current();

        if(!descriptionValid || !startDateValid || !endDateValid) {
            return;
        }

        const response = await updateBusinessClosedDatesAPI(
            props.data.id,
            description === props.data.name ? "notChanged" : description,
            formatDate(startDate, "yyyy-mm-dd"),
            formatDate(endDate, "yyyy-mm-dd")
        );



        if(response.data.other_message === "") {
            props.toastRef.current.show(response.data.message);
            props.onClose();
            dispatch(loadBusinessClosedDates());
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
        <Toast ref={toastRef}/>

        <BottomActionCard isVisible={isConfirmStaffDeleteModalVisible}
                          header={"Delete Shift Timings"}
                          content={"Are you sure? This action cannot be undone."}
                          onClose={() => setIsConfirmStaffDeleteModalVisible(false)}
                          onConfirm={async () => {
                              const response = await deleteBusinessClosedDatesAPI(props.data.id);
                              if(response.data.other_message === "") {
                                  dispatch(loadTimeOffTypeFromDb());
                                  props.toastRef.current.show(response.data.message)
                              }
                              else {
                                  toastRef.current.show(response.data.other_message);
                              }
                              setIsConfirmStaffDeleteModalVisible(false);
                              dispatch(loadBusinessClosedDates());
                              props.onClose();
                          }}
                          onCancel={() => {
                              setIsConfirmStaffDeleteModalVisible(false);
                          }}

        />
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleMedium, {fontSize: 20,}, styles.titleText]}>{props.edit ? "Edit Business Closed Dates" : "Add Business Closed Dates"}</Text>
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
                        label={"Description"}
                        type={"text"}
                        required
                        placeholder={"Enter Description"}
                        value={description}
                        onChangeText={setDescription}
                        validator={(name) => {
                            if (name === null || name === undefined || name === "") return "Description is required";
                            else return true;
                        }}
                        onSave={(callback) => {
                            descriptionRef.current = callback;
                        }}


                    />
                    <CustomTextInput
                        label={"Start Date"}
                        type={"date"}
                        required
                        value={startDate}
                        onChangeValue={setStartDate}
                        validator={(time) => {
                            if (time === null || time === undefined) return "start date is required";
                            else return true;
                        }}
                        onSave={(callback) => {
                            startDateRef.current = callback;
                        }}
                        maximumDate={endDate === null ? undefined : endDate}
                    />
                    <CustomTextInput
                        label={"End Date"}
                        type={"date"}
                        required
                        value={endDate}
                        onChangeValue={setEndDate}
                        validator={(time) => {
                            if (time === null || time === undefined) return "end date is required";
                            else return true;
                        }}
                        onSave={(callback) => {
                            endDateRef.current = callback;
                        }}
                        minimumDate={startDate === null ? new Date() : startDate}
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