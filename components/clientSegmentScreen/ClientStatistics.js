import ClientStatisticsCard from "./ClientStatisticsCard";
import {View, Text, StyleSheet, FlatList} from "react-native"
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";
import Colors from "../../constants/Colors";


/**
 * ClientStatistics Component
 *
 * This component displays a set of client statistics in a grid format. It includes various statistics like total visits, last visit, completed appointments, etc., as well as a card for total sales.
 *
 * Props:
 * @param {string} props.title - The title for the statistics section.
 * @param {string} props.totalSales - The total sales amount for the client.
 * @param {string} props.totalVisits - The total number of visits made by the client.
 * @param {string} props.lastVisit - The date of the client's last visit.
 * @param {string} props.completedAppointment - The number of completed appointments.
 * @param {string} props.cancelledAppointment - The number of cancelled appointments.
 * @param {string} props.noShows - The number of no-show appointments.
 * @param {string} props.feedbackCount - The number of reviews or feedback given by the client.
 */




export default function ClientStatistics(props) {

    const StatisticsItems = [
        {id: "totalVisit", label: "Total Visit", value: props.totalVisits},
        {id: "lastVisit", label: "Last Visit", value: props.lastVisit},
        {id: "completed", label: "Completed", value: props.completedAppointment},
        {id: "canceled", label: "Cancelled", value: props.cancelledAppointment},
        {id: "No shows", label: "No shows", value: props.noShows},
        {id: "reviews", label: "Feedback", value: props.feedbackCount},
    ]


    function renderItem(itemData) {
        return (
            <>
                <ClientStatisticsCard
                    label={itemData.item.label}
                    value={itemData.item.value === "" ? "0" : itemData.item.value}
                    containerStyle={styles.cardStyle}
                />
                {/*<View style={{width: 20}}/>*/}
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
                    columnWrapperStyle={{gap: 20}}
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
        width: "100%",


    },
    salesStatisticsCard: {
        width: "100%",
        flexDirection: 'row',
        marginTop: 32,
        height: 95
    },
    statisticsCardOuterContainer: {
        marginTop: 16,
        width: '100%',
    },
    listStyle: {
        gap: 20,
        width: '100%',
    },
    cardStyle: {
        flex: 1,
        height: 72,
    },
    titleContainer: {
        marginTop: 16,
        width: '100%',
    },
    title: {
        marginLeft: 16
    }
})