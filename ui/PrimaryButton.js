import {Pressable, StyleSheet, Text, View, Platform} from "react-native";
import Colors from "../constants/Colors";
import TextTheme from "../constants/TextTheme";
import React from "react";
import * as Haptics from "expo-haptics";

/**
 * PrimaryButton component for reusable styled button with custom text and press handling.
 *
 * @param {Object} props - Props for the PrimaryButton component.
 * @param {string} props.label - The text to display inside the button. Not applicable when children is present.
 * @param {function?} props.onPress - Function to call when the button is pressed.
 // * @param {Colors} props.backgroundColor - Background color of the button
 * @param {String || number} [props.height] - Height of the button.
 * @param {String || number} [props.width] - Width of the button.
 * @param {string} [props.rippleColor] - Ripple color animation when pressed.
 * @param {boolean} [props.disableRipple] - Disable ripple.
 * @param {Object} [props.buttonStyle] - Custom styles for the button container.
 * @param {Object} [props.textStyle] - Custom styles for the button text. Not applicable when children is present.
 * @param {Object} [props.pressableStyle] - Custom styles for the inner pressable container
 * @param {React.ReactNode} [props.children] - Optional children to render inside the button.
 *
 * @returns {React.ReactElement} A styled button component.
 */
const PrimaryButton = (props) => {
    const styles = StyleSheet.create({
        primaryButton: {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.button,
            borderRadius: 6,
            overflow: "hidden",
            height: props.height,
            width: props.width,
        },
        pressable: {
            paddingHorizontal: 13,
            paddingVertical: 11,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        buttonLabel: {
            color: Colors.onButton,
        },
    });

    return (
        <View style={[styles.primaryButton, props.buttonStyle]}>
            <Pressable
                style={({pressed}) => [
                    styles.pressable,
                    props.pressableStyle,
                    Platform.select({
                        ios: props.disableRipple ? {} : {opacity: pressed ? 0.3 : 1},
                    }),
                ]}
                onPress={() => {
                    Haptics.selectionAsync()
                    if (props.onPress !== undefined) props.onPress()
                }}
                android_ripple={props.disableRipple ? {} : {color: props.rippleColor ? props.rippleColor : 'rgba(0, 0, 0, 0.1)'}}
            >
                {props.children ? props.children :
                    <Text style={[TextTheme.titleSmall, styles.buttonLabel, props.textStyle]}>
                        {props.label}
                    </Text>
                }
            </Pressable>
        </View>
    );
};

export default PrimaryButton;
