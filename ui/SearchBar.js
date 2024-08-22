import {StyleSheet, TextInput, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import PrimaryButton from "./PrimaryButton";
import React from "react";

/**
 * SearchBar component for reusable Search Bar with custom text and press handling.
 *
 * @param {Object} props - Props for the SearchBar component.
 * @param {Object} props.searchContainerStyle - Props for the overriding or providing search bar styles.
 * @param {string} props.placeholder - The initial text to display inside the search bar.
 * @param {boolean} props.filter - The boolean value decides to display filter button or not.
 * @param {function} props.onPressFilter - Function to call when the filter is pressed.
 * @param {function} props.onChangeText - Funtion to call when the text in the search input changes.
 *
 * @returns {React.ReactElement} A styled button component.
 */

const SearchBar = (props) => {
    return <View style={[styles.searchContainer, props.searchContainerStyle]}>
        <Ionicons name="search-sharp" style={styles.searchLogo} size={20} color={Colors.grey500}/>
        <TextInput style={[textTheme.bodyMedium, styles.searchTextInput]}
                   placeholder={props.placeholder}
                   onChangeText={props.onChangeText}
                   placeholderTextColor={Colors.grey400}
                   cursorColor={Colors.black}
                   value={props.value}
        />
        {props.filter ? <PrimaryButton onPress={props.onFilterPress} buttonStyle={styles.searchFilterButton}
                                       pressableStyle={styles.searchFilterPressable}>
            <Ionicons name="filter" size={20} color={Colors.grey500}/>
        </PrimaryButton> : null}
    </View>
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        backgroundColor: Colors.background,
        borderRadius: 20,
        borderColor: Colors.grey500,
        borderWidth: 1
    },
    searchLogo: {
        paddingVertical: 9,
        paddingLeft: 9,
    },
    searchTextInput: {
        fontSize: 15,
        marginLeft: 10,
        flex: 1,
    },
    searchFilterButton: {
        borderLeftColor: Colors.grey500,
        borderLeftWidth: 1,
        backgroundColor: Colors.transparent,
        borderRadius: 0,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
    },
    searchFilterPressable: {
        paddingHorizontal: 9,
        paddingVertical: 9,
    },
});

export default  SearchBar;