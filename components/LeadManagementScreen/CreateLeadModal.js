import {KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useEffect, useRef, useState} from "react";
import CustomTextInput from "../../ui/CustomTextInput";
import {useDispatch, useSelector} from "react-redux";
import createLeadAPI from "../../util/apis/createLeadAPI";
import {formatDate, formatTime} from "../../util/Helpers";
import moment from "moment";
import editLeadAPI from "../../util/apis/editLeadAPI";
import {loadLeadsFromDb} from "../../store/leadManagementSlice";

const CreateLeadModal = (props) => {
    const leadSources = useSelector(state => state.leads.leadSources);
    const staffs = useSelector((state) => state.staff.staffs);

    const [firstName, setFirstName] = useState(props.edit ? props.data.fname : "")
    const [lastName, setLastName] = useState(props.edit ? props.data.lname : "")
    const [phoneNo, setPhoneNo] = useState(props.edit ? ["+91", props.data.mobile] : ["+91", ""]);
    const [email, setEmail] = useState(props.edit ? props.data.email : "");
    const [leadDate, setLeadDate] = useState(props.edit ? moment(props.data.lead_date, "DD MMM, YYYY").toDate() : new Date())
    const [nextFollowUpDate, setNextFollowUpDate] = useState(props.edit ? moment(props.data.followup_date, "DD MMM, YYYY").toDate() : null)
    const [enquiryDetails, setEnquiryDetails] = useState("")
    const [leadStatus, setLeadStatus] = useState("New")
    const [followUpTime, setFollowUpTime] = useState();
    const [gender, setGender] = useState(props.edit ? props.data.gender : "");
    const [leadSource, setLeadSource] = useState(props.edit ? leadSources.filter(source => source.id.toString() === (props.data?.lead_source?.toString()))[0]?.name : "")
    const [leadCampaign, setLeadCampaign] = useState("")
    const [leadOwner, setLeadOwner] = useState(props.edit ? staffs.filter(staff => staff.name === props.data.lead_owner)[0] : "")
    const [address, setAddress] = useState(props.edit ? props.data.address : "")
    const [location, setLocation] = useState(props.edit ? props.data.location : "")
    const [pincode, setPincode] = useState(props.edit ? props.data.pincode : "")
    const [view, setView] = useState("smart");
    const dispatch = useDispatch();

    const firstNameRef = useRef(null);
    const phoneNoRef = useRef(null);
    const followUpTimeRef = useRef(null);
    const followUpDateRef = useRef(null)

    // useEffect(() => {
    //     setFirstName(props.data.fname)
    //     setLastName(props.data.lname)
    //     setPhoneNo(["+91", props.data.mobile])
    //     setEmail(props.data.email)
    //     setLeadDate(moment(props.data.lead_date, "DD MMM, YYYY").toDate())
    //     setNextFollowUpDate(moment(props.data.followup_date, "DD MMM, YYYY").toDate())
    //     setGender(props.data.gender)
    //     setLeadSource(leadSources.filter(source => source.id.toString() === (props.data?.lead_source?.toString()))[0]?.name)
    //     setLeadOwner(staffs.filter(staff => staff.name === props.data.lead_owner)[0])
    //     setAddress(props.data.address)
    //     setLocation(props.data.location)
    //     setPincode(props.data.pincode)
    // }, [props.isVisible, props.data]);

    const handleSave = async () => {
        const firstNameValid = firstNameRef.current();
        const phoneNoValid = phoneNoRef.current();
        const followUpTimeValid = followUpTimeRef.current();
        const followUpDateValid = followUpDateRef.current();
        if (!firstNameValid && !phoneNoValid && !followUpDateValid && !followUpTimeValid) {
            return;
        }
        await createLeadAPI({
            address: address,
            email: email,
            fname: firstName,
            followup_date: formatDate(nextFollowUpDate, "yyyy-mm-dd"),
            followup_time: formatTime(followUpTime, "hh:mm:ss"),
            gender: gender,
            lead_campaign_source_id: 0,
            lead_owner: "",
            lead_status: leadStatus,
            leads_source: leadSource,
            lname: lastName,
            location: location,
            mobile: phoneNo[1],
            notes: enquiryDetails,
            pincode: pincode,
            resource_id: staffs.filter(staff => leadOwner.name === staff.name)[0].id,
        })

        await dispatch(loadLeadsFromDb());
        props.onCloseModal();
    }

    const handleEdit = async () => {
        const firstNameValid = firstNameRef.current();
        const phoneNoValid = phoneNoRef.current();
        if (!firstNameValid && !phoneNoValid) {
            return;
        }
        await editLeadAPI({
            address: address,
            email: email ? email : "",
            fname: firstName,
            gender: gender,
            lead_campaign_source_id: 0,
            leads_id: props.data.lead_id,
            leads_source: leadSources.filter(source => source.name === leadSource)[0].id,
            lname: lastName,
            location: location,
            mobile: phoneNo[1],
            pincode: pincode,
            resource_id: staffs.filter(staff => leadOwner.name === staff.name)[0].id,
        })
        await dispatch(loadLeadsFromDb());
        props.refreshData();
        props.onCloseModal();
    }


    return <Modal style={styles.createLeadModal} visible={props.isVisible} animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>{props.edit ? "Edit Lead" : "Create Lead"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <ScrollView>
            <View style={styles.modalContent}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>Lead
                        Information</Text>
                </View>
                <CustomTextInput placeholder={"Enter Client's First Name"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={firstName}
                                 label={"First Name"}
                                 onChangeText={setFirstName}
                                 validator={(text) => {
                                     if (text === null || text === undefined || text.trim().length === 0) {
                                         setFirstName("");
                                         return "First name is required"
                                     } else return true;
                                 }}
                                 onSave={(callback) => {
                                     firstNameRef.current = callback;
                                 }}
                                 type={"text"}/>
                <CustomTextInput placeholder={"Enter Client's Last Name"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={lastName}
                                 label={"Last Name"}
                                 onChangeText={setLastName}
                                 type={"text"}/>
                <CustomTextInput placeholder={"1234567890"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 label={"Mobile"}
                                 value={phoneNo[1]}
                                 onChangeText={setPhoneNo}
                                 validator={(text) => {
                                     if (text === null || text === undefined || text.length !== 10) return "Phone number is invalid";
                                     else return true;
                                 }}
                                 onSave={(callback) => {
                                     phoneNoRef.current = callback;
                                 }}
                                 type={"phoneNo"}/>
                <CustomTextInput placeholder={"Enter Email Address"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 label={"Email"}
                                 value={email}
                                 onChangeText={setEmail}
                                 type={"email"}/>
                {(view === "all" || props.edit) && <>
                    <CustomTextInput type="dropdown"
                                     label="Gender"
                                     labelTextStyle={{fontWeight: "700"}}
                                     value={gender}
                                     onChangeValue={setGender}
                                     dropdownItems={["Male", "Female", "Others"]}/>
                    <CustomTextInput type="dropdown"
                                     label="Lead Source"
                                     labelTextStyle={{fontWeight: "700"}}
                                     value={leadSource}
                                     onChangeValue={setLeadSource}
                                     dropdownItems={["Walk-in", "Referral", "Facebook", "Website", "Phone enquiry", "Walk-in", "Google", "Instagram", "Others"]}/>
                    <CustomTextInput type="dropdown"
                                     label="Campaign"
                                     labelTextStyle={{fontWeight: "700"}}
                                     value={leadCampaign}
                                     onChangeValue={setLeadCampaign}
                                     dropdownItems={[]}/>
                    <CustomTextInput type="dropdown"
                                     label="Lead Owner"
                                     labelTextStyle={{fontWeight: "700"}}
                                     value={leadOwner}
                                     onChangeValue={setLeadOwner}
                                     object={true}
                                     objectName="name"
                                     dropdownItems={staffs}/>
                    <View style={styles.sectionTitleContainer}>
                        <Text style={styles.sectionTitleText}>Address
                            Information</Text>
                    </View>
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="multiLine"
                        label="Address Details"
                        placeholder="Enter client address details"
                        value={address}
                        onChangeText={setAddress}
                    />
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="text"
                        label="Location"
                        placeholder="Enter Location"
                        value={location}
                        onChangeText={setLocation}
                    />
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="text"
                        label="Enter pincode"
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChangeText={setPincode}
                    />
                </>}
                {!props.edit && <>
                    <View style={styles.sectionTitleContainer}><Text style={styles.sectionTitleText}>Lead Follow-up
                        Details</Text></View>
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="date"
                        label="Lead Date"
                        value={leadDate === null || leadDate === undefined ? null : new Date(leadDate)}
                        onChangeValue={(value) => {
                            setLeadDate(value)
                        }}
                    />
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="multiLine"
                        label="Enquiry Details"
                        placeholder="Enter Client's Enquiry Details"
                        value={enquiryDetails}
                        onChangeText={setEnquiryDetails}
                    />
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="dropdown"
                        label="Lead Status"
                        value={leadStatus}
                        onChangeValue={setLeadStatus}
                        dropdownItems={useSelector(state => state.leads.leadStatuses).map(status => status.name)}
                    />
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="date"
                        minimumDate={new Date()}
                        label="Next Follow up Date"
                        value={nextFollowUpDate === null || nextFollowUpDate === undefined ? null : new Date(nextFollowUpDate)}
                        onChangeValue={(value) => {
                            setNextFollowUpDate(value);
                        }}
                        validator={(date) => {
                            if (date === null || date === undefined) return "Follow Date is required";
                            else return true;
                        }}
                        onSave={(callback) => {
                            followUpDateRef.current = callback;
                        }}
                    />
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="time"
                        label="Follow up time"
                        value={followUpTime}
                        onChangeValue={setFollowUpTime}
                        validator={(date) => {
                            if (date === null || date === undefined) return "Follow up time is required";
                            else return true;
                        }}
                        onSave={(callback) => {
                            followUpTimeRef.current = callback;
                        }}
                    />
                    <Pressable style={styles.fieldToggle} onPress={() => {
                        setView(prev => {
                            if (prev === "smart") return "all"
                            else return "smart"
                        })
                    }}>
                        <Text
                            style={styles.fieldToggleText}>{view === "smart" ? "Show all fields" : "Switch to smart view"}</Text>
                    </Pressable>
                </>}
            </View>
        </ScrollView>
        <KeyboardAvoidingView>
            <View style={styles.saveButtonContainer}>
                <PrimaryButton onPress={props.edit ? handleEdit : handleSave} label="Save"/>
            </View>
        </KeyboardAvoidingView>
    </Modal>
}

const styles = StyleSheet.create({
    createLeadModal: {
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
    sectionTitleContainer: {
        marginBottom: 10,
        marginHorizontal: -20,
        backgroundColor: "#F8F8FB",
        paddingVertical: 5,
        paddingHorizontal: 13,
    },
    sectionTitleText: {
        fontWeight: "bold",
        fontSize: 16
    },
    fieldToggle: {
        backgroundColor: "#F8F8FB",
        paddingVertical: 8,
        alignItems: "center",
        marginBottom: 30,
        marginHorizontal: -20,
    },
    fieldToggleText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Colors.highlight,
    },
    saveButtonContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.grey300,
    }

})

export default CreateLeadModal