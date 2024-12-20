import {KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import React, {useEffect, useRef, useState} from "react";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {formatDate, formatTime, shadowStyling} from "../../util/Helpers";
import {Divider} from "react-native-paper";
import CustomTextInput from "../../ui/CustomTextInput";
import {useDispatch, useSelector} from "react-redux";
import * as Haptics from "expo-haptics";
import {addCustomItems, updateCalculatedPrice, updateCustomItem} from "../../store/cartSlice";
import addEnquiryNotesAPI from "../../util/apis/addEnquiryNotesAPI";
import moment from "moment";
import editEnquiryNotesAPI from "../../util/apis/editEnquiryNotesAPI";
import {loadLeadsFromDb} from "../../store/leadManagementSlice";

const EnquiryNotesModal = (props) => {
    const leadStatuses = useSelector(state => state.leads.leadStatuses)
    const [date, setDate] = useState(props.edit ? moment(props.data.notes_date, "DD MMM YYYY").toDate() : new Date());
    const [leadStatus, setLeadStatus] = useState(props.edit ? props.data.lead_status : null);
    const [notes, setNotes] = useState(props.edit ? props.data.notes : "")
    const [nextFollowUpDate, setNextFollowUpDate] = useState(props.edit ? props.data.date ? moment(props.data.date, "DD MMM YYYY").toDate() : null : null);
    const [nextFollowUpTime, setNextFollowUpTime] = useState(props.edit ? props.data.time ? moment(props.data.time, "hh:mm A") : null : null);

    const leadStatusRef = useRef(null);
    const nextFollowUpDateRef = useRef(null);
    const nextFollowUpTimeRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (leadStatus === "Not interested" || leadStatus === "Unqualified" || leadStatus === "Converted") {
            setNextFollowUpTime(null)
            setNextFollowUpDate(null);
        } else {
            setNextFollowUpTime(props.edit ? props.data.time ? moment(props.data.time, "hh:mm A") : null : null)
            setNextFollowUpDate(props.edit ? props.data.date ? moment(props.data.date, "DD MMM YYYY").toDate() : null : null);
        }
    }, [leadStatus]);

    const staffs = useSelector((state) => state.staff.staffs);
    const addEnquiryNote = async () => {
        const leadStatusValid = leadStatusRef.current()
        let nextFollowUpDateValid;
        let nextFollowUpTimeValid;
        if (!(leadStatus === "Not interested" || leadStatus === "Unqualified" || leadStatus === "Converted")) {
            nextFollowUpDateValid = nextFollowUpDateRef.current()
            nextFollowUpTimeValid = nextFollowUpTimeRef.current()
        }

        if (!leadStatusValid) {
            return;
        }

        if (!(leadStatus === "Not interested" || leadStatus === "Unqualified" || leadStatus === "Converted")) {
            if (!nextFollowUpDateValid || !nextFollowUpTimeValid) {
                return;
            }
        }


        if (props.lead.lead_owner) {
            await addEnquiryNotesAPI(
                nextFollowUpTime,
                nextFollowUpDate,
                props.lead.lead_id,
                staffs.filter(staff => staff.name === props.lead.lead_owner)[0].id,
                leadStatus,
                notes)
        } else {
            await addEnquiryNotesAPI(
                nextFollowUpTime,
                nextFollowUpDate,
                props.lead.lead_id,
                "",
                leadStatus,
                notes)
        }

        await dispatch(loadLeadsFromDb());
        props.refreshLeadsData();
        props.onCloseModal();
    }

    const editEnquiryNote = async () => {
        const leadStatusValid = leadStatusRef.current()
        let nextFollowUpDateValid;
        let nextFollowUpTimeValid;
        if (!(leadStatus === "Not interested" || leadStatus === "Unqualified" || leadStatus === "Converted")) {
            nextFollowUpDateValid = nextFollowUpDateRef.current()
            nextFollowUpTimeValid = nextFollowUpTimeRef.current()
        }
        if (!leadStatusValid) {
            return;
        }
        if (!(leadStatus === "Not interested" || leadStatus === "Unqualified" || leadStatus === "Converted")) {
            if (!nextFollowUpDateValid || !nextFollowUpTimeValid) {
                return;
            }
        }
        if (props.lead.lead_owner) {
            await editEnquiryNotesAPI(
                new Date(nextFollowUpDate),
                new Date(nextFollowUpTime),
                props.lead.lead_id,
                staffs.filter(staff => staff.name === props.lead.lead_owner)[0].id,
                leadStatus,
                notes,
                props.data.lead_followup_id,
            )
        } else {
            await editEnquiryNotesAPI(
                new Date(nextFollowUpDate),
                new Date(nextFollowUpTime),
                props.lead.lead_id,
                "",
                leadStatus,
                notes,
                props.data.lead_followup_id,
            )
        }

        props.refreshLeadsData();
        await dispatch(loadLeadsFromDb());
        props.onCloseModal();
    }

    const deleteEnquiryNote = () => {

    }

    return <Modal style={styles.enquiryNotesModal}
                  visible={props.isVisible}
                  animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
            <Text
                style={[textTheme.titleLarge, styles.titleText]}>{props.edit ? "Edit Enquiry Notes" : "Add Enquiry Notes"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <View style={styles.headerLeadContainer}>
            <View style={styles.headerLeadProfile}>
                <Text style={{
                    color: Colors.highlight,
                    fontWeight: "bold",
                    fontSize: 20
                }}>{props.lead.name[0].toUpperCase()}</Text>
            </View>
            <View style={{justifyContent: "center", gap: 2}}>
                <Text style={[textTheme.labelLarge, {fontSize: 16}]}>{props.lead.name}</Text>
                <Text style={{fontWeight: "500", color: Colors.grey800}}>{props.lead.mobile}</Text>
            </View>
        </View>
        <Divider/>
        <ScrollView>
            <View style={styles.formContent}>
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="date"
                    label="Date"
                    readOnly={true}
                    value={date === null || date === undefined ? null : new Date(date)}
                    onChangeValue={(value) => {
                    }}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="dropdown"
                    label="Lead Status"
                    required
                    value={leadStatus}
                    onChangeValue={setLeadStatus}
                    dropdownItems={leadStatuses.map(status => status.name)}
                    validator={(leadStatus) => {
                        if (leadStatus === null || leadStatus === undefined) return "Lead Status is required";
                        else return true;
                    }}
                    onSave={(callback) => {
                        leadStatusRef.current = callback;
                    }}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    type="multiLine"
                    label="Notes"
                    placeholder="Enter Enquiry Notes"
                    value={notes}
                    onChangeText={setNotes}
                />

                <Text style={[{marginVertical: 10}, textTheme.titleMedium]}>Follow Up</Text>
                <CustomTextInput
                    required
                    labelTextStyle={{fontWeight: "700"}}
                    type="date"
                    minimumDate={new Date()}
                    readOnly={leadStatus === "Not interested" || leadStatus === "Unqualified" || leadStatus === "Converted"}
                    label="Next follow-up date"
                    value={nextFollowUpDate === null || nextFollowUpDate === undefined ? null : new Date(nextFollowUpDate)}
                    validator={(date) => {
                        if (date === null || date === undefined) return "Next Follow Up Date is required";
                        else return true;
                    }}
                    onSave={(callback) => {
                        nextFollowUpDateRef.current = callback;
                    }}
                    onChangeValue={(value) => {
                        setNextFollowUpDate(value)
                    }}
                />
                <CustomTextInput
                    required
                    labelTextStyle={{fontWeight: "700"}}
                    type="time"
                    readOnly={leadStatus === "Not interested" || leadStatus === "Unqualified" || leadStatus === "Converted"}
                    label="Next follow-up time"
                    value={nextFollowUpTime === null || nextFollowUpTime === undefined ? null : new Date(nextFollowUpTime)}
                    onChangeValue={(value) => {
                        setNextFollowUpTime(value)
                    }}
                    validator={(date) => {
                        if (date === null || date === undefined) return "Follow up time is required";
                        else return true;
                    }}
                    onSave={(callback) => {
                        nextFollowUpTimeRef.current = callback;
                    }}
                />
            </View>
        </ScrollView>
        <View style={styles.saveButtonContainer}>
            {/*<PrimaryButton onPress={props.edit ? editEnquiryNote : addEnquiryNote}*/}
            {/*               buttonStyle={{backgroundColor: "white", borderWidth: 1, borderColor: Colors.grey400}}*/}
            {/*               pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>*/}
            {/*    <MaterialIcons name="delete-outline" size={28} color={Colors.error}/>*/}
            {/*</PrimaryButton>*/}
            <PrimaryButton onPress={props.edit ? editEnquiryNote : addEnquiryNote} buttonStyle={{flex: 1}}
                           label={"Save"}/>
        </View>

    </Modal>
}

const styles = StyleSheet.create({
    enquiryNotesModal: {
        flex: 1,
    },
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
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    headerLeadContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 20,
        gap: 10,
    },
    headerLeadProfile: {
        width: 45,
        height: 45,
        backgroundColor: "#E2F4F6",
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    formContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    saveButtonContainer: {
        flexDirection: "row",
        gap: 20,
        borderColor: Colors.grey400,
        borderTopWidth: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,

    }
})

export default EnquiryNotesModal