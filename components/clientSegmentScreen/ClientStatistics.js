import ClientStatisticsCard from "./ClientStatisticsCard";
import {View, Text, StyleSheet, FlatList} from "react-native"
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";



export default function ClientStatistics(props) {

    const StatisticsItems = [
        {id: "totalVisit", label: "Total Visit", value: props.totalVisits},
        {id: "lastVisit", label: "Last Visit", value: props.lastVisit},
        {id: "completed", label: "Completed", value: props.completedAppointment},
        {id: "canceled", label: "Canceled", value: props.cancelledAppointment},
        {id: "No shows", label: "No shows", value: props.noShows},
        {id: "reviews", label: "Reviews", value: props.feedbackCount},
    ]


    function renderItem(itemData) {
        return (
             <>
            <ClientStatisticsCard
                label={itemData.item.label}
                value={itemData.item.value}
                containerStyle={styles.cardStyle}
            />
            <View style={{width: 20}}/>
             </>
        );
    }

    return (
        <View style={styles.statistics}>
            <View style={styles.titleContainer}>
                <Text style={[textTheme.titleMedium, styles.title]}>
                    {props.title}
                </Text>
            </View>

            <ClientStatisticsCard
                label={"Total Sales"}
                value={props.totalSales}
                containerStyle={styles.salesStatisticsCard}
            />
            <View style={styles.statisticsCardOuterContainer}>
                <FlatList
                    data={StatisticsItems}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.listStyle}
                    style={{width: '100%'}}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statistics: {
        flex: 1,
        alignItems: "center",
    },
    salesStatisticsCard: {
        width: "95%",
        flexDirection: 'row',
        marginTop: 32,
        height: 95
    },
    statisticsCardOuterContainer: {
        marginTop: 16,
        width: '95%',
    },
    listStyle: {
        gap: 20,
        width: '100%',
    },
    cardStyle: {
        height: 72,
        width: '47.4%',
    },
    titleContainer: {
        marginTop: 16,
        width: '95%',
    },
    title: {
        marginLeft: 16
    }
})