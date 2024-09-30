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
import { useNavigation } from "@react-navigation/native";
import { useLocationContext } from "../../context/LocationContext";

/**
 * DeleteClient Component
 *
 * This component displays a modal for confirming the deletion of a client. It provides options to cancel the deletion or proceed with it.
 *
 * Props:
 * @param {boolean} props.isVisible - Controls the visibility of the modal.
 * @param {function} props.onCloseModal - Function to close the modal.
 * @param {function} props.onCloseClientInfoAfterDeleted - Function to close the client info screen after deletion.
 * @param {string} props.header - The header text displayed at the top of the modal.
 * @param {string} props.content - The content text displayed inside the modal, typically a message asking for confirmation.
 */


export default function DeleteClient(props) {
    const dispatch = useDispatch();
    const currentClientId = useSelector(state => state.clientInfo.clientId);
    const navigation = useNavigation();
    const {reload} = useLocationContext();
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
                    <Text style={[textTheme.titleLarge, styles.deleteClientText]}>{props.header}</Text>
                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        pressableStyle={styles.closeButtonPressable}
                        onPress={() => {
                            if(props.setVisible !== undefined){
                                // props.setVisible(false);
                                // console.log("reload "+reload);
                                
                                // setTimeout(()=>{
                                //     navigation.navigate("Checkout", { screen: "CheckoutScreen" });
                                // },100)
                                props.onCloseModal();
                            }
                            else{
                                props.onCloseModal();
                            }
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
                            label={"Delete"}
                            buttonStyle={styles.deleteButton}
                            textStyle={[textTheme.titleMedium]}
                            onPress={() => {
                                if(props.deleteClient) deleteClientAPI(currentClientId);
                                if(props.setVisible !== undefined){
                                    props.setVisible(false);
                                }
                                else{
                                    props.onCloseModal();
                                }
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
        right: 10,
        top:5,
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
        paddingVertical:5,
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