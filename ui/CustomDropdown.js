import React, {useState, useRef, useEffect} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import CustomCheckbox from './CustomCheckbox';
import { MaterialIcons } from "@expo/vector-icons";
import textTheme from "../constants/TextTheme";
import { Divider } from 'react-native-paper';


const CustomDropdown = (props) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownWidth, setDropdownWidth] = useState(0); // Store dropdown width
    const dropdownButtonRef = useRef(); // Reference to the dropdown button

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleOption = (option) => {
        if (props.selectedOptions.includes(option)) {
            const newSelectedOptions = props.selectedOptions.filter(opt => opt !== option);
            props.setSelectedOptions(newSelectedOptions);
        } else {
            const newSelectedOptions = [...props.selectedOptions, option];
            props.setSelectedOptions(newSelectedOptions);
        }
    };
    const onDropdownButtonLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setDropdownWidth(width);
    };

    return (
        <View style={[styles.container, props.container]}>
            {
                props.label === undefined || props.labelEnabled === false ? <></> :
                <Text style={[textTheme.bodyMedium, {marginVertical: 6}, props.labelStyle]}>{props.label}</Text>
            }
            <TouchableOpacity
                ref={dropdownButtonRef}
                onLayout={onDropdownButtonLayout}
                onPress={toggleDropdown}
                style={styles.dropdownButton}
            >
                <Text style={[textTheme.bodyLarge, {paddingLeft: 8}]}>
                    {
                        props.placeholder === undefined || props.placeholder === "" ?
                            "Select " + props.label : props.placeholder
                    }
                </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </TouchableOpacity>

            {dropdownVisible && (
                <View style={[styles.dropdownContainer, { width: dropdownWidth }]}>
                    <FlatList
                        data={props.options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.optionButton}
                                onPress={() => toggleOption(item)}
                            >
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',  // Ensures dropdown is positioned relative to this parent
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
        // position: 'absolute', // Makes the dropdown overlay
        // top: '100%',  // Positions the dropdown just below the button
        zIndex: 999,  // Brings the dropdown to the front
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: 'white',
        alignSelf: 'center'
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    optionText: {
        marginLeft: 10,
    },
});

export default CustomDropdown;
