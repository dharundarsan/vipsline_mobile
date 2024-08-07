import {StyleSheet, Text, TextInput, View} from "react-native";
import textTheme from "../constants/TextTheme";
import React, {useState} from "react";
import Colors from "../constants/Colors";
import {Picker} from '@react-native-picker/picker';
import DropdownModal from "./DropdownModal";
import PrimaryButton from "./PrimaryButton";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/**
 * CustomTextInput component for various types of text inputs, including text, email, phone number, and dropdown.
 *
 * @param {Object} props - Props for the CustomTextInput component.
 * @param {'text' | 'email' | 'phoneNo' | 'dropdown' | 'multiLine'} props.type - The type of input to display.
 * @param {string} [props.value] - The current value of the text input.
 * @param {string} [props.placeholder] - Placeholder text for the input.
 * @param {string} [props.label] - Label text to display above the input.
 * @param {Array} [props.dropdownItems] - Items to be listed in the dropdown option.
 * @param {function} props.validator - Function to validate the input value.
 * @param {function} props.onChangeText - Function to call when the text input value changes.
 * @param {function} props.onChangeValue - Function to call when the selected value changes in dropdown.
 *
 * @returns {React.ReactElement} A styled custom text input component.
 */

const CustomTextInput = (props) => {


    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDropdownModalVisible, setIsDropdownModalVisible] = useState(false);

    let content;
    if (props.type === "text" || props.type === "email" || props.type === "multiLine") {
        content = (
            <TextInput
                style={[
                    textTheme.bodyLarge,
                    styles.textInput,
                    {borderColor: error ? Colors.error : Colors.grey400},
                    props.type === "multiLine" ? {height: 100, textAlignVertical: "top", paddingVertical: 10} : {}
                ]}
                multiline={ props.type === "multiLine" ? true : false}
                value={props.value}
                placeholder={props.placeholder}
                onBlur={() => {
                    if(props.validator === undefined) return;
                    const validationResult = props.validator(props.value);
                    if (validationResult === true) {
                        setError(false);
                        setErrorMessage("");
                        console.log("Validation successful");
                    } else {
                        setError(true);
                        setErrorMessage(validationResult);
                    }
                }}
                onChangeText={(text) => {
                    if (error && props.validator !== undefined && props.validator(text) === true) {
                        setError(false);
                        setErrorMessage("");
                    }
                    props.onChangeText(text);
                }}
            />
        );
    } else if (props.type === "phoneNo") {
        const [, set] = useState()
        content = (
            <>
                <DropdownModal selectedValue={countryCode} isVisible={isDropdownModalVisible} onCloseModal={() => {
                    setIsDropdownModalVisible(false)
                }}
                               onChangeValue={(value) => {
                                   setCountryCode(value);
                                   setIsDropdownModalVisible(false);
                               }}
                               dropdownItems={["+91", "+74", "+423", "+983"]}/>
                <View style={styles.phoneContainer}>
                    <PrimaryButton buttonStyle={styles.countryCodeButton}
                                   pressableStyle={styles.countryCodeButtonPressable}
                                   onPress={() => {
                                       setIsDropdownModalVisible(true)
                                   }}>
                        <Text style={[textTheme.bodyLarge]}>{countryCode}</Text>
                        <FontAwesome name="angle-down" size={24} color="black"/>
                    </PrimaryButton>
                    <TextInput
                        style={[
                            textTheme.bodyLarge,
                            styles.textInput,
                            styles.phoneNumberInput,
                            {borderColor: error ? Colors.error : Colors.grey400}
                        ]}
                        value={phoneNumber}
                        placeholder={props.placeholder}
                        onBlur={() => {
                            if(props.validator === undefined) return;
                            const validationResult = props.validator(props.value);
                            if (validationResult === true) {
                                setError(false);
                                setErrorMessage("");
                                console.log("Validation successful");
                            } else {
                                setError(true);
                                setErrorMessage(validationResult);
                            }
                        }}
                        onChangeText={(text) => {
                            if (error && props.validator !== undefined && props.validator(text) === true) {
                                setError(false);
                                setErrorMessage(""); // Reset error message
                            }
                            setPhoneNumber(text);
                            props.onChangeText(`${countryCode}${text}`);
                        }}
                        keyboardType="number-pad"
                    />
                </View>
            </>

        )
    } else if (props.type === "dropdown") {
        content = (
            <>
                <DropdownModal selectedValue={props.value} isVisible={isDropdownModalVisible} onCloseModal={() => {
                    setIsDropdownModalVisible(false)
                }}
                               onChangeValue={(value) => {
                                   props.onChangeValue(value);
                                   setIsDropdownModalVisible(false);
                               }}
                               dropdownItems={props.dropdownItems}/>
                <PrimaryButton buttonStyle={styles.dropdownButton}
                               pressableStyle={styles.dropdownButtonPressable}
                               onPress={() => {
                                   setIsDropdownModalVisible(true)
                               }}>
                    <Text style={[textTheme.bodyLarge]}>{props.value === undefined || props.value === "" ? "Select value" : props.value}</Text>
                    <FontAwesome name="angle-down" size={24} color="black"/>
                </PrimaryButton>
            </>
        )
    }

    return (
        <>
            <View style={styles.commonContainer}>
                <Text style={[textTheme.bodyMedium, styles.labelText]}>{props.label}</Text>
                {content}
                {error ? <Text style={[textTheme.bodyMedium, styles.errorText]}>{errorMessage}</Text> : null}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    commonContainer: {
        marginBottom:15,
    },
    labelText: {
        fontWeight: 500,
    },
    textInput: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5,
        paddingRight: 20,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    errorText: {
        color: Colors.error,
        fontWeight: 500,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    countryCodeButton: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.grey400,
        backgroundColor: Colors.background,
    },
    countryCodeButtonPressable: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
        paddingVertical: 9,
    },
    phoneNumberInput: {
        flex: 1,
    },
    dropdownButton:{
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.grey400,
        backgroundColor: Colors.background,
        marginVertical: 5,
    },
    dropdownButtonPressable:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 9,
        paddingHorizontal: 20,
    }
});

export default CustomTextInput;
