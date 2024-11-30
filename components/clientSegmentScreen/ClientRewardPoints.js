import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextTheme from '../../constants/TextTheme'
import { useDispatch, useSelector } from 'react-redux'
import { decrementRewardPageNumber, getRewardHistory, getRewardPointBalance, incrementRewardPageNumber, resetRewardPageNo, updateRewardMaxEntry } from '../../store/clientInfoSlice'
import { Divider } from 'react-native-paper'
import Colors from '../../constants/Colors'
import { dateFormatter } from '../../util/Helpers'
import CustomPagination from '../common/CustomPagination'
import EntryPicker from '../common/EntryPicker'

const ClientRewardPoints = (props) => {
    // console.log(JSON.stringify(props.details,null,3));
    const dispatch = useDispatch();

    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);

    const rewardDetails = useSelector(state => state.clientInfo.customerRewardDetails);
    const rewardPoints = useSelector(state => state.clientInfo.rewardPointBalance);
    const maxEntry = useSelector(state => state.clientInfo.rewardsMaxEntry);
    const rewardsTotalSize = useSelector(state => state.clientInfo.rewardsTotalSize);
    const isRewardFetching = useSelector(state => state.clientInfo.rewardsIsFetching);
    useEffect(() => {
        async function initialCall() {
            await dispatch(resetRewardPageNo())
            await dispatch(getRewardHistory(props.details.id, 10));
            await dispatch(getRewardPointBalance(props.details.id))
            await dispatch(updateRewardMaxEntry(10));
        }
        initialCall()
    }, [])

    return (
        <>
            <ScrollView style={styles.wrapper} scrollEnabled={true} showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    {
                        isEntryModalVisible &&
                        <EntryPicker
                            setIsModalVisible={setIsEntryModalVisible}
                            onPress={(number) => {
                                dispatch(updateRewardMaxEntry(number));
                                setIsEntryModalVisible(false);
                            }}
                            maxEntry={maxEntry}
                            isVisible={isEntryModalVisible}

                        />}
                    <Text style={TextTheme.titleMedium}>Reward Points</Text>
                    {
                        rewardDetails?.status_code === undefined ?
                            <View style={styles.boxContainer}>
                                <View style={{ paddingHorizontal: 20, paddingVertical: 10, }}>
                                    <Text style={TextTheme.titleSmall}>Points Available: {rewardPoints}</Text>
                                </View>
                                <Divider />
                                <FlatList
                                    scrollEnabled={false}
                                    data={rewardDetails?.customerRewardList}
                                    renderItem={({ item }) => {
                                        const date = dateFormatter(item.date, "short");
                                        return (
                                            <>
                                                <View style={styles.transactionContainer}>
                                                    <Text style={[item.transaction_type === "Earned" ? styles.transactionTypeEarned : styles.transactionTypeRedeemed, TextTheme.bodySmall]}>{item.transaction_type}</Text>
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
            </ScrollView>
            <View style={{width:'100%'}}>
                <CustomPagination
                    setIsModalVisible={setIsEntryModalVisible}
                    maxEntry={maxEntry}
                    incrementPageNumber={() => dispatch(incrementRewardPageNumber())}
                    decrementPageNumber={() => dispatch(decrementRewardPageNumber())}
                    refreshOnChange={async () => await dispatch(getRewardHistory(props.details.id, maxEntry))}
                    currentCount={rewardDetails?.customerRewardList.length}
                    totalCount={rewardsTotalSize}
                    resetPageNo={() => dispatch(resetRewardPageNo())}
                    isFetching={isRewardFetching}
                />
            </View>
        </>
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
    transactionTypeRedeemed: {
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