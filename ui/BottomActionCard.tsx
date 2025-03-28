import {Modal, TouchableOpacity, View, StyleSheet, Text, ModalProps} from "react-native";
import textTheme from "../constants/TextTheme";
import PrimaryButton from "./PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../constants/Colors";
import {useEffect} from "react";

// Extend ModalProps to allow all props of React Native's Modal
interface BottomActionCardProps extends ModalProps {
    isVisible: boolean;
    header: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel: string;
    cancelLabel: string;
    headerTextStyle?: any
}

const BottomActionCard = ({
                              isVisible,
                              header,
                              content,
                              cancelLabel = "Cancel",
                              confirmLabel = "Confirm",
                              onClose,
                              onConfirm,
                              onCancel,
                              headerTextStyle,
                              children,
                              ...modalProps
                          }: BottomActionCardProps) => {
    // Only render the Modal if isVisible is true
    if (!isVisible) return null;

    useEffect(() => {
        // console.log("Rendering");
    });

    return (
        <Modal
            transparent={true}
            animationType={"fade"}
            visible={isVisible}
            {...modalProps} // Spread the modal props
            style={[styles.dropdownModal, modalProps.style]} // Merge custom styles if needed
        >
            <TouchableOpacity
                style={styles.modalContent}
                activeOpacity={1}
            >
                <View style={styles.label}>
                    <Text style={[textTheme.titleLarge, styles.deleteClientText, headerTextStyle]}>{header}</Text>

                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={25} color="black"/>
                    </PrimaryButton>
                </View>
                {(children === null || children === undefined) ? <View style={styles.deleteClientCardContainer}>
                        <Text style={[{marginHorizontal: 30, fontSize: 14}]}>{content}</Text>
                        <View style={styles.deleteClientCardButtonContainer}>
                            <PrimaryButton
                                label={cancelLabel}
                                buttonStyle={styles.cancelButton}
                                pressableStyle={styles.cancelButtonPressable}
                                textStyle={[textTheme.titleMedium, styles.cancelButtonText]}
                                onPress={() => {
                                    onCancel();
                                }}
                            />
                            <PrimaryButton
                                label={confirmLabel}
                                buttonStyle={styles.deleteButton}
                                textStyle={[textTheme.titleMedium]}
                                onPress={onConfirm}
                            />
                        </View>
                    </View> :
                    <View style={{backgroundColor: Colors.white}}>
                        {children}
                    </View>
                }

            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    dropdownModal: {
        flex: 1,
        height: "100%",
    },
    closeButton: {
        // position: "absolute",
        // right: 10,
        // top: 5,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    closeButtonText: {
        color: Colors.black,
    },
    modalContent: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: Colors.dim300,
    },
    label: {
        width: "100%",
        paddingVertical: 5,
        backgroundColor: Colors.background,
        alignItems: "center",
        flexDirection: "row",
        elevation: 0.5,
    },
    deleteClientText: {
        textAlign: "center",
        fontWeight: 700,
        flex: 1,
        paddingVertical: 10,
    },
    deleteClientCardContainer: {
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: Colors.background,
    },
    deleteClientCardButtonContainer: {
        flexDirection: "row",
        // width: "70%",
        gap:20,
        marginHorizontal:20,
        marginVertical: 20,
        marginTop:30,
        justifyContent: "space-between",
    },
    cancelButton: {
        backgroundColor: Colors.white,
        borderColor: Colors.grey250,
        borderWidth: 1,
        width: "47%",
    },
    cancelButtonText: {
        color: Colors.black,
    },
    cancelButtonPressable: {
        paddingVertical: 8,
    },
    deleteButton: {
        backgroundColor: Colors.error,
        width: "47%",
    },
});

export default BottomActionCard;
