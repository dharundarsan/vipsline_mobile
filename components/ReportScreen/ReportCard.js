import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {AntDesign, Entypo} from '@expo/vector-icons'
import TextTheme from '../../constants/TextTheme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

const ReportCard = ({ title, location }) => {
    const nav = useNavigation()
    return (
        <TouchableOpacity onPress={() => nav.navigate(location)}>
            <View style={[styles.headerContainer, { justifyContent: 'space-between', paddingVertical: 12 }]}>
                <Text style={TextTheme.bodyLarge}>{title}</Text>
                <Entypo name="chevron-right" size={20} color="grey" />
            </View>
        </TouchableOpacity>
    )
}

export default ReportCard

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
})