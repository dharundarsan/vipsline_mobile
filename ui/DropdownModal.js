import {FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../constants/Colors";
import PrimaryButton from "./PrimaryButton";
import colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import {useState} from "react";
import Divider from "./Divider";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Platform} from "react-native";

/**
 * DropdownModal Component
 *
 * This component renders a modal with a dropdown list of selectable items.
 * The modal appears with a fade animation and is transparent, meaning it overlays
 * the entire screen. When an item is selected from the dropdown, the modal closes
 * automatically, and the selected value is passed to the parent component.
 *
 * @param {Object} props - The properties passed to this component.
 * @param {boolean} props.isVisible - Controls the visibility of the modal.
 * @param {function} props.onCloseModal - Callback function to close the modal.
 * @param {Array} props.dropdownItems - Array of items to be displayed in the dropdown list.
 * @param {function} props.onChangeValue - Callback function to handle the selected value.
 * @param {string} [props.objectName] - (Optional) Name of the object key to be displayed if items are objects.
 * @param {Array} [props.iconImage] - (Optional) Array of images corresponding to each dropdown item.
 * @param {Object} [props.primaryViewChildrenStyle] - (Optional) Additional styles for the main view containing text and image.
 * @param {number} [props.imageWidth] - (Optional) Width of the image if iconImage is provided.
 * @param {number} [props.imageHeight] - (Optional) Height of the image if iconImage is provided.
 * @param {Array} [props.imageStyles] - (Optional) Array of styles for each image. If null, default style will be applied.
 * @param {any} [props.selectedValue] - The value currently selected.
 *
 * @returns {JSX.Element} The rendered modal component.
 */


const DropdownModal = (props) => {
    const [selectedValue, setSelectedValue] = useState();
    const insets = useSafeAreaInsets();
    return (
        <Modal transparent={true} animationType={"fade"} visible={props.isVisible} style={styles.dropdownModal}>
            <TouchableOpacity style={[styles.modalContent, {
                paddingTop: Platform.OS === "ios" ? insets.top : null,
                paddingBottom: Platform.OS === "ios" ? insets.bottom : null
            }]} onPress={props.onCloseModal} activeOpacity={1}>
                <FlatList
                    style={styles.dropdownList}
                    data={props.dropdownItems}
                    renderItem={({item, index}) => (
                        <>
                            <PrimaryButton
                                label={props.object ? Object.entries(item).filter((arr) => arr[0] === props.objectName)[0][1] : item}
                                buttonStyle={styles.closeButton}
                                pressableStyle={styles.closeButtonPressable}
                                onPress={() => {
                                    props.onChangeValue(item);
                                    props.onCloseModal();
                                }}
                                textStyle={[
                                    textTheme.bodyLarge,
                                    styles.closeButtonText,
                                    props.selectedValue === item ? {
                                        color: Colors.highlight,
                                        fontWeight: 500,
                                    } : {}
                                ]}
                            >
                                {props.iconImage !== undefined && props.iconImage[index] ? (
                                    <View style={[props.primaryViewChildrenStyle]}>
                                        <Image
                                            source={props.iconImage[index]}
                                            style={[
                                                {width: props.imageWidth, height: props.imageHeight, marginRight: 8},
                                                props.imageStyles && props.imageStyles[index] !== null
                                                    ? props.imageStyles[index]
                                                    : null, // Apply default style if style is null
                                                styles.imageStyle,
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                textTheme.bodyLarge,
                                                styles.closeButtonText,
                                                props.selectedValue === item ? {
                                                    color: Colors.highlight,
                                                    fontWeight: 500
                                                } : {}
                                            ]}
                                        >
                                            {props.object ? Object.entries(item).filter((arr) => arr[0] === props.objectName)[0][1] : item}
                                        </Text>
                                    </View>
                                ) : null}
                            </PrimaryButton>
                        </>
                    )}
                />
                <PrimaryButton
                    label={"Close"}
                    onPress={props.onCloseModal}
                    buttonStyle={styles.closeButton}
                    textStyle={[textTheme.bodyLarge, styles.closeButtonText]}
                />
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    dropdownModal: {
        flex: 1,
        height: "100%",
    },
    closeButton: {
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey250,
        borderRadius: 0
    },
    closeButtonPressable: {
        paddingVertical: 15
    },
    closeButtonText: {
        color: Colors.black,
    },
    modalContent: {
        gap: 10,
        padding: 10,
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#D9D9D999",
    },
    dropdownList: {
        backgroundColor: Colors.white,
        flexGrow: 0,
        borderRadius: 5,
    },
    imageStyle: {
        // any global image styles can go here
    },
    defaultImageStyle: {
        // default image styles when the style prop is null
        width: 24,
        height: 24,
        marginRight: 8,
    },
});

export default DropdownModal;
