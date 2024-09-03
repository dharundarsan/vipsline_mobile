import {Modal, View, Text, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import PrimaryButton from "../../ui/PrimaryButton";
import textTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import Divider from "../../ui/Divider";
import {Ionicons} from "@expo/vector-icons";
import deleteClientAPI from "../../util/apis/deleteClientAPI";
import {useDispatch, useSelector} from "react-redux";
import {loadClientCountFromDb} from "../../store/clientSlice";
import {
    loadClientFiltersFromDb,
    loadSearchClientFiltersFromDb,
    updateMaxEntry,
    updateSearchClientMaxEntry
} from "../../store/clientFilterSlice";
import {clientFilterNames} from "../../util/chooseFilter";

export default function DeleteClient(props) {
    const dispatch = useDispatch();
    const currentClientId = useSelector(state => state.clientInfo.clientId);

    return (
        <Modal
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
                    <Text style={[textTheme.titleLarge, styles.deleteClientText]}>Delete Client</Text>
                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={() => {
                            props.onCloseModal();
                        }}
                    >
                        <Ionicons name="close" size={25} color="black"/>
                    </PrimaryButton>
                </View>
                <View style={styles.deleteClientCardContainer}>
                    <Text style={[textTheme.bodyLarge]}>Are you sure? This action cannot be undone.</Text>
                    <View style={styles.deleteClientCardButtonContainer}>
                        <PrimaryButton
                            label={"cancel"}
                            buttonStyle={styles.cancelButton}
                            pressableStyle={styles.cancelButtonPressable}
                            textStyle={[textTheme.titleMedium, styles.cancelButtonText]}
                            onPress={props.onCloseModal}
                        />
                        <PrimaryButton
                            label={"Delete"}
                            buttonStyle={styles.deleteButton}
                            textStyle={[textTheme.titleMedium]}
                            onPress={() => {
                                deleteClientAPI(currentClientId);
                                props.onCloseModal();
                                props.onCloseClientInfoAfterDeleted();
                                dispatch(loadClientCountFromDb());
                                dispatch(loadClientFiltersFromDb(10, "All"));
                                dispatch(loadSearchClientFiltersFromDb(10, "All", ""));
                            }}

                        />
                    </View>

                </View>


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
        position: "absolute",
        right: 0,
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
        backgroundColor: Colors.ripple,
    },
    dropdownList: {
        backgroundColor: Colors.white,
        flexGrow: 0,
        borderRadius: 5,
    },
    label: {
        width: "100%",
        backgroundColor: Colors.background,
        alignItems: "center",
        elevation: 0.5,
    },
    deleteClientText: {
        paddingVertical: 10
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