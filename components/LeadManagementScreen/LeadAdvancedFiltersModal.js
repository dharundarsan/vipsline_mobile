import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import React, {useEffect, useLayoutEffect, useState} from "react";
import Colors from "../../constants/Colors";
import deleteLeadAPI from "../../apis/leadManagementAPIs/deleteLeadAPI";
import {clearAdvancedFilters, loadLeadsFromDb, updateAdvancedFilters} from "../../store/leadManagementSlice";
import {updateNavigationState} from "../../store/NavigationSlice";
import CustomTextInput from "../../ui/CustomTextInput";
import {useDispatch, useSelector} from "react-redux";
import getLeadCampaignsAPI from "../../apis/leadManagementAPIs/getLeadCampaignsAPI";
import {Dropdown} from "react-native-element-dropdown";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {formatDateYYYYMMDDD, shadowStyling} from "../../util/Helpers";
import moment from "moment";

const LeadAdvancedFiltersModal = (props) => {
    const selectedLeadFollowUpOption = useSelector(state => state.leads.selectedLeadFollowUpOption)
    const selectedLeadDateOption = useSelector(state => state.leads.selectedLeadDateOption)

    const leadOwner = useSelector(state => state.leads.lead_owner)
    const leadStatus = useSelector(state => state.leads.lead_status)
    const leadSource = useSelector(state => state.leads.lead_source)
    const campaign = useSelector(state => state.leads.lead_campaign)
    const gender = useSelector(state => state.leads.gender)
    const leadFollowUp = useSelector(state => state.leads.leadFollowUp)
    const followupDate = useSelector(state => state.leads.followupDate)
    const followupEndDate = useSelector(state => state.leads.followupEndDate)
    const fromDate = useSelector(state => state.leads.fromDate)
    const toDate = useSelector(state => state.leads.toDate)
    const [isFromDatePickerModalVisible, setIsFromDatePickerModalVisible] = useState(false);
    const [isToDatePickerModalVisible, setIsToDatePickerModalVisible] = useState(false);

    const [isLeadFollowUpDatePickerModalVisible, setIsLeadFollowUpDatePickerModalVisible] = useState(false);
    const [isLeadFollowUpEndDatePickerModalVisible, setIsLeadFollowUpEndDatePickerModalVisible] = useState(false);

    const leadSources = useSelector(state => state.leads.leadSources);
    const staffs = useSelector((state) => state.staff.staffs);
    const [campaignList, setCampaignList] = useState([])

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const api = async () => {
            const response = await getLeadCampaignsAPI((leadSource === null || leadSource === "" || leadSource === undefined) ? 0 : leadSource.id)
            setCampaignList(response.data.data);
        }
        api();
    }, [leadSource]);

    useEffect(() => {
        if (selectedLeadFollowUpOption === "Overdue") {
            dispatch(updateAdvancedFilters({field: "leadFollowUp", value: "overdue"}))
        } else if (selectedLeadFollowUpOption === "Today" || selectedLeadFollowUpOption === "Custom Range") {
            dispatch(updateAdvancedFilters({field: "leadFollowUp", value: "date"}))
        }
    }, [selectedLeadFollowUpOption]);

    useEffect(() => {
        if (selectedLeadDateOption === "Today") {
            dispatch(updateAdvancedFilters({field: "fromDate", value: new Date()}))
            dispatch(updateAdvancedFilters({field: "toDate", value: new Date()}))
        } else if (selectedLeadDateOption === "Yesterday") {
            dispatch(updateAdvancedFilters({
                field: "fromDate",
                value: new Date(new Date().setDate(new Date().getDate() - 1))
            }))
            dispatch(updateAdvancedFilters({
                field: "toDate",
                value: new Date(new Date().setDate(new Date().getDate() - 1))
            }))
        } else if (selectedLeadDateOption === "Last 7 days") {
            dispatch(updateAdvancedFilters({
                field: "fromDate",
                value: new Date(new Date().setDate(new Date().getDate() - 6))
            }))
            dispatch(updateAdvancedFilters({field: "toDate", value: new Date()}))
        } else if (selectedLeadDateOption === "Month") {
            dispatch(updateAdvancedFilters({
                field: "fromDate",
                value: new Date(new Date().setDate(1))
            }))
            dispatch(updateAdvancedFilters({field: "toDate", value: new Date()}))
        } else if (selectedLeadDateOption === "Last 30 days") {
            dispatch(updateAdvancedFilters({
                field: "fromDate",
                value: new Date(new Date().setDate(new Date().getDate() - 29))
            }))
            dispatch(updateAdvancedFilters({field: "toDate", value: new Date()}))
        }
    }, [selectedLeadDateOption]);

    useEffect(() => {
        if (selectedLeadFollowUpOption === "Today") {
            dispatch(updateAdvancedFilters({field: "followupDate", value: new Date()}))
            dispatch(updateAdvancedFilters({field: "followupEndDate", value: new Date()}))
        }
    }, [selectedLeadFollowUpOption]);

    return <Modal style={{flex: 1}} visible={props.isVisible} animationType={"slide"}>
        <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
            <Text style={[textTheme.titleLarge, styles.titleText]}>Lead Filters</Text>
            <PrimaryButton
                buttonStyle={styles.closeButton}
                pressableStyle={styles.closeButtonPressable}
                onPress={props.onCloseModal}
            >
                <Ionicons name="close" size={25} color="black"/>
            </PrimaryButton>
        </View>
        <View style={styles.modalContent}>
            <ScrollView style={{flex: 1, paddingHorizontal: 18}}>
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    placeholder={"Choose filters"}
                    type="dropdown"
                    label="Lead owner"
                    value={leadOwner}
                    onChangeValue={(object) => {
                        dispatch(updateAdvancedFilters({field: "lead_owner", value: object}))
                    }}
                    object={true}
                    objectName="name"
                    dropdownItems={staffs}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    placeholder={"Choose filters"}
                    type="dropdown"
                    label="Lead date"
                    value={selectedLeadDateOption}
                    onChangeValue={(text) => {
                        dispatch(updateAdvancedFilters({field: "selectedLeadDateOption", value: text}))
                    }}
                    dropdownItems={["Today", "Yesterday", "Last 7 days", "Last 30 days", "Month", "Custom Range"]}
                />
                <DateTimePickerModal
                    onConfirm={(date) => {
                        setIsFromDatePickerModalVisible(false);
                        dispatch(updateAdvancedFilters({field: "fromDate", value: date}))
                    }}
                    isVisible={isFromDatePickerModalVisible}
                    mode="date"
                    date={fromDate}
                    themeVariant="light"
                    onCancel={() => setIsFromDatePickerModalVisible(false)}
                />
                <DateTimePickerModal
                    onConfirm={(date) => {
                        setIsToDatePickerModalVisible(false);
                        dispatch(updateAdvancedFilters({field: "toDate", value: date}))
                    }}
                    isVisible={isToDatePickerModalVisible}
                    mode="date"
                    date={toDate}
                    themeVariant="light"
                    onCancel={() => setIsToDatePickerModalVisible(false)}
                />
                <DateTimePickerModal
                    onConfirm={(date) => {
                        setIsLeadFollowUpDatePickerModalVisible(false);
                        dispatch(updateAdvancedFilters({field: "followupDate", value: date}))
                    }}
                    isVisible={isLeadFollowUpDatePickerModalVisible}
                    mode="date"
                    date={followupDate}
                    themeVariant="light"
                    onCancel={() => setIsLeadFollowUpDatePickerModalVisible(false)}
                />
                <DateTimePickerModal
                    onConfirm={(date) => {
                        setIsLeadFollowUpEndDatePickerModalVisible(false);
                        dispatch(updateAdvancedFilters({field: "followupEndDate", value: date}))
                    }}
                    isVisible={isLeadFollowUpEndDatePickerModalVisible}
                    mode="date"
                    date={followupEndDate}
                    themeVariant="light"
                    onCancel={() => setIsLeadFollowUpEndDatePickerModalVisible(false)}
                />
                {selectedLeadDateOption === "Custom Range" ?
                    <View style={styles.customDateBox}>
                        <View style={styles.customDateContainer}>
                            <Pressable
                                style={styles.datePressable}
                                android_ripple={{color: Colors.ripple}}
                                onPress={() => setIsFromDatePickerModalVisible(true)}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Inter-Bold",
                                        fontSize: 12,
                                        fontWeight: "500",
                                        letterSpacing: 0.1,
                                        lineHeight: 20,
                                    }}
                                >
                                    {fromDate === undefined ? "Select to date" : moment(fromDate).format("YYYY MMM DD")}
                                </Text>
                                <MaterialCommunityIcons
                                    name="calendar-month-outline"
                                    size={18}
                                    color={Colors.darkBlue}
                                />
                            </Pressable>
                            <Text> TO </Text>
                            <Pressable
                                style={styles.datePressable}
                                android_ripple={{color: Colors.ripple}}
                                onPress={() => setIsToDatePickerModalVisible(true)}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Inter-Bold",
                                        fontSize: 12,
                                        fontWeight: "500",
                                        letterSpacing: 0.1,
                                        lineHeight: 20,
                                    }}
                                >
                                    {toDate === undefined ? "Select to date" : moment(toDate).format("YYYY MMM DD")}
                                </Text>
                                <MaterialCommunityIcons
                                    name="calendar-month-outline"
                                    size={18}
                                    color={Colors.darkBlue}
                                />
                            </Pressable>
                        </View>
                    </View> : null}
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    placeholder={"Choose filters"}
                    type="dropdown"
                    label="Lead Status"
                    value={leadStatus}
                    onChangeValue={(text) => {
                        dispatch(updateAdvancedFilters({field: "lead_status", value: text}))
                    }}
                    dropdownItems={useSelector(state => state.leads.leadStatuses).map(status => status.name)}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    placeholder={"Choose filters"}
                    type="dropdown"
                    label="Lead follow-up date"
                    value={selectedLeadFollowUpOption}
                    onChangeValue={(text) => {
                        dispatch(updateAdvancedFilters({field: "selectedLeadFollowUpOption", value: text}))
                    }}
                    dropdownItems={["Today", "Overdue", "Custom Range"]}
                />
                {selectedLeadFollowUpOption === "Custom Range" ?
                    <View style={styles.customDateBox}>
                        <View style={styles.customDateContainer}>
                            <Pressable
                                style={styles.datePressable}
                                android_ripple={{color: Colors.ripple}}
                                onPress={() => setIsLeadFollowUpDatePickerModalVisible(true)}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Inter-Bold",
                                        fontSize: 12,
                                        fontWeight: "500",
                                        letterSpacing: 0.1,
                                        lineHeight: 20,
                                    }}
                                >
                                    {followupDate === undefined ? "Select to date" : moment(followupDate).format("YYYY MMM DD")}
                                </Text>
                                <MaterialCommunityIcons
                                    name="calendar-month-outline"
                                    size={18}
                                    color={Colors.darkBlue}
                                />
                            </Pressable>
                            <Text> TO </Text>
                            <Pressable
                                style={styles.datePressable}
                                android_ripple={{color: Colors.ripple}}
                                onPress={() => setIsLeadFollowUpEndDatePickerModalVisible(true)}
                            >
                                <Text
                                    style={{
                                        fontFamily: "Inter-Bold",
                                        fontSize: 12,
                                        fontWeight: "500",
                                        letterSpacing: 0.1,
                                        lineHeight: 20,
                                    }}
                                >
                                    {followupEndDate === undefined ? "Select to date" : moment(followupEndDate).format("YYYY MMM DD")}
                                </Text>
                                <MaterialCommunityIcons
                                    name="calendar-month-outline"
                                    size={18}
                                    color={Colors.darkBlue}
                                />
                            </Pressable>
                        </View>
                    </View> : null}
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    placeholder={"Choose filters"}
                    type="dropdown"
                    label="Lead Source"
                    value={leadSource}
                    object
                    objectName={"name"}
                    onChangeValue={async (object) => {
                        dispatch(updateAdvancedFilters({field: "lead_source", value: object}))
                        dispatch(updateAdvancedFilters({field: "lead_campaign", value: undefined}))
                        const response = await getLeadCampaignsAPI((leadSource === null || leadSource === "" || leadSource === undefined) ? 0 : leadSource.id)
                        setCampaignList(response.data.data);
                    }}
                    dropdownItems={leadSources}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    placeholder={"Choose filters"}
                    type="dropdown"
                    label="Campaign"
                    value={campaign}
                    onChangeValue={(object) => {
                        dispatch(updateAdvancedFilters({field: "lead_campaign", value: object}))
                    }}
                    object
                    objectName={"name"}
                    dropdownItems={campaignList}
                />
                <CustomTextInput
                    labelTextStyle={{fontWeight: "700"}}
                    placeholder={"Choose filters"}
                    type="dropdown"
                    label="Gender"
                    value={gender}
                    onChangeValue={(text) => {
                        dispatch(updateAdvancedFilters({field: "gender", value: text}))
                    }}
                    dropdownItems={["Male", "Female", "Others"]}
                />
            </ScrollView>
            <View style={styles.saveButtonContainer}>
                <PrimaryButton onPress={async () => {
                    dispatch(clearAdvancedFilters());
                    dispatch(loadLeadsFromDb())
                    props.onCloseModal()
                }}
                               buttonStyle={{
                                   backgroundColor: "white",
                                   borderWidth: 1,
                                   borderColor: Colors.grey400,
                                   flex: 1
                               }}
                               pressableStyle={{paddingHorizontal: 8, paddingVertical: 8}}>
                    <Text style={{fontWeight: "bold"}}>Clear</Text>
                </PrimaryButton>
                <PrimaryButton onPress={() => {
                    dispatch(loadLeadsFromDb())
                    props.onCloseModal()
                }} label="Save" buttonStyle={{flex: 3}}/>
            </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
    closeAndHeadingContainer: {
        // marginTop: Platform.OS === "ios" ? 40 : 0,
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
    modalContent: {
        flex: 1,
        marginTop: 14,
    },
    saveButtonContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.grey300,
        flexDirection: "row",
        gap: 12,
    },
    customDateBox: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.grey250,
        backgroundColor: Colors.grey150,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        marginTop: -10,
        marginBottom: 25,
    },
    customDateContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    datePressable: {
        paddingVertical: 10,
        flexDirection: "row-reverse",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
})

export default LeadAdvancedFiltersModal;