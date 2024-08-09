import {View, Text, StyleSheet, Modal} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import ClientCard from "./ClientCard";


export default function ClientDetailedInfoModal(props) {
    return(
        <Modal visible={props.modalVisiblity}>
            <View style={styles.closeAndHeadingContainer}>
                <ClientCard
                    name={props.clientName}
                    card={styles.clientProfileCard}
                    cardInnerContainer={styles.cardInnerContainer}
                    rippleColor={Colors.white}
                />
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={props.closeModal}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <Divider />
            <View style={styles.modalContent}>

            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
    },
    closeAndHeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 6,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    selectClientText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center"
    },
    clientProfileCard: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        width: 'auto'
    },
    cardInnerContainer: {
        marginLeft: 0
    }
})