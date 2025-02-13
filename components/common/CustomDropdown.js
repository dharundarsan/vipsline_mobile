import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    FlatList,
} from "react-native";
import {Divider} from "react-native-paper";
import Colors from "../../constants/Colors";

const CustomDropdown = ({
                            data = [], // Array of dropdown items
                            containerStyle = {}, // Custom styles for the dropdown container
                            dropdownStyle = {}, // Custom styles for dropdown list
                            renderItem,
                            animationDuration = 300, // Duration for the opening/closing animation
                            dropdownLabelCard,
                            arrowIcon = null, // Optional arrow icon to be displayed at the end of the label
                            itemSeparatorComponent,
                            arrowIconStyle,
                            labelButtonStyle,
                            arrowIconContainer

                        }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownHeight] = useState(new Animated.Value(0));

    // Animated value for arrow rotation
    const rotateArrow = useState(new Animated.Value(0))[0];

    const toggleDropdown = () => {
        // Animate dropdown height
        if (isOpen) {
            Animated.timing(dropdownHeight, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: false,
            }).start(() => setIsOpen(false));

            // Rotate arrow back to 0deg
            Animated.timing(rotateArrow, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }).start();
        } else {
            setIsOpen(true);
            Animated.timing(dropdownHeight, {
                toValue: data.length * 40, // Adjust height per item
                duration: animationDuration,
                useNativeDriver: false,
            }).start();

            // Rotate arrow to 180deg
            Animated.timing(rotateArrow, {
                toValue: 1, // 1 corresponds to 180deg
                duration: animationDuration,
                useNativeDriver: true,
            }).start();
        }
    };

    // Interpolation for arrow rotation (0 to 180 degrees)
    const rotateInterpolation = rotateArrow.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"], // 0deg for up, 180deg for down
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                style={[styles.header, labelButtonStyle]}
                onPress={toggleDropdown}
                activeOpacity={0.8}
            >
                {/* Dropdown label */}
                {dropdownLabelCard}

                {/* Conditionally render and animate the arrow icon */}
                {arrowIcon && (
                    <View style={[styles.arrowContainer, arrowIconContainer]}>
                        <Animated.View
                            style={[
                                styles.arrow,
                                { transform: [{ rotate: rotateInterpolation },
                                    ] },
                                arrowIconStyle// Apply rotation
                            ]}
                        >
                            {arrowIcon}
                        </Animated.View>
                    </View>
                )}
            </TouchableOpacity>

            {/* Animated dropdown */}
            {isOpen && (
                <Animated.View style={[styles.dropdown, dropdownStyle]}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        ItemSeparatorComponent={itemSeparatorComponent === undefined ? <Divider/> : itemSeparatorComponent}
                    />
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        position: "relative",
    },
    dropdown: {
        overflow: "hidden",
    },
    arrowContainer: {
        position: "absolute",
        right: 15,
    },
    arrow: {
        fontSize: 16,
    },
    item: {

    },
    itemText: {
    },
});

export default CustomDropdown;
