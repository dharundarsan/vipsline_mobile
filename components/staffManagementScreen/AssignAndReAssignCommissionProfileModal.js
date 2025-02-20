import {Modal, ScrollView, Text, View, StyleSheet} from "react-native";
import Toast from "../../ui/Toast";
import BottomActionCard from "../../ui/BottomActionCard";
import deleteStaffCommissionAPI from "../../apis/staffManagementAPIs/deleteStaffCommissionAPI";
import {getListOfCommissionProfile, loadStaffsFromDB} from "../../store/staffSlice";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {Divider} from "react-native-paper";
import React, {useEffect, useRef, useState} from "react";
import Colors from "../../constants/Colors";
import CustomTextInput from "../../ui/CustomTextInput";
import {useDispatch, useSelector} from "react-redux";
import updateCommissionProfileMappingAPI from "../../apis/staffManagementAPIs/updateCommissionProfileMappingAPI";

export default function AssignAndReAssignCommissionProfileModal(props) {

    const dispatch = useDispatch();

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState(false);
    const toastRef = useRef(null);
    const [profileName, setProfileName] = useState(props.edit ? props.data.profile : "");
    const [commissionId, setCommissionId] = useState("");

    const dropdownRef = useRef(null);

    useEffect(() => {
        const commission_id = props.profiles.find((item) => item.profile_name === profileName)?.id;
        setCommissionId(commission_id);
    }, []);




    async function onEdit() {
        const dropdownRefValid = dropdownRef.current();

        if (!dropdownRefValid) {
            return;
        }

        const response = await updateCommissionProfileMappingAPI(props.data.resource_id, props.data.id)

        if(response.data.other_message === null || response.data.other_message === "") {
            props.toastRef.current.show(response.data.message);
            props.onClose();
            dispatch(loadStaffsFromDB());
            dispatch(getListOfCommissionProfile());
        }
        else {
            toastRef.current.show(response.data.other_message);
        }

    }
    async function onSave() {
        const dropdownRefValid = dropdownRef.current();

        if (!dropdownRefValid) {
            return;
        }

        const response = await updateCommissionProfileMappingAPI(props.data.resource_id, commissionId)

        if(response.data.other_message === null || response.data.other_message === "") {
            if(response.data.message === "Resource updated") {
                props.toastRef.current.show("Commission profile mapped successfully.");
            }
            props.onClose();
            props.setToggle(prevState => !prevState);
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
                              header={"Delete Commission Profile"}
                              content={"Are you sure? This action cannot be undone."}
                              onClose={() => setIsConfirmStaffDeleteModalVisible(false)}
                              onConfirm={async () => {
                                  const response = await updateCommissionProfileMappingAPI(props.data.resource_id, null)

                                  if(response.data.other_message === null || response.data.other_message === "") {
                                      if(response.data.message === "Resource updated") {
                                          props.toastRef.current.show("Commission profile deleted.");
                                      }
                                      props.onClose();
                                      props.setToggle(prevState => !prevState);
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
            <Text style={[textTheme.titleLarge, styles.titleText]}>{props.edit ? "Re-Assign Commission Profile" : "Assign Commission Profile"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    props.onClose();
                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>

        <ScrollView
            style={styles.modalContent}
        >
            <CustomTextInput
                type={"dropdown"}
                label={"Profile name"}
                dropdownItems={props.profiles.map((item) => item.profile_name)}
                onChangeValue={(profile) => {
                    setProfileName(profile);
                    const commission_id = props.profiles.find((item) => item.profile_name === profile).id;
                    setCommissionId(commission_id);

                }}
                value={profileName}
                container={{marginTop: 32}}
                validator={(text) => {
                    if(text === null || text === "" || text === undefined) {
                        return "Profile Name is required";
                    }
                    else {
                        return true;
                    }
                }}
                onSave={(callback) => {
                    dropdownRef.current = callback;
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
                    </PrimaryButton>  : <></>
            }

            <PrimaryButton
                label={props.edit ? "Update" : "Create"}
                buttonStyle={styles.saveButton}
                onPress={onSave}
            />
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
        paddingHorizontal: 12,

    },
    bottomContainer: {
        paddingHorizontal: 16,
        flexDirection: "row",
        gap: 18,
        marginBottom: 12
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