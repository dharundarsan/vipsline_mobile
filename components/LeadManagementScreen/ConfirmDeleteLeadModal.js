import {KeyboardAvoidingView, Modal, Platform, Pressable, Text, TouchableOpacity, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import CustomTextInput from "../../ui/CustomTextInput";
import PrimaryButton from "../../ui/PrimaryButton";

const ConfirmDeleteLeadModal = () => {
    return <Modal
        visible={props.visible}
        transparent={true}
        style={{flex: 1, position: "relative", borderWidth: 1}}
        animationType={"fade"}
    >
        <Pressable style={{flex: 1}} onPress={props.onCloseModal}/>

        <KeyboardAvoidingView
            behavior="position"
            style={{
                // maxHeight: "80%", backgroundColor: Colors.white,
                // paddingBottom: insets.bottom
            }}
        >
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
}