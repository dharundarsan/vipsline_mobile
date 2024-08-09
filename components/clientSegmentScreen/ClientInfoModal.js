import {Modal, Text, View, StyleSheet, ScrollView} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {AntDesign, Feather, Ionicons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import ClientCard from "./ClientCard";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ClientSaleInfo from "./ClientSalesInfo";
import ClientInfoCategories from "./ClientInfoCategories";
import ClientDetailedInfoModal from "./ClientDetailedInfoModal";
import React, {useState} from "react";
import Divider from "../../ui/Divider";


export default function clientInfoModal(props) {
    const [clientMoreDetails, setClientMoreDetails] = useState(null);

    function clientInfoCategoryPressHandler(id) {
        console.log(id);
        setClientMoreDetails(id);
    }
    function seeMoreStatisticsHandler() {
        console.log("seeMoreStatisticsHandler");
        setClientMoreDetails("seeMoreStats");
    }
    let content;

    if(clientMoreDetails === null) {
        content = <ScrollView>
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
                    onPress={seeMoreStatisticsHandler}
                />

                <View style={styles.clientInfoCategoryContainer}>
                    <ClientInfoCategories
                        onPress={clientInfoCategoryPressHandler}
                    />
                </View>
            </View>
        </ScrollView>

    }
    else if(clientMoreDetails === "seeMoreStats") {
        content = <ClientDetailedInfoModal
            selectedCategory={clientMoreDetails}
        />
    }
    else if(clientMoreDetails === "clientDetails") {
        content = <ClientDetailedInfoModal
            selectedCategory={clientMoreDetails}
        />
    }

    return (
        <Modal visible={props.visible} animationType={"slide"}>
            <View style={styles.closeAndHeadingContainer}>
                {
                    clientMoreDetails === null ?
                        null :
                        <PrimaryButton
                            buttonStyle={styles.backButton}
                            onPress={() => {
                                setClientMoreDetails(null);
                            }}
                        >
                            <AntDesign name="arrowleft" size={24} color="black"/>
                        </PrimaryButton>
                }

                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={props.closeModal}
                >
                    <Ionicons name="close" size={25} color="black"/>
                </PrimaryButton>
                {
                    clientMoreDetails === null ?
                        null :
                    <ClientCard
                        name={props.name}
                        card={styles.clientProfileCard}
                        cardInnerContainer={styles.cardInnerContainer}
                        rippleColor={Colors.white}
                    />
                }

            </View>
            {
                clientMoreDetails === null ?
                    null :
                    <>
                    <Divider />
                    </>
            }
            {content}

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
    },
    backButton: {
        position: "absolute",
        left: 0,
        backgroundColor: Colors.background,
    },
    clientProfileCard: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        width: 'auto'
    },
    cardInnerContainer: {
        marginLeft: 0
    },
})