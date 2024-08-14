import ClientStatisticsCard from "./ClientStatisticsCard";
import {View, Text, StyleSheet, FlatList} from "react-native"
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";

const StatisticsItems = [
    {id: "totalVisit", label: "Total Visit", value: "25 August 2024"},
    {id: "lastVisit", label: "Last Visit", value: "25 August 2024"},
    {id: "completed", label: "Completed", value: "25"},
    {id: "canceled", label: "Canceled", value: "23"},
    {id: "No shows", label: "No shows", value: "23"},
    {id: "reviews", label: "Reviews", value: "26"},
]

const totalSales = "Total Sales"
const totalSalesPrice = "7000"

export default function ClientStatistics(props) {



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
                label={totalSales}
                value={totalSalesPrice}
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