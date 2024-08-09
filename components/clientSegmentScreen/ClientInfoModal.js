import {Modal, Text, View, StyleSheet, ScrollView} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Feather, Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import ClientCard from "./ClientCard";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ClientSaleInfo from "./ClientSalesInfo";
import ClientInfoCategories from "./ClientInfoCategories";
import ClientDetailedInfoModal from "./ClientDetailedInfoModal";
import {useState} from "react";

export default function clientInfoModal(props) {
    const [categoryPressed, setCategoryPressed] = useState(false);

    function clientInfoCategoryPressHandler() {
        setCategoryPressed(true);
    }

    function closeDetailedInfoModalHandler() {
        setCategoryPressed(false);
    }

    return (
        <Modal visible={props.visible} animationType={"slide"}>
            <ClientDetailedInfoModal
                modalVisiblity={categoryPressed}
                clientName={props.name}
                closeModal={closeDetailedInfoModalHandler}
            />
            <View style={styles.closeAndHeadingContainer}>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={props.closeModal}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
            </View>
            <ScrollView>
            <View style={styles.modalContent}>
                <ClientCard
                    name={props.name}
                    phone={props.phone}
                    card={styles.clientDetailsContainer}
                    nameText={[textTheme.titleSmall, styles.name]}
                    phoneText={[textTheme.titleSmall, styles.phone]}
                />
                <View style={styles.optionsContainer}>
                    <PrimaryButton buttonStyle={styles.updateOrDeleteOption}>
                        <SimpleLineIcons name="options" size={24} color="black" />
                    </PrimaryButton>
                    <PrimaryButton buttonStyle={styles.callButton} pressableStyle={styles.pressableStyle}>
                        <View style={{flexDirection: "row"}}>
                            <Feather name="phone" size={18} color="black" />
                            <Text style={[textTheme.bodyMedium, {marginLeft: 8}]}>Call</Text>
                        </View>

                    </PrimaryButton>
                    <PrimaryButton buttonStyle={styles.bookButton} pressableStyle={styles.pressableStyle}>
                        <Text style={[textTheme.bodyMedium, {color: Colors.white}]}>
                            Book now
                        </Text>
                    </PrimaryButton>
                </View>

                <ClientSaleInfo
                    totalSales={7000}
                    lastVisit={"25 August 2024"}
                    salesCard={styles.salesCard}
                />

                <View style={styles.clientInfoCategoryContainer}>
                    <ClientInfoCategories
                        onPress={clientInfoCategoryPressHandler}

                    />
                </View>
            </View>
            </ScrollView>


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
    },
    optionsContainer: {
        flexDirection: "row",
        width: "85%",
        justifyContent: "space-around"
    },
    updateOrDeleteOption: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    callButton: {
        width: '30%',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    bookButton: {
        width: '30%'
    },
    pressableStyle: {
        flex: 1
    },
    salesCard: {
        marginTop: 64
    },
    clientInfoCategoryContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        borderRadius: 12,
        width: '90%',
        marginTop: 16,
        overflow: 'hidden',
        marginBottom: 32
    }
})