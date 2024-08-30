import {Modal, ScrollView, StyleSheet, Text, View, ToastAndroid, Platform} from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import React, {useState, useRef, useEffect} from "react";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import {capitalizeFirstLetter, checkNullUndefined, formatDate} from "../../util/Helpers";
import {useDispatch, useSelector} from "react-redux";
import {loadClientCountFromDb} from "../../store/clientSlice";
import updateClientAPI from "../../util/apis/updateClientAPI";
import {loadClientInfoFromDb} from "../../store/clientInfoSlice";

const UpdateClientModal = (props) => {
    // const details = useSelector(state => state.clientInfo.details);
    const details = props.details;

    const [clientData, setClientData] = useState({
        firstName: details.firstName,
        lastName: "",
        phoneNo: ["+91", details.mobile_1],
        secondaryNo: ["+91", ""],
        email: "",
        gender: "",
        clientSource: "",
        gstNo: "",
        clientNotes: "",
        clientAddress: "",
        dateOfBirth: "",
        anniversaryDate: "",
        isDobSelected: false,
        isAnniversarySelected: false,
    });

    const dispatch = useDispatch();

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const phoneNoRef = useRef(null);
    const emailRef = useRef(null);


    const existingValues = () => {
        setClientData({
            firstName: details.firstName,
            lastName: details.lastName,
            phoneNo: ["+91", details.mobile_1],
            secondaryNo: ["+91", details.mobile_2],
            email: details.username,
            gender: checkNullUndefined(details.gender) && details.gender.trim().length !== 0 ?
                capitalizeFirstLetter(details.gender) : "",
            gstNo: details.customer_gst,
            clientNotes: details.client_notes,
            clientAddress: details.address,
            isDobSelected: false,
            isAnniversarySelected: false,
            anniversaryDate: details.anniversary,
            dateOfBirth: checkNullUndefined(details.dob) && details.dob.trim().length !== 0 ?
                new Date(details.dob) : Date.now(),
            clientSource: details.client_source,
        });
    };

    const clientId = useSelector(state => state.clientInfo.clientId);




    useEffect(() => {
        existingValues();
    }, [props.isVisible, details]);

    const handleUpdate = async () => {
        const firstNameValid = firstNameRef.current();
        const lastNameValid = lastNameRef.current();
        const phoneNoValid = phoneNoRef.current();
        const emailValid = emailRef.current();

        if (!firstNameValid || !lastNameValid || !phoneNoValid || !emailValid) return;
        try {
            await updateClientAPI(clientId, {
                address: clientData.clientAddress,
                anniversary: clientData.isAnniversarySelected ? formatDate(clientData.anniversaryDate, "yyyy-mm-dd") : "",
                businessId: process.env.EXPO_PUBLIC_BUSINESS_ID,
                city: "",
                clientNotes: clientData.clientNotes,
                clientSource: clientData.clientSource,
                country: "India",
                countryCode: clientData.phoneNo[0],
                custGst: clientData.gstNo,
                dob: clientData.isDobSelected ? formatDate(clientData.dateOfBirth, "yyyy-mm-dd") : "",
                username: clientData.email,
                firstName: clientData.firstName,
                gender: clientData.gender,
                lastName: clientData.lastName,
                mobile_1: clientData.phoneNo[1],
                mobile_2: clientData.secondaryNo[1],
                pinCode: "",
                state: "Tamilnadu",
            });
            dispatch(loadClientCountFromDb());
            dispatch(loadClientInfoFromDb(clientId));
            props.onCloseModal();
            ToastAndroid.show("User updated Successfully", ToastAndroid.LONG);
            // props.onUpdate();
        } catch (e) {
            console.log(e);
            ToastAndroid.show(e + "error", ToastAndroid.LONG);
        }
    };

    const handleChange = (field, value) => {
        setClientData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };


    return (
        <Modal visible={props.isVisible} style={styles.createClientModal} animationType={"slide"}>
            <View style={styles.closeAndHeadingContainer}>
                <Text style={[textTheme.titleLarge, styles.titleText]}>Edit client</Text>
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
                        value={clientData.firstName}
                        onChangeText={(value) => handleChange("firstName", value)}
                        validator={(text) => text.length === 0 ? "First name is required" : true}
                        onSave={(callback) => { firstNameRef.current = callback; }}
                    />
                    <CustomTextInput
                        type="text"
                        label="Last name"
                        placeholder="Enter client's last name"
                        value={clientData.lastName}
                        onChangeText={(value) => handleChange("lastName", value)}
                        validator={(text) => text.length === 0 ? "Last name is required" : true}
                        onSave={(callback) => { lastNameRef.current = callback; }}
                    />
                    <CustomTextInput
                        type="phoneNo"
                        label="Mobile"
                        placeholder="0123456789"
                        value={clientData.phoneNo[1]}
                        onChangeText={(value) => handleChange("phoneNo", [value[0], value[1]])}
                        validator={(text) => text.length !== 10 ? "Phone number is invalid" : true}
                        onSave={(callback) => { phoneNoRef.current = callback; }}
                    />
                    <CustomTextInput
                        type="email"
                        label="Email address"
                        placeholder="Enter email address"
                        value={clientData.email}
                        onChangeText={(value) => handleChange("email", value)}
                        validator={(text) => !text.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ? "Email is invalid" : true}
                        onSave={(callback) => { emailRef.current = callback; }}
                    />
                    <CustomTextInput
                        type="dropdown"
                        label="Gender"
                        value={clientData.gender}
                        onChangeValue={(value) => handleChange("gender", value)}
                        dropdownItems={["Male", "Female", "Others"]}
                    />
                    <CustomTextInput
                        type="dropdown"
                        label="Client source"
                        value={clientData.clientSource}
                        onChangeValue={(value) => handleChange("clientSource", value)}
                        dropdownItems={["Justdial", "Google", "Facebook", "Instagram", "SMS Campaign", "Walk-in", "Membership", "Others"]}
                    />
                    <CustomTextInput
                        type="date"
                        label="Date of birth"
                        value={new Date(clientData.dateOfBirth)}
                        onChange={(value) => {
                            handleChange("isDobSelected", true);
                            handleChange("dateOfBirth", value);
                        }}
                    />
                    <CustomTextInput
                        type="date"
                        label="Anniversary"
                        value={new Date(clientData.anniversaryDate)}
                        onChange={(value) => {
                            handleChange("isAnniversarySelected", true);
                            handleChange("anniversaryDate", value);
                        }}
                    />
                    <Text style={[textTheme.bodyMedium, styles.headingText]}>Additional Information</Text>
                    <CustomTextInput
                        type="text"
                        label="GST number"
                        placeholder="Enter client's GSTIN"
                        value={clientData.gstNo}
                        onChangeText={(value) => handleChange("gstNo", value)}
                    />
                    <CustomTextInput
                        type="phoneNo"
                        label="Secondary Number"
                        placeholder="0123456789"
                        value={clientData.secondaryNo[1]}
                        onChangeText={(value) => handleChange("secondaryNo", ["+91", value])}
                    />
                    <CustomTextInput
                        type="multiLine"
                        label="Client notes"
                        placeholder="Enter Notes"
                        value={clientData.clientNotes}
                        onChangeText={(value) => handleChange("clientNotes", value)}
                    />
                    <CustomTextInput
                        type="multiLine"
                        label="Client address"
                        placeholder="Enter client address details"
                        value={clientData.clientAddress}
                        onChangeText={(value) => handleChange("clientAddress", value)}
                    />
                </View>
            </ScrollView>
            <View style={styles.saveButtonContainer}>
                <PrimaryButton label={"Update"} onPress={handleUpdate}/>
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

export default UpdateClientModal;