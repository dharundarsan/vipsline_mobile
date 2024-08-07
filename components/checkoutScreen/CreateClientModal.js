import {Modal, ScrollView, StyleSheet, Text, View} from "react-native";
import CustomTextInput from "../../ui/CustomTextInput";
import React, {useState} from "react";
import DropdownModal from "../../ui/DropdownModal";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";

const CreateClientModal = (props) => {
    const [value, setValue] = useState("Haha");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [secondaryNo, setSecondaryNo] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [clientSource, setClientSource] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [clientNotes, setClientNotes] = useState("")
    const [clientAddress, setClientAddress] = useState("");
    return <>
        <Modal visible={props.isVisible} style={styles.createClientModal}>
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
                    <CustomTextInput type="text" label="First name" placeholder="Enter client's first name"
                                     value={firstName} onChangeText={setFirstName} validator={(text) => {
                        if (text.length === 0) return "First name is required"
                        else return true
                    }}/>
                    <CustomTextInput type="text" label="Last name" placeholder="Enter client's last name"
                                     value={lastName} onChangeText={setLastName} validator={(text) => {
                        if (text.length === 0) return "Last name is required"
                        else return true
                    }}/>
                    <CustomTextInput type="phoneNo" label="Mobile" placeholder="0123456789" value={phoneNo}
                                     onChangeText={setPhoneNo} validator={(text) => {
                        if (text.length !== 10) return "Phone number is invalid"
                        else return true
                    }}/>
                    <CustomTextInput type="email" label="Email address" placeholder="Enter email address" value={email}
                                     onChangeText={setEmail}/>
                    <CustomTextInput type="dropdown" label="Gender" value={gender} onChangeValue={setGender}
                                     dropdownItems={["Male", "Female", "Others"]}/>
                    <CustomTextInput type="dropdown" label="Client source" value={clientSource}
                                     onChangeValue={setClientSource} dropdownItems={["Male", "Female", "Others"]}/>
                    <Text style={[textTheme.bodyMedium, styles.headingText]}>Additional Infomation</Text>
                    <CustomTextInput type="text" label="GST number" placeholder="Enter client's GSTIN" value={gstNo}
                                     onChangeText={setGstNo}/>
                    <CustomTextInput type="phoneNo" label="Secondary Number" placeholder="0123456789"
                                     value={secondaryNo}
                                     onChangeText={setSecondaryNo}/>
                    <CustomTextInput type="multiLine" label="Client notes" placeholder="Enter Notes" value={clientNotes}
                                     onChangeText={setClientNotes}/>
                    <CustomTextInput type="multiLine" label="Client address" placeholder="Enter client address details"
                                     value={clientAddress}
                                     onChangeText={setClientAddress}/>
                </View>
            </ScrollView>
            <View style={styles.saveButtonContainer}>
                <PrimaryButton label={"Save"} onPress={() => {
                }}/>
            </View>
        </Modal>
    </>

}

const styles = StyleSheet.create({
    createClientModal: {
        flex: 1
    },
    closeAndHeadingContainer: {
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
        padding:20,
        borderTopColor:Colors.grey500,
        borderTopWidth:1,
    }
})

export default CreateClientModal;