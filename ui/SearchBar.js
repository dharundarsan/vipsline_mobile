import {StyleSheet, TextInput, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import PrimaryButton from "./PrimaryButton";
import React from "react";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

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
        <View style={styles.logoAndInputContainer}>
            <Ionicons name="search-sharp" style={styles.searchLogo} size={20} color={Colors.grey500}/>
            <TextInput style={[textTheme.bodyMedium, styles.searchTextInput]}
                       placeholder={props.placeholder}
                       onChangeText={props.onChangeText}
                       placeholderTextColor={Colors.grey400}
                       cursorColor={Colors.black}
                       value={props.value}
            />
        </View>
        {props.filter ? <PrimaryButton
            buttonStyle={[styles.filterButton, props.filterIcon]}
            onPress={props.onPressFilter}
        >
            <SimpleLineIcons
                name="equalizer"
                size={18}
                color={Colors.darkBlue}
            />
        </PrimaryButton> : null}
    </View>
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        backgroundColor: Colors.background,
    },
    logoAndInputContainer:{
        backgroundColor: "#F8F8FB",
        flexDirection: "row",
        alignItems: "center",
        borderRadius:20,
        flex:1,
        marginRight:12,
    },
    searchLogo: {
        paddingVertical: 9,
        paddingLeft: 18,
        // borderRadius: 20,
        // borderColor: Colors.grey500,
        // borderWidth: 1
    },
    searchTextInput: {
        marginLeft: 10,
        flex: 1,
    },
    filterButton: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    searchFilterPressable: {
        paddingHorizontal: 9,
        paddingVertical: 9,
    },
});

export default SearchBar;