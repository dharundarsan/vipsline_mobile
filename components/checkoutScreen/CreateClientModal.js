import {Modal, ScrollView, StyleSheet, Text, View, ToastAndroid, Platform} from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import React, {useState, useRef, useEffect} from "react";
import DropdownModal from "../../ui/DropdownModal";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import createNewClientAPI from "../../util/apis/createNewClientAPI";
import {formatDate} from "../../util/Helpers";
import {useDispatch} from "react-redux";
import {loadClientCountFromDb} from "../../store/clientSlice";

const CreateClientModal = (props) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState(["+91", ""]);
    const [secondaryNo, setSecondaryNo] = useState(["+91", ""]);
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [clientSource, setClientSource] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [clientNotes, setClientNotes] = useState("")
    const [clientAddress, setClientAddress] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(Date.now());
    const [anniversaryDate, setAnniversaryDate] = useState(Date.now());
    const [isDobSelected, setIsDobSelected] = useState(false);
    const [isAnniversarySelected, setIsAnniversarySelected] = useState(false);

    const dispatch = useDispatch();

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const phoneNoRef = useRef(null);
    const emailRef = useRef(null);

    const clearForm = () => {
        setFirstName("");
        setLastName("");
        setPhoneNo(["+91", ""]);
        setSecondaryNo(["+91", ""]);
        setEmail("");
        setGender("")
        setGstNo("")
        setClientNotes("")
        setIsAnniversarySelected(false);
        setIsDobSelected(false);
        setAnniversaryDate(Date.now());
        setDateOfBirth(Date.now());
        setClientSource("");
        setClientAddress("");
    }

    useEffect(() => {
        clearForm();
    }, [props.isVisible]);

    const handleSave = async () => {
        const firstNameValid = firstNameRef.current();
        const lastNameValid = lastNameRef.current();
        const phoneNoValid = phoneNoRef.current();
        const emailValid = emailRef.current();

        if (!firstNameValid || !lastNameValid || !phoneNoValid || !emailValid) return;
        try {
            await createNewClientAPI({
                address: clientAddress,
                anniversary: isAnniversarySelected ? formatDate(anniversaryDate, "yyyy-dd-mm") : "",
                businessId: process.env.EXPO_PUBLIC_BUSINESS_ID,
                city: "",
                clientNotes: clientNotes,
                clientSource: clientSource,
                country: "India",
                countryCode: phoneNo[0],
                custGst: gstNo,
                dob: isDobSelected ? formatDate(dateOfBirth, "yyyy-dd-mm") : "",
                email: email,
                firstName: firstName,
                gender: gender,
                lastName: lastName,
                mobile_1: phoneNo[1],
                mobile_2: secondaryNo[1],
                pinCode: "",
                state: "Tamilnadu",
            });
            ToastAndroid.show("User added Successfully", ToastAndroid.LONG)
            clearForm();
            dispatch(loadClientCountFromDb());
            props.onCloseModal();
        } catch (e) {
            ToastAndroid.show(e, ToastAndroid.LONG)
        }

    };

    return (
        <Modal visible={props.isVisible} style={styles.createClientModal} animationType={"slide"} >
            <View style={styles.closeAndHeadingContainer}>
                <Text style={[textTheme.titleLarge, styles.titleText]}>Add a new client</Text>
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
                    <Text style={[textTheme.bodyMedium, styles.headingText]}>Basic Information</Text>
                    <CustomTextInput
                        type="text"
                        label="First name"
                        placeholder="Enter client's first name"
                        value={firstName}
                        onChangeText={setFirstName}
                        validator={(text) => {
                            if (text.length === 0) return "First name is required";
                            else return true;
                        }}
                        onSave={(callback) => {
                            firstNameRef.current = callback;
                        }}
                    />
                    <CustomTextInput
                        type="text"
                        label="Last name"
                        placeholder="Enter client's last name"
                        value={lastName}
                        onChangeText={setLastName}
                        validator={(text) => {
                            if (text.length === 0) return "Last name is required";
                            else return true;
                        }}
                        onSave={(callback) => {
                            lastNameRef.current = callback;
                        }}
                    />
                    <CustomTextInput
                        type="phoneNo"
                        label="Mobile"
                        placeholder="0123456789"
                        value={phoneNo[1]}
                        onChangeText={setPhoneNo}
                        validator={(text) => {
                            if (text.length !== 10) return "Phone number is invalid";
                            else return true;
                        }}
                        onSave={(callback) => {
                            phoneNoRef.current = callback;
                        }}
                    />
                    <CustomTextInput
                        type="email"
                        label="Email address"
                        placeholder="Enter email address"
                        value={email}
                        onChangeText={setEmail}
                        validator={(text) => {
                            if (!text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return "Email is invalid";
                            else return true;
                        }}
                        onSave={(callback) => {
                            emailRef.current = callback;
                        }}
                    />
                    <CustomTextInput
                        type="dropdown"
                        label="Gender"
                        value={gender}
                        onChangeValue={setGender}
                        dropdownItems={["Male", "Female", "Others"]}
                    />
                    <CustomTextInput
                        type="dropdown"
                        label="Client source"
                        value={clientSource}
                        onChangeValue={setClientSource}
                        dropdownItems={["Justdial", "Google", "Facebook", "Instagram", "SMS Campaign", "Walk-in", "Membership", "Others"]}
                    />
                    <CustomTextInput
                        type="date"
                        label="Date of birth"
                        value={new Date(dateOfBirth)}
                        onChange={(value) => {
                            setIsDobSelected(true);
                            setDateOfBirth(value);
                        }}
                    />
                    <CustomTextInput
                        type="date"
                        label="Anniversary"
                        value={new Date(anniversaryDate)}
                        onChange={(value) => {
                            setIsAnniversarySelected(true);
                            setAnniversaryDate(value);
                        }}
                    />
                    <Text style={[textTheme.bodyMedium, styles.headingText]}>Additional Infomation</Text>
                    <CustomTextInput
                        type="text"
                        label="GST number"
                        placeholder="Enter client's GSTIN"
                        value={gstNo}
                        onChangeText={setGstNo}
                    />
                    <CustomTextInput
                        type="phoneNo"
                        label="Secondary Number"
                        placeholder="0123456789"
                        value={secondaryNo[1]}
                        onChangeText={setSecondaryNo}
                    />
                    <CustomTextInput
                        type="multiLine"
                        label="Client notes"
                        placeholder="Enter Notes"
                        value={clientNotes}
                        onChangeText={setClientNotes}
                    />
                    <CustomTextInput
                        type="multiLine"
                        label="Client address"
                        placeholder="Enter client address details"
                        value={clientAddress}
                        onChangeText={setClientAddress}
                    />
                </View>
            </ScrollView>
            <View style={styles.saveButtonContainer}>
                <PrimaryButton label={"Save"} onPress={handleSave}/>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    createClientModal: {
        flex: 1,
    },
    closeAndHeadingContainer: {
        marginTop: Platform.OS === "ios" ? 40 : 0,
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
    headingText: {
        fontWeight: "bold",
        marginVertical: 25,
    },
    saveButtonContainer: {
        padding: 20,
        borderTopColor: Colors.grey500,
        borderTopWidth: 1,
    },
});

export default CreateClientModal;
