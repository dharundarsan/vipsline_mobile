import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView, Pressable
} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import SearchBar from "../../ui/SearchBar";
import Divider from "../../ui/Divider";
import React, {useEffect, useState} from "react";
import LeadCard from "./LeadCard";
import {AntDesign, Feather, FontAwesome6, Ionicons, MaterialIcons} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {
    decrementPageNumber,
    incrementPageNumber, resetPageNo, updateFetchingState,
    updateMaxEntry
} from "../../store/leadManagementSlice";
import {clientFilterNames} from "../../util/chooseFilter";
import EntryModel from "../clientSegmentScreen/EntryModel";
import RadioButton from "../../ui/RadioButton";
import {loadLeadsFromDb, loadLeadSourcesFromDb, loadLeadStatusesFromDb} from "../../store/leadManagementSlice";
import getLeadsAPI from "../../util/apis/getLeadsAPI";
import CreateClientModal from "../checkoutScreen/CreateClientModal";
import CreateLeadModal from "./CreateLeadModal";
import * as Haptics from "expo-haptics";
import {addCustomItems, updateCalculatedPrice, updateCustomItem} from "../../store/cartSlice";
import {shadowStyling} from "../../util/Helpers";
import ClientCard from "../clientSegmentScreen/ClientCard";

const LeadDetailsModal = (props) => {
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState(0);

    const styles = StyleSheet.create({
        leadDetailsModal: {
            backgroundColor: Colors.white,
            flex: 1,
        },
        fab: {
            position: "absolute",
            height: 55,
            width: 55,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            backgroundColor: "#6d4fe3",
            // backgroundColor: Colors.highlight,
            bottom: 75,
            right: 20,
            zIndex: 1
        },
        header: {
            // marginTop: Platform.OS === "ios" ? 40 : 0,
            justifyContent: "center",
            alignItems: "center",
            height: 80,
            flexDirection: "row",

        },
        backButton: {
            position: "absolute",
            left: 5,
            backgroundColor: Colors.white,
        },
        backButtonPressable: {
            alignItems: "flex-end",
        },
        headerLeadContainer: {
            flexDirection: "row",
            gap: 10,
        },
        headerLeadProfile: {
            width: 45,
            height: 45,
            backgroundColor: "#E2F4F6",
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
        },
        tabContainer: {
            flexDirection: "row",
            // justifyContent: "space-around",
            alignItems: "center",
            height: 45,
        },
        tab: {
            width: "50%",
            alignItems: "center"
        },
        tabIndicator: {
            width: "50%",
            left: (50 * selectedTab) + "%",
            borderRadius: 100,
            height: 2,
            position: "absolute",
            bottom: 0,
            backgroundColor: Colors.highlight
        },
        modalContent: {
            flex: 1,
            paddingHorizontal: 20,
        },
    })


    return <Modal visible={props.isVisible} style={styles.leadDetailsModal} animationType={"slide"}>
        <View style={styles.header}>
            <View style={styles.headerLeadContainer}>
                <View style={styles.headerLeadProfile}>
                    <Text style={{
                        color: Colors.highlight,
                        fontWeight: "bold",
                        fontSize: 20
                    }}>{props.lead.name[0].toUpperCase()}</Text>
                </View>
                <View style={{justifyContent: "center", gap: 2}}>
                    <Text style={[textTheme.labelLarge, {fontSize: 16}]}>{props.lead.name}</Text>
                    <Text style={{fontWeight: "500", color: Colors.grey800}}>{props.lead.mobile}</Text>
                </View>
            </View>
            <PrimaryButton
                buttonStyle={styles.backButton}
                pressableStyle={styles.backButtonPressable}
                onPress={props.onCloseModal}
            >
                <AntDesign name="arrowleft" size={24} color="black"/>
            </PrimaryButton>
        </View>
        <Divider/>
        <View style={[styles.tabContainer, shadowStyling]}>
            <Pressable style={styles.tab} onPress={() => {
                setSelectedTab(0)
            }}>
                <Text style={[selectedTab === 0 ? {color: Colors.highlight} : {}, {fontSize: 15}]}>Lead Profile</Text>
            </Pressable>
            <Pressable style={styles.tab} onPress={() => {
                setSelectedTab(1)
            }}>
                <Text style={[selectedTab === 1 ? {color: Colors.highlight} : {}, {fontSize: 15}]}>Enquiry Notes</Text>
            </Pressable>
            <View style={styles.tabIndicator}/>
        </View>
        <Divider/>
        <PrimaryButton buttonStyle={styles.fab}
                       onPress={() => {
                       }}
                       pressableStyle={{flex: 1}}>
            <MaterialIcons name="sticky-note-2" size={24} color="white"/>
        </PrimaryButton>
    </Modal>
}


export default LeadDetailsModal;