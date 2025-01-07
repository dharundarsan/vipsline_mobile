import {KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import CustomTextInput from "../../ui/CustomTextInput";
import {useDispatch, useSelector} from "react-redux";
import createLeadAPI from "../../apis/leadManagementAPIs/createLeadAPI";
import {formatDate, formatTime} from "../../util/Helpers";
import moment from "moment";
import editLeadAPI from "../../apis/leadManagementAPIs/editLeadAPI";
import {loadLeadsFromDb} from "../../store/leadManagementSlice";
import Toast from "../../ui/Toast";
import getLeadCampaignsAPI from "../../apis/leadManagementAPIs/getLeadCampaignsAPI";
import deleteLeadAPI from "../../apis/leadManagementAPIs/deleteLeadAPI";
import {useNavigation} from "@react-navigation/native";
import {updateNavigationState} from "../../store/NavigationSlice";
import MiniActionTextModal from "../checkoutScreen/MiniActionTextModal";
import ConfirmDeleteLeadModal from "./ConfirmDeleteLeadModal";
import BottomActionCard from "../../ui/BottomActionCard";

const CreateLeadModal = (props) => {
    const leadSources = useSelector(state => state.leads.leadSources);
    const staffs = useSelector((state) => state.staff.staffs);
    const [campaignList, setCampaignList] = useState([])

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
    const [leadSource, setLeadSource] = useState(props.edit ? (props.data.lead_source === "" || props.data.lead_source === null) ? "" : leadSources.filter(source => source.id.toString() === (props.data?.lead_source?.toString()))[0] : "")
    const [leadCampaign, setLeadCampaign] = useState(props.edit ? (props.data.lead_campaign_id === "" || props.data.lead_campaign_id === null) ? "" : campaignList.filter(campaign => campaign.lead_campaign_source_id === props.data.lead_campaign_id)[0] : "");
    const [leadOwner, setLeadOwner] = useState(props.edit ? (props.data.lead_owner === "" || props.data.lead_owner === null) ? "" : staffs.filter(staff => staff.name === props.data.lead_owner)[0] : "")
    const [address, setAddress] = useState(props.edit ? props.data.address : "")
    const [location, setLocation] = useState(props.edit ? props.data.location : "")
    const [pincode, setPincode] = useState(props.edit ? props.data.pincode : "")
    const [view, setView] = useState("smart");
    const dispatch = useDispatch();

    const [isConfirmLeadDeleteModalVisible, setIsConfirmLeadDeleteModalVisible] = useState(false);

    const firstNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNoRef = useRef(null);
    const followUpTimeRef = useRef(null);
    const followUpDateRef = useRef(null)
    const scrollViewRef = useRef(null);

    const navigation = useNavigation();


    useLayoutEffect(() => {
        setLeadCampaign("");
        const api = async () => {
            const response = await getLeadCampaignsAPI((leadSource === null || leadSource === "") ? 0 : leadSource.id)
            setCampaignList(response.data.data);
            setLeadCampaign(props.edit ? (props.data.lead_campaign_id === "" || props.data.lead_campaign_id === null) ? "" : response.data.data.filter(campaign => campaign.lead_campaign_source_id === props.data.lead_campaign_id)[0] : "")
        }
        api();
    }, [leadSource]);


    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({y: 0, animated: true});
        }
    }, [view]);

    const handleSave = async () => {
        const firstNameValid = firstNameRef.current();
        const phoneNoValid = phoneNoRef.current();
        const followUpTimeValid = followUpTimeRef.current();
        const followUpDateValid = followUpDateRef.current();
        if (!firstNameValid || !phoneNoValid || !followUpDateValid || !followUpTimeValid) {
            return;
        }
        if (!(email === undefined || email === null || email === "")) {
            const emailIsValid = emailRef.current();
            if (!emailIsValid) {
                return;
            }
        }
        try {
            await createLeadAPI({
                address: address,
                email: email,
                fname: firstName,
                followup_date: formatDate(nextFollowUpDate, "yyyy-mm-dd"),
                followup_time: formatTime(followUpTime, "hh:mm:ss"),
                gender: gender,
                lead_campaign_source_id: (leadCampaign === null || leadCampaign === "") ? 0 : leadCampaign.lead_campaign_source_id,
                lead_owner: "",
                lead_status: leadStatus,
                leads_source: (leadCampaign === undefined || leadSource === null || leadSource === "") ? "" : leadSource.name,
                lname: lastName,
                location: location,
                mobile: phoneNo[1],
                notes: enquiryDetails,
                pincode: pincode,
                resource_id: leadOwner === null || leadOwner === "" ? "" : leadOwner.id,
            })
            await dispatch(loadLeadsFromDb());
            props.leadManagementToastRef.current.show("Lead Added Successfully");
            props.onCloseModal();
        } catch (e) {
            toastRef.current.show(e.data.other_message);
        }

    }

    const handleEdit = async () => {
        const firstNameValid = firstNameRef.current();
        const phoneNoValid = phoneNoRef.current();
        if (!firstNameValid || !phoneNoValid) {
            return;
        }
        if (!(email === undefined || email === null || email === "")) {
            const emailIsValid = emailRef.current();
            if (!emailIsValid) {
                return;
            }
        }
        await editLeadAPI({
            address: address,
            email: email ? email : "",
            fname: firstName,
            gender: gender,
            lead_campaign_source_id: (leadCampaign === undefined || leadCampaign === null || leadCampaign === "") ? 0 : leadCampaign.lead_campaign_source_id,
            leads_id: props.data.lead_id,
            leads_source: (leadSource === null || leadSource === "") ? "" : leadSource.id,
            lname: lastName,
            location: location,
            mobile: phoneNo[1],
            pincode: pincode,
            resource_id: (leadOwner === null || leadOwner === "") ? "" : staffs.filter(staff => leadOwner.name === staff.name)[0].id,
        })
        await dispatch(loadLeadsFromDb());
        props.refreshData();
        props.leadProfileToastRef.current.show("Lead Updated");
        props.onCloseModal();
    }

    return <Modal style={styles.createLeadModal} visible={props.isVisible} animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        <BottomActionCard isVisible={isConfirmLeadDeleteModalVisible}
                          header={"Delete Lead"}
                          content={"Are you sure you want to delete this lead?"}
                          onClose={() => setIsConfirmLeadDeleteModalVisible(false)}
                          onConfirm={async () => {
                              await deleteLeadAPI(props.data.lead_id);
                              await dispatch(loadLeadsFromDb());
                              setIsConfirmLeadDeleteModalVisible(false);
                              dispatch(updateNavigationState("Lead Management Screen"));
                              props.leadManagementToastRef.current.show("Lead Deleted Successfully");
                              props.onCloseModal()
                              props.refreshData()
                              navigation.goBack();
                          }}
                          onCancel={() => {
                              setIsConfirmLeadDeleteModalVisible(false);
                          }}/>
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
        <ScrollView ref={scrollViewRef}>
            <View style={styles.modalContent}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>Lead
                        Information</Text>
                </View>
                <CustomTextInput placeholder={"Enter Client's First Name"}
                                 labelTextStyle={{fontWeight: "700"}}
                                 value={firstName}
                                 label={"First Name"}
                                 required
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
                                 required
                                 labelTextStyle={{fontWeight: "700"}}
                                 label={"Mobile"}
                                 value={phoneNo[1]}
                                 onChangeText={setPhoneNo}
                                 validator={(text) => {
                                     if (text === null || text === undefined || text.trim() === "") return "Phone number is required";
                                     else if (text.length !== 10) return "Phone number is invalid";
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
                                 validator={(text) => (text === null || text === undefined || text.trim() === "") ? true : !text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ? "Email is Invalid" : true}
                                 onSave={(callback) => {
                                     emailRef.current = callback;
                                 }}
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
                                     object
                                     objectName={"name"}
                                     onChangeValue={setLeadSource}
                                     dropdownItems={leadSources}/>
                    <CustomTextInput type="dropdown"
                                     label="Campaign"
                                     labelTextStyle={{fontWeight: "700"}}
                                     value={leadCampaign}
                                     onChangeValue={setLeadCampaign}
                                     object
                                     objectName={"name"}
                                     dropdownItems={campaignList}/>
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
                        type="dropdown"
                        label="Lead Status"
                        value={leadStatus}
                        onChangeValue={setLeadStatus}
                        dropdownItems={useSelector(state => state.leads.leadStatuses).map(status => status.name)}
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
                        type="date"
                        required
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
                        required
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
                {props.edit ? <PrimaryButton onPress={async () => {
                    setIsConfirmLeadDeleteModalVisible(true);
                }}
                                             buttonStyle={{
                                                 backgroundColor: "white",
                                                 borderWidth: 1,
                                                 borderColor: Colors.grey400
                                             }}
                                             pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>
                    <MaterialIcons name="delete-outline" size={28} color={Colors.error}/>
                </PrimaryButton> : null}
                <PrimaryButton onPress={props.edit ? handleEdit : handleSave} label="Save" buttonStyle={{flex: 1}}/>
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
        paddingVertical: 10,
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
        flexDirection: "row",
        gap: 12,
    }

})

export default CreateLeadModal