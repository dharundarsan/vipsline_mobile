import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from "../../constants/Colors";
import {initialLeadState, updateAdvancedFilters} from "../../store/leadManagementSlice";
import {checkNullUndefined} from "../../util/Helpers";
import moment from "moment";

const CustomTagFilter = () => {
    const dispatch = useDispatch();

    // Extract required fields from Redux state
    const {
        followupDate,
        followupEndDate,
        fromDate,
        toDate,
        gender,
        leadFollowUp,
        lead_campaign,
        lead_owner,
        lead_source,
        lead_status,
        selectedLeadFollowUpOption,
        selectedLeadDateOption
    } = useSelector((state) => state.leads);

    // Create an active filter map for display and dispatching reset actions
    const activeFilters = [
        { key: "followupDate", value: followupDate, label: "Follow-Up Date" },
        { key: "followupEndDate", value: followupEndDate, label: "Follow-Up End Date" },
        { key: "fromDate", value: fromDate, label: "From Date" },
        { key: "toDate", value: toDate, label: "To Date" },
        { key: "gender", value: gender, label: "Gender" },
        { key: "leadFollowUp", value: leadFollowUp, label: "Lead Follow-Up" },
        { key: "lead_campaign", value: lead_campaign, label: "Lead Campaign" },
        { key: "lead_owner", value: lead_owner, label: "Lead Owner" },
        { key: "lead_source", value: (lead_source?.name) === undefined ? "" : lead_source?.name, label: "Lead Source" },
        { key: "lead_status", value: lead_status, label: "Lead Status" },
        { key: "selectedLeadFollowUpOption", value: selectedLeadFollowUpOption, label: "Selected Follow-Up Option" },
    ].filter((filter) => filter.value !== null && filter.value !== undefined && filter.value !== initialLeadState.followupDate); // Include only active filters


    const removeOption = (optionKey) => {
        switch (optionKey) {
            case "followupDate":
                dispatch(updateAdvancedFilters({field: "followupDate", value: initialLeadState.followupDate}))
                break;
            case "followupEndDate":
                dispatch(updateAdvancedFilters({field: "followupEndDate", value: initialLeadState.followupEndDate}))
                break;
            case "fromDate":
                dispatch(updateAdvancedFilters({field: "fromDate", value: initialLeadState.fromDate}))
                break;
            case "toDate":
                dispatch(updateAdvancedFilters({field: "toDate", value: initialLeadState.toDate}))
                break;
            case "gender":
                dispatch(updateAdvancedFilters({field: "gender", value: initialLeadState.gender}))
                break;
            case "leadFollowUp":
                dispatch(updateAdvancedFilters({field: "leadFollowUp", value: initialLeadState.leadFollowUp}))
                break;
            case "lead_campaign":
                dispatch(updateAdvancedFilters({field: "lead_campaign", value: initialLeadState.lead_campaign}))
                break;
            case "lead_owner":
                dispatch(updateAdvancedFilters({field: "lead_owner", value: initialLeadState.lead_owner}))
                break;
            case "lead_source":
                dispatch(updateAdvancedFilters({field: "lead_source", value: initialLeadState.lead_source}))
                break;
            case "lead_status":
                dispatch(updateAdvancedFilters({field: "lead_status", value: initialLeadState.lead_status}))
                break;
            case "selectedLeadFollowUpOption":
                dispatch(updateAdvancedFilters({field: "selectedLeadFollowUpOption", value: initialLeadState.selectedLeadFollowUpOption}))
                break;
            case "selectedLeadDateOption":
                dispatch(updateAdvancedFilters({field: "selectedLeadDateOption", value: initialLeadState.selectedLeadDateOption}))
                break;
            default:
                console.warn(`No dispatch action defined for key: ${optionKey}`);
        }
    };

    // Clear all options
    const clearAllOptions = () => {
        activeFilters.forEach((filter) => removeOption(filter.key));
    };

    return (
        activeFilters.length > 0 && (
            <View style={styles.container}>
                <View style={styles.tagsContainer}>
                    {activeFilters.map((filter, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{String(filter.value)}</Text>
                            <TouchableOpacity onPress={() => removeOption(filter.key)}>
                                <Text style={styles.closeButton}>x</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity onPress={clearAllOptions} style={styles.clearAllButton}>
                        <Text style={styles.clearAll}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 16,
        columnGap: 8,
        rowGap: 12,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: Colors.highlight,
        borderRadius: 6,
    },
    tagText: {
        color: Colors.highlight,
        marginRight: 5,
    },
    closeButton: {
        color: Colors.highlight,
        fontWeight: 'bold',
    },
    clearAll: {
        color: Colors.highlight,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    clearAllButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});

export default CustomTagFilter;
