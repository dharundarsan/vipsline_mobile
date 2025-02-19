import {
    KeyboardAvoidingView,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import Divider from "../../ui/Divider";
import React, {useEffect, useRef, useState} from "react";
import CustomTextInput from "../../ui/CustomTextInput";
import {useDispatch, useSelector} from "react-redux";
import {loadLeadsFromDb} from "../../store/leadManagementSlice";
import deleteLeadAPI from "../../apis/leadManagementAPIs/deleteLeadAPI";
import {useNavigation} from "@react-navigation/native";
import {updateNavigationState} from "../../store/NavigationSlice";
import BottomActionCard from "../../ui/BottomActionCard";
import CustomSwitch from "../../ui/CustomSwitch";
import {loadStaffsFromDB} from "../../store/staffSlice";
import createStaffAPI from "../../apis/staffManagementAPIs/createStaffAPI";
import Toast from "../../ui/Toast";
import {formatDate} from "../../util/Helpers";
import editLeadAPI from "../../apis/leadManagementAPIs/editLeadAPI";
import editStaff from "../../apis/leadManagementAPIs/editLeadAPI";
import * as SecureStore from "expo-secure-store";
import editStaffAPI from "../../apis/staffManagementAPIs/editStaffAPI";

const AddStaffModal = (props) => {
    // const staffs = useSelector((state) => state.staff.staffs);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState(props.edit ? props.data.name : "")
    const [lastName, setLastName] = useState("")
    const [phoneNo, setPhoneNo] = useState(props.edit ? ["+91", props.data.mobile] : ["+91", ""]);
    const [email, setEmail] = useState(props.edit ? props.data.email : "");

    const [gender, setGender] = useState(props.edit ? props.data.gender : "");

    const [staffTitle, setStaffTitle] = useState(props.edit ? props.data.title : "");
    const [startDate, setStartDate] = useState(props.edit ? props.data.start_date === "" ? null : props.data.start_date : new Date());
    const [endDate, setEndDate] = useState(props.edit ? props.data.termination_date === "" ? null : props.data.termination_date : null);


    const [calenderBookingSwitch, setCalenderBookingSwitch] = useState(props.edit ? props.data.calendar_bookings: false);
    const [loginAccessSwitch, setLoginAccessSwitch] = useState(props.edit ? props.data.login_access : false);

    const [view, setView] = useState("smart");

    const [isConfirmStaffDeleteModalVisible, setIsConfirmStaffDeleteModalVisible] = useState(false);

    const firstNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneNoRef = useRef(null);
    const scrollViewRef = useRef(null);

    const toastRef = useRef(null);




    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({y: 0, animated: true});
        }
    }, [view]);

    const handleSave = async () => {
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
        let response;
        try {
            response = await createStaffAPI({
                calendar_bookings: calenderBookingSwitch,
                description: "",
                email: email === "" && null,
                gender: gender,
                login_access: loginAccessSwitch,
                mobile: phoneNo[1],
                resource_name: firstName + " " + lastName,
                services: [],
                start_date: formatDate(startDate, "yyyy-mm-dd"),
                termination_date: endDate !== null ? formatDate(endDate, "yyyy-mm-dd") : "",
                title: staffTitle === "" && null,
            })
            dispatch(loadStaffsFromDB());
            props.toastRef.current.show("Staff Created Successfully");
            props.onClose();
        } catch (e) {
            toastRef.current.show(e?.data?.other_message ?? "Something went wrong");
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
        try {
            let response = await editStaffAPI({
                calendar_bookings: calenderBookingSwitch,
                description: "",
                email: email === "" ? null : email,
                gender: gender,
                login_access: loginAccessSwitch,
                mobile: phoneNo[1],
                name: firstName + " " + lastName,
                services: [],
                start_date: startDate === null || startDate === "" ? "" : formatDate(startDate, "yyyy-mm-dd"),
                termination_date: endDate === "" || endDate === null ? "" : formatDate(endDate, "yyyy-mm-dd"),
                title: staffTitle === "" ? "" : staffTitle,
                business_id: await SecureStore.getItemAsync('businessId'),
            }, props.data.id)


            if (response.data.other_message === "") {
                dispatch(loadStaffsFromDB());
                props.toastRef.current.show("Staff Edited Successfully");
                props.onClose();
            }
            else {
                toastRef.current.show(response.data.other_message);
            }

        }
        catch (e) {
            console.log("gbrtr");
            // toastRef.current.show(e.other_message);
        }

    }

    return <Modal style={styles.createLeadModal} visible={props.isVisible} animationType={"slide"}
                  presentationStyle={"pageSheet"}
                  onRequestClose={props.onClose}
    >
        <Toast
            ref={toastRef}
        />
        <BottomActionCard isVisible={isConfirmStaffDeleteModalVisible}
                          header={"Delete Staff"}
                          content={"Are you sure? This action cannot be undone."}
                          onClose={() => setIsConfirmStaffDeleteModalVisible(false)}
                          onConfirm={async () => {
                              await editStaffAPI({
                                  activation: "0",
                                  description: "test",
                                  status: "removed"
                              }, props.data.id);
                              setIsConfirmStaffDeleteModalVisible(false);
                              dispatch(updateNavigationState("Staff Management Screen"));
                              dispatch(loadStaffsFromDB());
                              navigation.navigate("Staff List");
                              props.onClose();
                          }}
                          onCancel={() => {
                              setIsConfirmStaffDeleteModalVisible(false);
                          }}

        />

        <View style={styles.closeAndHeadingContainer}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>{props.edit ? "Edit Staff Member" : "New Staff Member"}</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onClose}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <ScrollView ref={scrollViewRef}>
            <View style={styles.modalContent}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitleText}>Basic Info</Text>
                </View>
                <CustomTextInput placeholder={"Enter Staff's First Name"}
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

                {(view === "all") && <>
                    <CustomTextInput placeholder={"Add Staff Title"}
                                     labelTextStyle={{fontWeight: "700"}}
                                     label={"Staff Title"}
                                     value={staffTitle}
                                     onChangeText={setStaffTitle}
                                     type={"text"}/>
                    <CustomTextInput type="dropdown"
                                     label="Gender"
                                     labelTextStyle={{fontWeight: "700"}}
                                     value={gender}
                                     onChangeValue={setGender}
                                     dropdownItems={["Male", "Female", "Others"]}/>
                    <View style={styles.sectionTitleContainer}><Text style={styles.sectionTitleText}>Employment</Text></View>
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="date"
                        label="Start Date"
                        value={startDate === null || startDate === undefined ? null : new Date(startDate)}
                        onChangeValue={(value) => {
                            setStartDate(value)
                        }}
                    />
                    <CustomTextInput
                        labelTextStyle={{fontWeight: "700"}}
                        type="date"
                        label="End Date"
                        value={endDate === null || endDate === undefined ? null : new Date(endDate)}
                        onChangeValue={(value) => {
                            setEndDate(value)
                        }}
                    />
                    <View>

                        <Text style={[textTheme.titleMedium]}>
                            Settings
                        </Text>
                    </View>
                    <View style={{gap: 18, marginTop: 18}}>
                        <View style={{ flexDirection: 'row', }}>
                            <CustomSwitch
                                isOn={calenderBookingSwitch}
                                onToggle={setCalenderBookingSwitch}
                                color={Colors.highlight}
                            />
                            <View style={{ marginLeft: 18, flex: 1 }}>
                                <Text style={[textTheme.bodyLarge]} numberOfLines={1} ellipsizeMode="tail">
                                    Allow calendar bookings
                                </Text>
                                <Text style={[textTheme.bodyMedium]}>
                                    Allow this team member to receive bookings on the calendar
                                </Text>
                            </View>
                        </View>


                        <View style={{flexDirection: 'row'}}>
                            <CustomSwitch
                                isOn={loginAccessSwitch}
                                onToggle={setLoginAccessSwitch}
                                color={Colors.highlight}
                            />
                            <View style={{ marginLeft: 18, flex: 1 }}>
                                <Text style={[textTheme.bodyLarge]} numberOfLines={1} ellipsizeMode="tail">
                                    Provide login access to this staff
                                </Text>
                                <Text style={[textTheme.bodyMedium]}>
                                    The default user name and password will be
                                    sent to staff’s email address
                                </Text>

                            </View>

                        </View>

                    </View>



                </>}

                    <Pressable style={styles.fieldToggle} onPress={() => {
                        setView(prev => {
                            if (prev === "smart") return "all"
                            else return "smart"
                        })
                    }}>
                        <Text
                            style={styles.fieldToggleText}>{view === "smart" ? "Show all fields" : "Switch to smart view"}</Text>
                    </Pressable>

            </View>
        </ScrollView>
        <KeyboardAvoidingView>
            <View style={styles.saveButtonContainer}>
                {props.edit ? <PrimaryButton onPress={async () => {
                    setIsConfirmStaffDeleteModalVisible(true);
                }}
                                             buttonStyle={{
                                                 backgroundColor: "white",
                                                 borderWidth: 1,
                                                 borderColor: Colors.grey400
                                             }}
                                             pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>
                    <MaterialIcons name="delete-outline" size={28} color={Colors.error}/>
                </PrimaryButton> : null}
                <PrimaryButton onPress={props.edit ? handleEdit : handleSave} label="Update" buttonStyle={{flex: 1}}/>
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
        marginVertical: 20
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
    },
    resendEmailButton: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        marginTop: 8
    },
    resendEmailButtonLabel: {
        color: Colors.highlight,

    },

})

export default AddStaffModal