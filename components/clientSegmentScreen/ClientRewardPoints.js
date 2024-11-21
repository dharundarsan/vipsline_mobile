import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import TextTheme from '../../constants/TextTheme'
import { useDispatch, useSelector } from 'react-redux'
import { getRewardHistory, getRewardPointBalance } from '../../store/clientInfoSlice'
import { Divider } from 'react-native-paper'
import Colors from '../../constants/Colors'
import { dateFormatter } from '../../util/Helpers'

const ClientRewardPoints = (props) => {
    // console.log(JSON.stringify(props.details,null,3));
    const dispatch = useDispatch();

    const rewardDetails = useSelector(state => state.clientInfo.customerRewardDetails);
    const rewardPoints = useSelector(state => state.clientInfo.rewardPointBalance);

    useEffect(() => {
        dispatch(getRewardHistory(props.details.id));
        dispatch(getRewardPointBalance(props.details.id))
    }, [])
    // console.log(rewardDetails.customerRewardList);
    console.log(rewardDetails);

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={TextTheme.titleMedium}>Reward Points</Text>
                {
                    rewardDetails?.status_code === undefined ?
                        <View style={styles.boxContainer}>
                            <View style={{ paddingHorizontal: 20, paddingVertical: 10, }}>
                                <Text style={TextTheme.titleSmall}>Points Available: {rewardPoints}</Text>
                            </View>
                            <Divider />
                            <FlatList
                                data={rewardDetails?.customerRewardList}
                                renderItem={({ item }) => {
                                    const date = dateFormatter(item.date, "short");
                                    return (
                                        <>
                                            <View style={styles.transactionContainer}>
                                                <Text style={[item.transaction_type === "Earned" ? styles.transactionTypeEarned : styles.transactionTypeRedeemed,TextTheme.bodySmall]}>{item.transaction_type}</Text>
                                                <Text style={TextTheme.bodySmall}>{[item.points]} Points</Text>
                                                <Text style={TextTheme.bodySmall}>{date}</Text>
                                            </View>
                                        </>
                                    )
                                }}
                                ItemSeparatorComponent={() => <Divider />}
                            />
                        </View>
                        : <Text style={[styles.notFound, TextTheme.titleSmall]}>No Data Found</Text>
                }
            </View>
        </View>
    )
}

export default ClientRewardPoints

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        width: '100%',
        // backgroundColor:Colors.black
    },
    container: {
        marginTop: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '5%',
    },
    boxContainer: {
        borderWidth: 1,
        width: '90%',
        marginVertical: 10,
        borderRadius: 8,
        borderColor: Colors.grey250,
        backgroundColor: Colors.white
    },
    notFound: {
        marginVertical: 20
    },
    transactionContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between'
    },
    transactionTypeEarned: {
        paddingVertical: 1,
        paddingHorizontal: 10,
        backgroundColor: '#22B3781A',
        color: Colors.green,
        borderWidth: 1,
        borderColor: '#22B3781A',
        borderRadius: 6,
        overflow: 'hidden'
    },
    transactionTypeRedeemed:{
        paddingVertical: 1,
        paddingHorizontal: 10,
        backgroundColor: '#D1373F33',
        color: '#D1373F',
        borderWidth: 1,
        borderColor: '#D1373F33',
        borderRadius: 6,
        overflow: 'hidden'

    }
})