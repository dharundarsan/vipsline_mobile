import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView
} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import SearchBar from "../../ui/SearchBar";
import Divider from "../../ui/Divider";
import React, {useEffect, useState} from "react";
import LeadCard from "./LeadCard";
import {AntDesign, Feather, FontAwesome6} from "@expo/vector-icons";
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

const LeadDetailsModal = (props) => {
    const dispatch = useDispatch();

    return <Modal visible={props.isVisible} style={styles.leadDetailsModal}>
        <PrimaryButton buttonStyle={styles.fab}
                       onPress={() => {}}
                       pressableStyle={{flex: 1}}>
            <Feather name="plus" size={24}
                     color={Colors.white}/>
        </PrimaryButton>
    </Modal>
}

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
        backgroundColor: Colors.highlight,
        bottom: 75,
        right: 20,
        zIndex: 1
    },
    noLeadContainer: {
        alignItems: "center"
    },
    content: {},
    searchBarAndFilterContainer: {
        margin: 15
    },
    menuImage: {
        width: 20,
        height: 20,
    },
    leadCountContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        gap: 10,
    },
    leadCountText: {
        fontWeight: "700",
    },
    pagination: {
        height: 90,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
    },
    disabled: {
        opacity: 0.4,
    },
    entryText: {},
    entryButton: {},
    entryButtonContainer: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginLeft: 16,
        backgroundColor: Colors.white,
    },
    paginationInnerContainer: {
        flexDirection: 'row',
        marginRight: 16,
        alignItems: "center",
    },
    pageForwardButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
    },
    pageBackwardButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey250,
        marginHorizontal: 16
    },
    buttonInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    pagingText: {},
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 10,
    },
    innerContainer: {
        width: '100%',
        paddingVertical: 15,
    },
})

export default LeadDetailsModal;