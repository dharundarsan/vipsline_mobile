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
import Colors from "../constants/Colors";
import textTheme from "../constants/TextTheme";
import PrimaryButton from "../ui/PrimaryButton";
import SearchBar from "../ui/SearchBar";
import Divider from "../ui/Divider";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import LeadCard from "../components/LeadManagementScreen/LeadCard";
import {AntDesign, Feather, FontAwesome6} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {
    decrementPageNumber,
    incrementPageNumber, initialLeadState, resetPageNo, updateFetchingState,
    updateMaxEntry, updateSearchTerm
} from "../store/leadManagementSlice";
import {clientFilterNames} from "../util/chooseFilter";
import EntryModel from "../components/clientSegmentScreen/EntryModel";
import RadioButton from "../ui/RadioButton";
import {loadLeadsFromDb, loadLeadSourcesFromDb, loadLeadStatusesFromDb} from "../store/leadManagementSlice";
import getLeadsAPI from "../util/apis/getLeadsAPI";
import CreateClientModal from "../components/checkoutScreen/CreateClientModal";
import CreateLeadModal from "../components/LeadManagementScreen/CreateLeadModal";
import * as Haptics from "expo-haptics";
import {addCustomItems, updateCalculatedPrice, updateCustomItem} from "../store/cartSlice";
import LeadDetailsModal from "../components/LeadManagementScreen/LeadDetailsModal";
import ContentLoader from "react-native-easy-content-loader";
import EnquiryNotesModal from "../components/LeadManagementScreen/EnquiryNotesModal";
import {updateNavigationState} from "../store/NavigationSlice";
import LeadAdvancedFiltersModal from "../components/LeadManagementScreen/LeadAdvancedFiltersModal";
import moment from "moment";
import CustomTagFilter from "../components/LeadManagementScreen/CustomTagFilter";
import Toast from "../ui/Toast";

const LeadManagementScreen = () => {
    const maxEntry = useSelector(state => state.leads.maxEntry);
    const totalCount = useSelector(state => state.leads.totalLeadCount)
    const searchTerm = useSelector(state => state.leads.searchTerm)
    const [upperCount, setUpperCount] = useState(10);
    const [lowerCount, setLowerCount] = useState(1);
    const leads = useSelector(state => state.leads.leads);
    const [isBackwardButtonDisabled, setIsBackwardButtonDisabled] = useState(false);
    const [isForwardButtonDisabled, setIsForwardButtonDisabled] = useState(false);
    const [isPaginationModalVisible, setIsPaginationModalVisible] = useState(false);
    const dispatch = useDispatch();
    const [isCreateLeadModalVisible, setIsCreateClientModalVisible] = useState(false);
    const [doesLeadExist, setDoesLeadExist] = useState(false);
    const isFetching = useSelector(state => state.leads.isFetching);
    const businessId = useSelector(state => state.authDetails.businessId);
    const [isAdvancedFiltersModalVisible, setIsAdvancedFiltersModalVisible] = useState(false);

    // const {followupDate, followupEndDate, fromDate, toDate, gender, leadFollowUp, lead_campaign, lead_owner, lead_source, lead_status, selectedLeadFollowUpOption} = useSelector(state => state.leads);


    const options = [
        {label: '10', value: 10},
        {label: '25', value: 25},
        {label: '50', value: 50},
        {label: '100', value: 100},
    ];

    useEffect(() => {
        dispatch(updateNavigationState("Lead Management Screen"));
    }, []);


    useLayoutEffect(() => {
        const apiCalls = async () => {
            dispatch(updateFetchingState(true));
            dispatch(updateSearchTerm(""));
            await dispatch(loadLeadStatusesFromDb());
            await dispatch(loadLeadSourcesFromDb());
            const response = await dispatch(loadLeadsFromDb());
            setDoesLeadExist(response.data.data[0].count > 0)
            await dispatch(loadLeadsFromDb());
            dispatch(updateFetchingState(false));
        }
        apiCalls();
    }, [businessId]);

    useEffect(() => {
        if (lowerCount === 1) {
            setIsBackwardButtonDisabled(true);
        } else {
            setIsBackwardButtonDisabled(false);
        }

        if (upperCount >= totalCount) {
            setIsForwardButtonDisabled(true);
        } else {
            setIsForwardButtonDisabled(false);
        }
    }, [lowerCount, upperCount, maxEntry, totalCount]);

    function backwardButtonHandler() {
        if (!isBackwardButtonDisabled) {
            let lowerCountAfter = lowerCount - maxEntry;
            let upperCountAfter = upperCount - maxEntry;

            if (lowerCountAfter === 1 && upperCountAfter < maxEntry) {
                dispatch(decrementPageNumber())
                dispatch(loadLeadsFromDb())
                setLowerCount(1);
                setUpperCount(maxEntry);
            } else if (lowerCountAfter < 1 && upperCountAfter < maxEntry) {
                dispatch(decrementPageNumber())
                dispatch(loadLeadsFromDb())
                setLowerCount(1);
                setUpperCount(maxEntry);
            } else if (upperCountAfter >= 1 && upperCountAfter >= maxEntry) {
                dispatch(decrementPageNumber())
                dispatch(loadLeadsFromDb())
                setLowerCount(lowerCountAfter);
                setUpperCount(lowerCountAfter - upperCountAfter === maxEntry ? upperCountAfter : lowerCountAfter + maxEntry - 1);
            }
        }
    }

    function forwardButtonHandler() {
        if (!isForwardButtonDisabled) {
            let lowerCountAfter = lowerCount + maxEntry;
            let upperCountAfter = upperCount + maxEntry;

            if (upperCountAfter > totalCount && lowerCountAfter < 0) {
                setLowerCount(totalCount - maxEntry);
                setUpperCount(totalCount);
            } else if (upperCountAfter <= totalCount && lowerCountAfter >= 0) {
                dispatch(incrementPageNumber())
                dispatch(loadLeadsFromDb())
                setLowerCount(lowerCountAfter);
                setUpperCount(upperCountAfter);
            } else if (upperCountAfter > totalCount && upperCountAfter >= 0) {
                dispatch(incrementPageNumber())
                dispatch(loadLeadsFromDb())
                setUpperCount(totalCount);
                setLowerCount(lowerCountAfter)
            } else if (lowerCountAfter < 0 && upperCountAfter < totalCount) {
                dispatch(incrementPageNumber())
                dispatch(loadLeadsFromDb())
                setUpperCount(upperCountAfter)
                setLowerCount(0)
            }
        }
    }

    const leadManagementToastRef = useRef();

    return <View style={styles.leadManagementScreen}>
        <Toast ref={leadManagementToastRef}/>
        {isCreateLeadModalVisible && <CreateLeadModal isVisible={isCreateLeadModalVisible}
                                                      leadManagementToastRef={leadManagementToastRef}
                                                      onCloseModal={() => setIsCreateClientModalVisible(false)}/>}
        {isAdvancedFiltersModalVisible ? <LeadAdvancedFiltersModal onCloseModal={() => {
            setIsAdvancedFiltersModalVisible(false)
        }} isVisible={isAdvancedFiltersModalVisible}/> : null}
        {!(totalCount === 0 && !doesLeadExist) ? <PrimaryButton buttonStyle={styles.fab}
                                                                onPress={() => setIsCreateClientModalVisible(true)}
                                                                pressableStyle={{flex: 1}}>
            <Feather name="plus" size={24}
                     color={Colors.white}/>
        </PrimaryButton> : <></>}
        {
            isPaginationModalVisible &&
            <Modal
                visible={isPaginationModalVisible}
                animationType="fade"
                transparent={true}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.overlay}
                    onPress={() => setIsPaginationModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select Max Count</Text>
                        <View style={styles.innerContainer}>
                            <RadioButton
                                options={options}
                                value={maxEntry}
                                onPress={(value) => {
                                    setIsPaginationModalVisible(false);
                                    dispatch(resetPageNo());
                                    dispatch(updateMaxEntry(value));
                                    setLowerCount(1)
                                    setUpperCount(value)
                                    dispatch(loadLeadsFromDb())
                                }}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        }
        {isFetching ?
            <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                <ContentLoader
                    pRows={10}
                    pHeight={[55, 45, 70, 70, 70, 70, 70, 70, 70, 70]}
                    pWidth={["100%"]}
                    active
                    title={false}
                />
            </View> :
            totalCount === 0 && !doesLeadExist ?
                <View style={styles.noLeadContainer}>
                    <Text style={[textTheme.titleMedium, {marginTop: 100}]}>Convert your lead into a Client</Text>
                    <Text style={[textTheme.bodyMedium, {
                        textAlign: "center",
                        marginTop: 12,
                        marginBottom: 40,
                        width: "80%"
                    }]}>Efficiently
                        collect, organize, analyse, and track the potential leads;
                        interact with them to nurture them into clients</Text>
                    <PrimaryButton label={"Create Lead"} onPress={() => {
                        setIsCreateClientModalVisible(true)
                    }} width={"50%"}/>
                </View> :
                <View style={styles.content}>
                    <ScrollView fadingEdgeLength={100} style={{flex: 1}}>
                        <View style={styles.searchBarAndFilterContainer}>
                            <SearchBar
                                filter
                                onPressFilter={() => {
                                    setIsAdvancedFiltersModalVisible(true);
                                }} onChangeText={async (text) => {
                                dispatch(updateFetchingState(true))
                                dispatch(resetPageNo())
                                dispatch(updateSearchTerm(text));
                                dispatch(updateFetchingState(true))
                                dispatch(loadLeadsFromDb());
                                dispatch(updateFetchingState(false))
                            }} placeholder={"Search by name email or mobile "}/>
                        </View>
                        <Divider/>
                        <View>
                            <CustomTagFilter/>
                        </View>
                        <Divider/>
                        <View style={[styles.leadCountContainer]}>
                            <Image source={require("../assets/icons/menu.png")} style={styles.menuImage}/>
                            <Text style={[textTheme.bodyMedium, styles.leadCountText]}>Lead Count: <Text
                                style={{color: Colors.highlight}}>{totalCount}</Text></Text>
                        </View>
                        <Divider/>
                        {totalCount === 0 ?
                            <View style={{justifyContent: "center", alignItems: "center", flex: 1, height: 500}}>
                                <Text style={{fontWeight: "bold"}}>No Leads Data</Text>
                            </View> : leads.map(lead => (
                                <LeadCard
                                    lead={lead}
                                    followUp={lead.followup_date}
                                    name={lead.name}
                                    status={lead.lead_status}
                                    phoneNo={lead.mobile}
                                    leadManagementToastRef={leadManagementToastRef}
                                />
                            ))}
                        {totalCount < 10 ? null : <View style={styles.pagination}>
                            <PrimaryButton
                                pressableStyle={styles.entryButton}
                                buttonStyle={styles.entryButtonContainer}
                                onPress={() => setIsPaginationModalVisible(true)}
                            >
                                <View style={styles.buttonInnerContainer}>
                                    <Text style={styles.entryText}>
                                        {maxEntry}
                                    </Text>
                                    <AntDesign name="caretdown" size={14} color="black" style={{marginLeft: 16}}/>
                                </View>
                            </PrimaryButton>

                            <View style={styles.paginationInnerContainer}>
                                <Text style={styles.pagingText}>
                                    {lowerCount < 0 ? 0 : lowerCount} - {upperCount} of {totalCount}
                                </Text>
                                <PrimaryButton
                                    buttonStyle={[isBackwardButtonDisabled ? [styles.pageBackwardButton, styles.disabled] : [styles.pageBackwardButton]]}
                                    onPress={backwardButtonHandler}
                                >
                                    <FontAwesome6 name="angle-left" size={24} color="black"/>
                                </PrimaryButton>
                                <PrimaryButton
                                    buttonStyle={[isForwardButtonDisabled ? [styles.pageForwardButton, styles.disabled] : [styles.pageForwardButton]]}
                                    onPress={forwardButtonHandler}
                                >
                                    <FontAwesome6 name="angle-right" size={24} color="black"/>
                                </PrimaryButton>
                            </View>
                        </View>}
                    </ScrollView>
                </View>
        }
    </View>
}

const styles = StyleSheet.create({
    leadManagementScreen: {
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
    content: {
        flex: 1
    },
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

export default LeadManagementScreen;