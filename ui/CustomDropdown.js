import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import CustomCheckbox from './CustomCheckbox';
import { MaterialIcons } from "@expo/vector-icons";
import textTheme from "../constants/TextTheme";
import { Divider } from 'react-native-paper';
import Colors from "../constants/Colors";

/**
 * CustomDropdown - A reusable dropdown component that supports multiple selections.
 *
 * @param {Object} props - Props for the CustomDropdown component.
 * @param {string} props.label - The label text displayed above the dropdown.
 * @param {boolean} [props.labelEnabled=true] - Whether to show the label.
 * @param {string} props.placeholder - Placeholder text shown when no option is selected.
 * @param {Array<string>} props.options - The list of options available in the dropdown.
 * @param {Array<string>} props.selectedOptions - The currently selected options.
 * @param {Function} props.setSelectedOptions - Function to update selected options.
 * @param {Function} [props.validator] - Function to validate the selected options.
 * @param {Function} [props.onSave] - Function triggered when saving, validating the input.
 * @param {boolean} [props.scrollEnabled=true] - Whether the dropdown list should be scrollable.
 * @param {Object} [props.container] - Custom styles for the dropdown container.
 * @param {Object} [props.labelStyle] - Custom styles for the label.
 * @param {string} [props.borderColor='#ccc'] - Border color for the dropdown.
 * @param {string} [props.highlightColor] - Highlight color for the checkboxes.
 * @param {number} [props.checkBoxSize=20] - Size of the checkboxes.
 *
 * @returns {React.ReactElement} A dropdown component with multiple selection support.
 */
const CustomDropdown = (props) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownWidth, setDropdownWidth] = useState(0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const dropdownButtonRef = useRef();

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleOption = (option) => {
        let newSelectedOptions;

        if (props.selectedOptions.includes(option)) {
            newSelectedOptions = props.selectedOptions.filter(opt => opt !== option);
        } else {
            newSelectedOptions = [...props.selectedOptions, option];
        }

        props.setSelectedOptions(newSelectedOptions);

        // Clear error if validator passes
        if (error && props.validator && props.validator(newSelectedOptions) === true) {
            setError(false);
            setErrorMessage("");
        }
    };

    const onDropdownButtonLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setDropdownWidth(width);
    };

    const handleSave = () => {
        if (props.validator) {
            const validationResult = props.validator(props.selectedOptions);
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

    return (
        <View style={[styles.container, props.container]}>
            {props.label !== undefined && props.labelEnabled !== false && (
                <Text style={[textTheme.bodyMedium, { marginVertical: 6 }, props.labelStyle]}>
                    {props.label}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.5}
                ref={dropdownButtonRef}
                onLayout={onDropdownButtonLayout}
                onPress={toggleDropdown}
                style={[styles.dropdownButton, error ? styles.errorBorder : {}]}
            >
                <Text style={[textTheme.bodyLarge, { paddingLeft: 8 }]}>
                    {props.selectedOptions.length > 0
                        ? props.selectedOptions.join(", ") // Show selected values
                        : props.placeholder || `Select ${props.label}`}
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </TouchableOpacity>

            {dropdownVisible && (
                <View style={[styles.dropdownContainer, { width: dropdownWidth }]}>
                    <FlatList
                        data={props.options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.optionButton} onPress={() => toggleOption(item)}>
                                <CustomCheckbox
                                    isChecked={props.selectedOptions.includes(item)}
                                    onPress={() => toggleOption(item)}
                                    borderColor={props.borderColor}
                                    highlightColor={props.highlightColor}
                                    size={props.checkBoxSize}
                                />
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <Divider />}
                        scrollEnabled={props.scrollEnabled}
                        removeClippedSubviews={false}
                    />
                </View>
            )}

            {error && <Text style={[textTheme.bodyMedium, {color: Colors.error, marginTop: 4}]}>{errorMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
    },
    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    dropdownContainer: {
        zIndex: 999,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
    },
    optionText: {
        marginLeft: 10,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginTop: 4,
    },
    errorBorder: {
        borderColor: Colors.error,
    }
});

export default CustomDropdown;
