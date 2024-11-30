import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView, Pressable, FlatList
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
import getLeadDetailsAPI from "../../util/apis/getLeadDetailsAPI";
import ContentLoader from "react-native-easy-content-loader";
import EnquiryNoteCard from "./EnquiryNoteCard";
import getFollowUpDetailsAPI from "../../util/apis/getFollowUpDetailsAPI";
import EnquiryNotesModal from "./EnquiryNotesModal";

const LeadDetailsModal = (props) => {
    const dispatch = useDispatch();
    const [selectedTab, setSelectedTab] = useState(0);
    const [leadProfile, setLeadProfile] = useState([]);
    const [followUpDetails, setFollowUpDetails] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const leadSources = useSelector(state => state.leads.leadSources);
    const [isEnquiryNotesModalVisible, setIsEnquiryNotesModalVisible] = useState(false);
    const [isEditLeadModalVisible, setIsEditLeadModalVisible] = useState(false);

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
            height: "100%",
            alignItems: "center",
            justifyContent: "center"
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
        leadProfileContent: {
            flex: 1,
            paddingHorizontal: 25,
            paddingVertical: 25,
        },
        enquiryNotesContent: {
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 30,
            gap: 30,
        },
        leadProfileContainer: {
            borderColor: "#D5D7DA",
            borderWidth: 1,
            borderRadius: 8,
        },
        leadProfileHeader: {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexDirection: "row",
            backgroundColor: "#F8F8FB",
            borderBottomColor: "#D5D7DA",
            borderBottomWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 5,
            alignItems: "center",
            justifyContent: "space-between",
            height: 50,
        },
        detailsContainer: {
            padding: 20,
        }
    })

    const apiCalls = async () => {
        setIsLoading(true)
        let response = await getLeadDetailsAPI(props.lead.lead_id, props.lead.lead_source);
        setLeadProfile(response.data.data[0]);
        response = await getFollowUpDetailsAPI(props.lead.lead_id);
        setFollowUpDetails(response.data.data)
        setIsLoading(false)
    }
    useEffect(() => {
        apiCalls()
    }, []);

    const validateField = (value, fallback = "Not added") => (value ? value : fallback);

    return <Modal visible={props.isVisible} style={styles.leadDetailsModal} animationType={"slide"}
                  presentationStyle={"pageSheet"}>
        {isEditLeadModalVisible && <CreateLeadModal
            isVisible={isEditLeadModalVisible}
            onCloseModal={() => setIsEditLeadModalVisible(false)}
            refreshData={apiCalls}
            edit={true}
            data={{...leadProfile, ...props.lead}}
        />}
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

        {selectedTab === 0 && <ScrollView>
            <View style={styles.leadProfileContent}>
                <View style={styles.leadProfileContainer}>
                    <View style={styles.leadProfileHeader}>
                        <Text style={textTheme.titleMedium}>Lead Profile</Text>
                        <PrimaryButton
                            pressableStyle={{
                                paddingHorizontal: 10,
                                paddingVertical: 10
                            }}
                            onPress={() => {
                                setIsEditLeadModalVisible(true);
                            }}
                            buttonStyle={{
                                backgroundColor: "white", borderColor: "#D5D7DA",
                                borderWidth: 1,
                                borderRadius: 8,
                            }}>
                            <Feather name="edit-2" size={15} color="black"/>
                        </PrimaryButton>
                    </View>
                    {isLoading ? <View>
                            <ContentLoader
                                pRows={9}
                                pHeight={[55, 55, 55, 55, 55, 55, 55, 55, 55]}
                                pWidth={["100%"]}
                                active
                                title={false}
                            />
                        </View> :
                        <View style={styles.detailsContainer}>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Phone
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.mobile)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Email
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.email)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Gender
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.gender)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Lead Source
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadSources.filter(source => source.id.toString() === (leadProfile?.lead_source?.toString()))[0]?.name)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Campaign
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.lead_campaign_name)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Lead Owner
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.lead_owner)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Address
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.address)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Location
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.location)}
                            </Text>
                            <Text/>
                            <Text style={[textTheme.bodyMedium, {color: Colors.grey700, fontWeight: "700"}]}>
                                Pincode
                            </Text>
                            <Text style={[textTheme.bodyMedium, {fontWeight: "bold", fontSize: 15}]}>
                                {validateField(leadProfile?.pincode)}
                            </Text>
                        </View>}
                </View>
            </View>
        </ScrollView>}
        {selectedTab === 1 && <ScrollView style={{flex: 1}}>
            {isLoading ? <ContentLoader
                pRows={5}
                pHeight={[150, 150, 150, 150, 150]}
                pWidth={["100%"]}
                active
                title={false}
            /> : <View style={styles.enquiryNotesContent}>
                {isEnquiryNotesModalVisible &&
                    <EnquiryNotesModal refreshLeadsData={apiCalls} isVisible={isEnquiryNotesModalVisible}
                                       lead={props.lead} onCloseModal={() => {
                        setIsEnquiryNotesModalVisible(false)
                    }}/>}
                <FlatList scrollEnabled={false} data={followUpDetails}
                          renderItem={({item}) => <EnquiryNoteCard lead={props.lead} refreshLeadsData={apiCalls}
                                                                   followup={item}/>}/>
            </View>}
        </ScrollView>}
        {selectedTab === 1 && <PrimaryButton buttonStyle={styles.fab}
                                             onPress={() => {
                                                 setIsEnquiryNotesModalVisible(true);
                                             }}
                                             pressableStyle={{flex: 1}}>
            <MaterialIcons name="sticky-note-2" size={24} color="white"/>
        </PrimaryButton>}
    </Modal>
}


export default LeadDetailsModal;