import {FlatList, Image, ScrollView, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import TextTheme from "../../constants/TextTheme";
import {reportStackDisplay, titleToDisplay} from '../../data/ReportData';
import {Divider} from 'react-native-paper';
import Colors from '../../constants/Colors';
import ReportCard from '../../components/ReportScreen/ReportCard';
import {Inter_600SemiBold} from "@expo-google-fonts/inter";

export const GreetingsReport = () => {
    const reportsToDisplay = [
        {
            title: "Greetings Report",
            icon: require("../../assets/icons/marketingIcons/serviceReminders/bell.png")
        },

    ]

    const reports = [
        {
            title: "SMS Report",
            icon: require("../../assets/icons/marketingIcons/sms.png"),
            navigation: "Greeting SMS Report",
        },

    ]

    return (
        <ScrollView contentContainerStyle={{paddingBottom: 30, paddingTop: 8}}>
            {reportsToDisplay.map((section, index) => {
                return (
                    <View key={index}>
                        <View style={[styles.headerContainer, {gap: 12}, titleToDisplay.includes(section.title) ? {
                            paddingTop: 8,
                            paddingBottom: 5
                        } : null]}>
                            <Image source={section.icon} style={styles.icon}/>
                            <Text style={{
                                fontFamily: "Inter_600SemiBold",
                                fontSize: 16,
                                // lineHeight: 16
                            }}>{section.title}</Text>
                        </View>
                        <View style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: Colors.grey100,
                            marginVertical: 8
                        }}>
                            <FlatList
                                data={reports}
                                // keyExtractor={(item) => item.id.toString()}
                                renderItem={({item}) => {
                                    return (<>
                                            {/*<Divider />*/}
                                            <ReportCard title={item.title} location={item.navigation}/>
                                            <Divider/>
                                        </>
                                    )
                                }}
                                // ItemSeparatorComponent={() => <Divider />}
                                bounces={false}
                                scrollEnabled={false}
                            />
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    icon: {
        width: 24,
        height: 24
    }
})