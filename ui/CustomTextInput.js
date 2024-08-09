import { StyleSheet, Text, TextInput, View } from "react-native";
import textTheme from "../constants/TextTheme";
import React, { useState, useEffect } from "react";
import Colors from "../constants/Colors";
import DropdownModal from "./DropdownModal";
import PrimaryButton from "./PrimaryButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { formatDate } from "../util/Helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * CustomTextInput component for various types of text inputs, including text, email, phone number, and dropdown.
 *
 * @param {Object} props - Props for the CustomTextInput component.
 * @param {'text' | 'email' | 'phoneNo' | 'dropdown' | 'multiLine' | 'date'} props.type - The type of input to display.
 * @param {string | Date} [props.value] - The current value of the text input.
 * @param {string} [props.placeholder] - Placeholder text for the input.
 * @param {string} [props.label] - Label text to display above the input.
 * @param {Array} [props.dropdownItems] - Items to be listed in the dropdown option.
 * @param {function} [props.validator] - Function to validate the input value.
 * @param {function} props.onChangeText - Function to call when the text input value changes.
 * @param {function} [props.onChangeValue] - Function to call when the selected value changes in dropdown.
 * @param {function} [props.onSave] - Function to call when the save button is pressed.
 *
 * @returns {React.ReactElement} A styled custom text input component.
 */
const CustomTextInput = (props) => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDropdownModalVisible, setIsDropdownModalVisible] = useState(false);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

    const handleSave = () => {
        if (props.validator) {
            const validationResult = props.validator(props.value);
            if (validationResult === true) {
                setError(false);
                setErrorMessage("");
                return true;
            } else {
                setError(true);
                setErrorMessage(validationResult);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        if (props.onSave) {
            props.onSave(handleSave);
        }
    }, [props.onSave]);

    let content;
    if (props.type === "text" || props.type === "email" || props.type === "multiLine") {
        content = (
            <TextInput
                style={[
                    textTheme.bodyLarge,
                    styles.textInput,
                    { borderColor: error ? Colors.error : Colors.grey400 },
                    props.type === "multiLine" ? { height: 100, textAlignVertical: "top", paddingVertical: 10 } : {},
                ]}
                multiline={props.type === "multiLine"}
                value={props.value}
                placeholder={props.placeholder}
                onBlur={() => handleSave()}
                onChangeText={(text) => {
                    props.onChangeText(text);
                    if (error && props.validator && props.validator(text) === true) {
                        setError(false);
                        setErrorMessage("");
                    }
                }}
            />
        );
    } else if (props.type === "phoneNo") {
        content = (
            <>
                <DropdownModal
                    selectedValue={countryCode}
                    isVisible={isDropdownModalVisible}
                    onCloseModal={() => setIsDropdownModalVisible(false)}
                    onChangeValue={(value) => {
                        setCountryCode(value);
                        props.onChangeText([value,phoneNumber]);
                        setIsDropdownModalVisible(false);
                    }}
                    dropdownItems={["+91", "+74", "+423", "+983"]}
                />
                <View style={styles.phoneContainer}>
                    <PrimaryButton
                        buttonStyle={styles.countryCodeButton}
                        pressableStyle={styles.countryCodeButtonPressable}
                        onPress={() => setIsDropdownModalVisible(true)}
                    >
                        <Text style={[textTheme.bodyLarge]}>{countryCode}</Text>
                        <FontAwesome name="angle-down" size={24} color="black" />
                    </PrimaryButton>
                    <TextInput
                        style={[
                            textTheme.bodyLarge,
                            styles.textInput,
                            styles.phoneNumberInput,
                            { borderColor: error ? Colors.error : Colors.grey400 },
                        ]}
                        value={phoneNumber}
                        placeholder={props.placeholder}
                        onBlur={() => handleSave()}
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                            props.onChangeText([countryCode,text]);
                            if (error && props.validator && props.validator(text) === true) {
                                setError(false);
                                setErrorMessage("");
                            }
                        }}
                        keyboardType="number-pad"
                    />
                </View>
            </>
        );
    } else if (props.type === "dropdown") {
        content = (
            <>
                <DropdownModal
                    selectedValue={props.value}
                    isVisible={isDropdownModalVisible}
                    onCloseModal={() => setIsDropdownModalVisible(false)}
                    onChangeValue={(value) => {
                        props.onChangeValue(value);
                        setIsDropdownModalVisible(false);
                    }}
                    dropdownItems={props.dropdownItems}
                />
                <PrimaryButton
                    buttonStyle={styles.dropdownButton}
                    pressableStyle={styles.dropdownButtonPressable}
                    onPress={() => setIsDropdownModalVisible(true)}
                >
                    <Text style={[textTheme.bodyLarge]}>
                        {props.value === undefined || props.value === "" ? "Select " + props.label : props.value}
                    </Text>
                    <FontAwesome name="angle-down" size={24} color="black" />
                </PrimaryButton>
            </>
        );
    } else if (props.type === "date") {
        content = (
            <>
                {isDateTimePickerVisible && (
                    <RNDateTimePicker
                        value={props.value || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setIsDateTimePickerVisible(false);
                            if (selectedDate) {
                                props.onChange(selectedDate.getTime());
                            }
                        }}
                    />
                )}
                <PrimaryButton
                    buttonStyle={styles.dateTimeButtom}
                    pressableStyle={styles.dateTimeButtonPressable}
                    onPress={() => setIsDateTimePickerVisible(true)}
                >
                    <Text style={[textTheme.bodyLarge, styles.dateTimeButtonText]}>
                        {props.value === undefined || props.value === "" ? "Select " + props.label : formatDate(new Date(props.value))}
                    </Text>
                    <MaterialCommunityIcons
                        style={styles.dateTimeButtonIcon}
                        name="calendar-month-outline"
                        size={24}
                        color={Colors.grey600}
                    />
                </PrimaryButton>
            </>
        );
    }

    return (
        <View style={styles.commonContainer}>
            <Text style={[textTheme.bodyMedium, styles.labelText]}>{props.label}</Text>
            {content}
            {error && <Text style={[textTheme.bodyMedium, styles.errorText]}>{errorMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    commonContainer: {
        marginBottom: 15,
    },
    labelText: {
        fontWeight: "500",
    },
    textInput: {
        flexDirection: "row",
        alignItems: "center",
        textAlignVertical:"center",
        borderWidth: 1,
        borderRadius: 5,
        paddingRight: 20,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 7,
    },
    errorText: {
        color: Colors.error,
        fontWeight: "500",
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
    dropdownButton: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.grey400,
        backgroundColor: Colors.background,
        marginVertical: 5,
    },
    dropdownButtonPressable: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 9,
        paddingHorizontal: 20,
    },
    dateTimeButtom:{
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.grey400,
        backgroundColor: Colors.background,
        marginVertical: 5,
    },
    dateTimeButtonPressable:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    dateTimeButtonIcon:{
        borderLeftWidth:1,
        borderLeftColor:Colors.grey400,
        height:"100%",
        paddingHorizontal:10,
        paddingVertical:9,
    },
    dateTimeButtonText: {
        paddingHorizontal:20,
        paddingVertical:9,
    }
});

export default CustomTextInput;
