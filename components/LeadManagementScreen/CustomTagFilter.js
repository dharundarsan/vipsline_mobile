import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Colors from "../../constants/Colors";
import {
    clearAdvancedFilters,
    loadLeadsFromDb,
    updateAdvancedFilters
} from "../../store/leadManagementSlice";
import moment from "moment";
import {Ionicons} from "@expo/vector-icons";

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

    // Define all filters and their respective display logic/actions dynamically
    const filters = [
        {
            key: 'lead_owner',
            value: lead_owner?.name,
            clearFilter: () => dispatch(updateAdvancedFilters({field: "lead_owner", value: undefined})),
        },
        {
            key: 'selectedLeadDateOption',
            value: selectedLeadDateOption
                ? `${moment(fromDate).format("DD-MM-YYYY")} - ${moment(toDate).format("DD-MM-YYYY")}`
                : null,
            clearFilter: () => {
                dispatch(updateAdvancedFilters({field: "selectedLeadDateOption", value: null}));
                dispatch(updateAdvancedFilters({field: "fromDate", value: new Date()}));
                dispatch(updateAdvancedFilters({field: "toDate", value: new Date()}));
            },
        },
        {
            key: 'lead_status',
            value: lead_status,
            clearFilter: () => dispatch(updateAdvancedFilters({field: "lead_status", value: undefined})),
        },
        {
            key: 'selectedLeadFollowUpOption',
            value: selectedLeadFollowUpOption
                ? `${moment(followupDate).format("DD-MM-YYYY")} - ${moment(followupEndDate).format("DD-MM-YYYY")}`
                : null,
            clearFilter: () => {
                dispatch(updateAdvancedFilters({field: "selectedLeadFollowUpOption", value: null}));
                dispatch(updateAdvancedFilters({field: "followupDate", value: new Date()}));
                dispatch(updateAdvancedFilters({field: "followupEndDate", value: new Date()}));
                dispatch(updateAdvancedFilters({field: "leadFollowUp", value: undefined}));
            },
        },
        {
            key: 'lead_source',
            value: lead_source?.name,
            clearFilter: () => dispatch(updateAdvancedFilters({field: "lead_source", value: undefined})),
        },
        {
            key: 'lead_campaign',
            value: lead_campaign?.name,
            clearFilter: () => dispatch(updateAdvancedFilters({field: "lead_campaign", value: undefined})),
        },
        {
            key: 'gender',
            value: gender,
            clearFilter: () => dispatch(updateAdvancedFilters({field: "gender", value: undefined})),
        },
    ];

    // Filter out only active filters (those with non-null values)
    const activeFilters = filters.filter(filter => filter.value);

    return (
        activeFilters.length > 0 && (
            <View style={styles.container}>
                <View style={styles.tagsContainer}>
                    {activeFilters.map(({key, value, clearFilter}) => (
                        <View key={key} style={styles.tag}>
                            <Text style={styles.tagText}>{value}</Text>
                            <TouchableOpacity style={{alignItems: "center"}} onPress={() => {
                                clearFilter();
                                dispatch(loadLeadsFromDb());
                            }}>
                                <Ionicons name="close" size={18} color={Colors.highlight}/>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => {
                        dispatch(clearAdvancedFilters());
                        dispatch(loadLeadsFromDb());
                    }} style={styles.clearAllButton}>
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
        marginBottom: 2,
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
