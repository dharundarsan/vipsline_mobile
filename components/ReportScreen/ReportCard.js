import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {AntDesign, Entypo} from '@expo/vector-icons'
import TextTheme from '../../constants/TextTheme'
import {TouchableOpacity} from 'react-native-gesture-handler'
import {useNavigation} from '@react-navigation/native'
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";

const ReportCard = ({title, location}) => {
    const nav = useNavigation()
    return (
        <PrimaryButton onPress={() => nav.navigate(location)}
                       pressableStyle={[styles.headerContainer]}
                       buttonStyle={[{backgroundColor: Colors.transparent}]}>
            <Text style={{fontFamily: "Inter_500Medium", fontSize: 14}}>{title}</Text>
            <Entypo name="chevron-right" size={20} color="grey"/>
        </PrimaryButton>
    )
}

export default ReportCard

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
})