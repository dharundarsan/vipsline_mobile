import {KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import {Ionicons} from "@expo/vector-icons";
import CustomTextInput from "../../ui/CustomTextInput";
import PrimaryButton from "../../ui/PrimaryButton";
import deleteClientAPI from "../../apis/ClientSegmentAPIs/deleteClientAPI";
import {loadClientCountFromDb} from "../../store/clientSlice";
import {loadClientFiltersFromDb, loadSearchClientFiltersFromDb} from "../../store/clientFilterSlice";
import deleteLeadAPI from "../../apis/leadManagementAPIs/deleteLeadAPI";
import {loadLeadsFromDb} from "../../store/leadManagementSlice";
import {updateNavigationState} from "../../store/NavigationSlice";
import {useDispatch} from "react-redux";

const ConfirmDeleteLeadModal = (props) => {
    const dispatch = useDispatch();

    return <Modal
        transparent={true}
        animationType={"fade"}
        visible={props.isVisible}
        style={styles.dropdownModal}
    >
        <TouchableOpacity
            style={styles.modalContent}
            // onPress={props.onCloseModal}
            activeOpacity={1}
        >
            <View style={styles.label}>
                <Text style={[textTheme.titleLarge, styles.deleteClientText]}>{props.header}</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={() => {
                        props.onCloseModal()
                    }}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <View style={styles.deleteClientCardContainer}>
                <Text style={[textTheme.bodyLarge]}>{props.content}</Text>
                <View style={styles.deleteClientCardButtonContainer}>
                    <PrimaryButton
                        label={"Cancel"}
                        buttonStyle={styles.cancelButton}
                        pressableStyle={styles.cancelButtonPressable}
                        textStyle={[textTheme.titleMedium, styles.cancelButtonText]}
                        onPress={props.onCloseModal}
                    />
                    <PrimaryButton
                        label={props.ActionOptionName !== undefined ? props.ActionOptionName : "Delete"}
                        buttonStyle={styles.deleteButton}
                        textStyle={[textTheme.titleMedium]}
                        onPress={async () => {
                            await deleteLeadAPI(props.data.lead_id);
                            await dispatch(loadLeadsFromDb());
                            props.onCloseModal();
                            dispatch(updateNavigationState("Lead Management Screen"));
                            props.onConfirm();
                        }}
                    />
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
}

const styles = StyleSheet.create({
    dropdownModal: {
        flex: 1,
        height: "100%",
    },
    closeButton: {
        position: "absolute",
        right: 10,
        top: 5,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    closeButtonText: {
        color: Colors.black
    },
    modalContent: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: Colors.dim300,
    },
    dropdownList: {
        backgroundColor: Colors.white,
        flexGrow: 0,
        borderRadius: 5,
    },
    label: {
        width: "100%",
        paddingVertical: 5,
        backgroundColor: Colors.background,
        alignItems: "center",
        elevation: 0.5,
    },
    deleteClientText: {
        paddingVertical: 10,
    },
    deleteClientCardContainer: {
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: Colors.background,
    },
    deleteClientCardButtonContainer: {
        flexDirection: 'row',
        width: "70%",
        marginVertical: 32,
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: Colors.white,
        borderColor: Colors.grey250,
        borderWidth: 1,
        width: "47%",
    },
    cancelButtonText: {
        color: Colors.black
    },
    cancelButtonPressable: {
        paddingVertical: 8,
    },
    deleteButton: {
        backgroundColor: Colors.error,
        width: "47%",
    }
})

export default ConfirmDeleteLeadModal;