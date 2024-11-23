import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TextTheme from '../../constants/TextTheme'

const ClientRewardPoints = () => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={TextTheme.titleMedium}>Reward Points</Text>
            </View>
        </View>
    )
}

export default ClientRewardPoints

const styles = StyleSheet.create({
    wrapper: {
        marginTop: '5%',
        flex: 1,
        width: '100%'
    },
    container: {
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:'5%',
    }
})