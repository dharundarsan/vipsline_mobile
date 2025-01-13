import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TextTheme from "../../constants/TextTheme";
import { reportStackDisplay } from '../../data/ReportData';
import { Divider } from 'react-native-paper';
import Colors from '../../constants/Colors';
import ReportCard from '../../components/ReportScreen/ReportCard';

const SalesListReport = () => {
    return (
        <ScrollView contentContainerStyle={{ paddingVertical: 30 }}>
            {reportStackDisplay.map((section, index) => (
                <View key={index}>
                    <View style={[styles.headerContainer, { gap: 15 }]}>
                        <Image source={section.icon} style={styles.icon} />
                        <Text style={TextTheme.titleMedium}>{section.title}</Text>
                    </View>
                    <View style={{backgroundColor: 'white',borderWidth:1,borderColor:Colors.grey100,marginVertical:10}}>
                        <FlatList
                            data={section.data}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                return (
                                    <ReportCard title={item.title} location={item.navigation} />
                                )
                            }}
                            ItemSeparatorComponent={() => <Divider />}
                            bounces={false}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

export default SalesListReport

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