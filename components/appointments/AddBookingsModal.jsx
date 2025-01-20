import {Modal, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {updateNavigationState} from "../../store/NavigationSlice";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import React from "react";
import {shadowStyling} from "../../util/Helpers";

const AddBookingsModal = (props) => {
    return <Modal style={{flex: 1}} visible={props.isVisible} animationType={"none"}
                  presentationStyle={"pageSheet"}>
        <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.selectClientText]}>Add Booking</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={() => {
                    props.onClose()
                }}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 50 : 0,
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
})

export default AddBookingsModal;