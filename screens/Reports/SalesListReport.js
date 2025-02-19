import {FlatList, Image, ScrollView, StyleSheet, Text, View} from 'react-native'
import React from 'react'
import TextTheme from "../../constants/TextTheme";
import {reportStackDisplay, titleToDisplay} from '../../data/ReportData';
import {Divider} from 'react-native-paper';
import Colors from '../../constants/Colors';
import ReportCard from '../../components/ReportScreen/ReportCard';

const SalesListReport = () => {
    return (
        <ScrollView contentContainerStyle={{paddingBottom: 30, paddingTop: 8}}>
            {reportStackDisplay.map((section, index) => {
                return (
                    <View key={index}>
                        <View style={[styles.headerContainer, {gap: 12}, titleToDisplay.includes(section.title) ? {
                            paddingTop: 8,
                            paddingBottom: 5
                        } : null]}>
                            <Image source={section.icon} style={styles.icon}/>
                            <Text style={TextTheme.titleSmall}>{section.title}</Text>
                        </View>
                        <View style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderColor: Colors.grey100,
                            marginVertical: 8
                        }}>
                            <FlatList
                                data={section.data}
                                keyExtractor={(item) => item.id.toString()}
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