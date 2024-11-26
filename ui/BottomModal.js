import {View, Text, StyleSheet, Modal, Pressable, Platform, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import Colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import PrimaryButton from "./PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import CustomTextInput from "./CustomTextInput";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


/**
 * BottomModal Component
 *
 * A customizable modal component that appears from the bottom of the screen. It includes a title,
 * a text input field, and customizable buttons for actions like sending or cancelling.
 *
 * @param {Object} props
 * @param {boolean} props.visible - Controls the visibility of the modal.
 * @param {function} props.onCloseModal - Function called when the close button is pressed.
 * @param {string} props.title - The title text displayed at the top of the modal.
 * @param {string} props.label - Label text for the text input field.
 * @param {string} props.type - The type of text input (e.g., 'default', 'email-address', etc.).
 * @param {string} props.value - The current value of the text input field.
 * @param {function} props.onChangeText - Callback function triggered when the text input changes.
 * @param {function} [props.onSave] - Callback function to save input value when action is taken (optional).
 * @param {function} [props.validator] - Validation function for input (optional).
 * @param {string} [props.placeholder] - Placeholder text for the text input (optional).
 * @param {string} [props.buttonOneName] - The label for the first button (optional).
 * @param {function} [props.buttonOneOnPress] - Function called when the first button is pressed (optional).
 * @param {Object} [props.buttonOneStyle] - Custom styles for the first button (optional).
 * @param {string} [props.buttonTwoName] - The label for the second button (optional).
 * @param {function} [props.buttonTwoOnPress] - Function called when the second button is pressed (optional).
 * @param {Object} [props.buttonTwoStyle] - Custom styles for the second button (optional).
 * @param {Object} [props.titleTextStyle] - Custom styles for the title text (optional).
 *
 * @returns {JSX.Element} A modal that appears at the bottom of the screen with a title, text input,
 * and customizable buttons.
 */





export default function BottomModal(props) {


    const styles = StyleSheet.create({
        modalContent: {
            position: 'absolute',
            backgroundColor: Colors.white,
            alignItems: 'center',
            width: '100%',
            bottom: 0,
            borderColor: Colors.grey250,
            borderWidth: 1
        },
        titleContainer: {
            flexDirection: 'row',
            padding: 16,
            width: '100%',
            justifyContent: 'center',
            elevation: 4,             // Shadow strength
            backgroundColor: '#fff',  // Background color
            shadowColor: '#000',      // Shadow color
            shadowOffset: {width: 0, height: 10}, // Offset for bottom shadow
            shadowOpacity: 0.1,       // Opacity (optional for cross-platform)
            shadowRadius: 3.84,       // Blur radius (optional for cross-platform)
            borderBottomWidth: 0.5,     // Helps define a stronger bottom line
            borderColor: 'rgba(0,0,0,0.1)' // Subtle color to simulate the bottom shadow
        },
        titleTextStyle: {
            margin: 'auto'
        },
        closeButton: {
            position: "absolute",
            top: 16,
            right: 16,
            overflow: 'hidden',
        },
        textInputContainer: {
            width: '95%',
            paddingVertical: 32,

        },
        textInput: {
            borderWidth: 1,
            width: '100%'
        },
        buttonContainer: {
            borderTopWidth: 1,
            borderTopColor: Colors.grey250,
            width: '100%',
            paddingVertical: 16,
            alignItems: 'center',
        },
        sendButton: {
            flex: 1
        },
        cancelButton: {
            flex: 1,
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: Colors.grey250
        },
        buttonInnerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            gap: 8,
            paddingHorizontal: 32,
        },
        cancelTextStyle: {
            color: Colors.black
        },
        sendTextStyle: {}


    })
    const insets = useSafeAreaInsets();
    return (
        <Modal
            visible={props.visible}
            transparent={true}
            style={{flex: 1
                // , position: "relative", borderWidth: 1
            }}
            animationType={"fade"}
        >
            
            <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "ios" ? insets.bottom : 0}
        //   behavior={Platform.OS==="ios" ? "position" : ""}
          style={{
            // backgroundColor: Colors.white,
            // paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
            // maxHeight: "100%",
            flex:1
          }}>
                <Pressable style={{flex: 1}} onPress={props.onCloseModal}/>
                <TouchableOpacity
                    style={styles.modalContent}
                    activeOpacity={1}
                >
                    <View style={styles.titleContainer}>
                        <Text style={[textTheme.titleLarge, styles.titleTextStyle, props.titleTextStyle]}>
                            {props.title}
                        </Text>
                        <Pressable
                            onPress={props.onCloseModal}
                            android_ripple={{color: Colors.ripple}}
                            style={({pressed}) =>
                                pressed && Platform.OS === "ios" ?
                                    [styles.closeButton, {opacity: 0.4}] :
                                    styles.closeButton}
                        >
                            <Ionicons name="close" size={30} color="black"/>
                        </Pressable>
                    </View>
                    <View style={styles.textInputContainer}>
                        <CustomTextInput
                            label={props.label}
                            textInputStyle={styles.textInput}
                            type={props.type}
                            labelTextStyle={[textTheme.titleSmall]}
                            onChangeText={props.onChangeText}
                            value={props.value}
                            onSave={props.onSave}
                            validator={props.validator}
                            placeholder={props.placeholder}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonInnerContainer}>
                            {
                                props.buttonOneName ?
                                    <PrimaryButton
                                        label={props.buttonOneName}
                                        buttonStyle={[styles.cancelButton, props.buttonOneStyle]}
                                        textStyle={[textTheme.bodyMedium, styles.cancelTextStyle, props.buttonOneTextStyle]}
                                        onPress={props.buttonOneOnPress}
                                    /> :
                                    null
                            }
                            {
                                props.buttonTwoName ?
                                    <PrimaryButton
                                        label={props.buttonTwoName}
                                        buttonStyle={[styles.sendButton, props.buttonTwoStyle]}
                                        textStyle={[textTheme.bodyMedium, styles.sendTextStyle, props.buttonTwoTextStyle]}
                                        onPress={props.buttonTwoOnPress}
                                    /> :
                                    null
                            }
                        </View>
                    </View>

                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>

    );
}


