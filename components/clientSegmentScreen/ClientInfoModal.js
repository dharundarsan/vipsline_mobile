import {Modal, Text, View, StyleSheet} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import ClientCard from "./ClientCard";



export default function (props) {
    return (
        <Modal visible={props.visible} animationType={"slide"} >
            <View style={styles.closeAndHeadingContainer}>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={props.closeModal}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <View style={styles.modalContent}>
                <ClientCard
                    name={props.name}
                    phone={props.phone}
                    card={styles.clientDetailsContainer}
                    nameText={[textTheme.titleSmall, styles.name]}
                    phoneText={[textTheme.titleSmall, styles.phone]}
                />
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        alignItems: 'center',
    },
    closeAndHeadingContainer: {
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
    titleText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
    clientDetailsContainer: {
        width: "auto",
    },
    name: {
        fontWeight: '600',
    },
    phone: {
    }
})