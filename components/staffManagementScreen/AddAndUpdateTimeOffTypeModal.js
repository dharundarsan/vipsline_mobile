import {Modal, Text, View, StyleSheet, TouchableHighlight, ScrollView} from "react-native";
import Toast from "../../ui/Toast";
import BottomActionCard from "../../ui/BottomActionCard";
import deleteShiftTimingsAPI from "../../apis/staffManagementAPIs/deleteShiftTimingsAPI";
import {loadShiftTiming, loadTimeOffTypeFromDb} from "../../store/staffSlice";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useRef, useState} from "react";
import Colors from "../../constants/Colors";
import {RadioButton, TouchableRipple} from "react-native-paper";
import CustomTextInput from "../../ui/CustomTextInput";
import createTimeOffTypeAPI from "../../apis/staffManagementAPIs/createTimeOffTypeAPI";
import updateTimeOffTypeAPI from "../../apis/staffManagementAPIs/updateTimeOffTypeAPI";
import {useDispatch} from "react-redux";
import {deleteTimeOffTypeAPI} from "../../apis/staffManagementAPIs/deleteTimeOffTypeAPI";

export default function AddAndUpdateTimeOffTypeModal(props) {
    const dispatch = useDispatch();

    const toastRef = useRef();

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState(false);
    const [checkedState, setCheckedState] = useState(props.edit ? props.data.type === "LEAVE" ? "leave" : "permission" : "leave");
    const [reason, setReason] = useState(props.edit ? props.data.name : "");

    const reasonRef = useRef(null);

    async function onSave() {
        const reasonValid = reasonRef.current();

        if(!reasonValid) {
            return
        }

        const response = await createTimeOffTypeAPI(reason, checkedState);

        if(response.data.other_message === "") {
            dispatch(loadTimeOffTypeFromDb());
            props.toastRef.current.show(response.data.message)
            props.onClose();

        }
        else {
            toastRef.current.show(response.data.other_message);
        }
    }

    async function onEdit() {
        const reasonValid = reasonRef.current();

        if(!reasonValid) {
            return
        }

        const response = await updateTimeOffTypeAPI(props.data.id, reason, checkedState)

        if(response.data.other_message === "") {
            dispatch(loadTimeOffTypeFromDb());
            props.toastRef.current.show(response.data.message)

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
        <Toast ref={toastRef}/>

        <BottomActionCard isVisible={isConfirmStaffDeleteModalVisible}
                          header={"Delete Shift Timings"}
                          content={"Are you sure? This action cannot be undone."}
                          onClose={() => setIsConfirmStaffDeleteModalVisible(false)}
                          onConfirm={async () => {
                              const response = await deleteTimeOffTypeAPI(props.data.id);
                              if(response.data.other_message === "") {
                                  dispatch(loadTimeOffTypeFromDb());
                                  props.toastRef.current.show(response.data.message)
                              }
                              else {
                                  toastRef.current.show(response.data.other_message);
                              }
                              setIsConfirmStaffDeleteModalVisible(false);
                              props.onClose();
                          }}
                          onCancel={() => {
                              setIsConfirmStaffDeleteModalVisible(false);
                          }}

        />
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleMedium, styles.titleText]}>{props.edit ? "Edit Staff Time Off Type" : "Add Staff Time Off Type"}</Text>
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
            <View style={styles.radioButtonOuterContainer}>

                <TouchableRipple style={styles.radioButton} rippleColor={Colors.ripple} onPress={() => setCheckedState("leave")}>
                    <>
                    <RadioButton
                        value={checkedState}
                        status={checkedState === "leave" ? "checked" : "unchecked"}
                        color={Colors.highlight}
                        onPress={() => setCheckedState("leave")}

                    />
                    <Text style={[textTheme.bodyLarge, {marginLeft: 8}]}>Leave</Text>
                    </>
                </TouchableRipple>
                <TouchableRipple style={styles.radioButton} rippleColor={Colors.ripple} onPress={() => setCheckedState("permission")}>
                    <>
                    <RadioButton
                        value={checkedState}
                        status={checkedState === "permission" ? "checked" : "unchecked"}
                        color={Colors.highlight}
                        onPress={() =>  setCheckedState("permission")}
                    />
                    <Text style={[textTheme.bodyLarge, {marginLeft: 8}]}>Permission</Text>
                    </>
                </TouchableRipple>
            </View>
            <CustomTextInput
                label={checkedState + " reason"}
                required
                type={"text"}
                cursorColor={Colors.black}
                container={styles.textInput}
                value={reason}
                onChangeText={setReason}
                validator={() => {
                    if(reason === "" || reason === undefined || reason === null) {
                        return "reason is required";
                    }
                    else {
                        return true
                    }
                }}
                onSave={(callback) => {
                    reasonRef.current = callback;
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
        paddingHorizontal: 12
    },
    radioButtonOuterContainer: {
        flexDirection: "row",
        alignSelf: 'center',
        paddingHorizontal: 32,
        marginTop: 16
    },
    radioButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",

    },
    textInput: {
        marginTop: 18
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