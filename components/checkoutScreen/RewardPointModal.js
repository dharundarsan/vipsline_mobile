import { Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import CustomTextInput from '../../ui/CustomTextInput'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrimaryButton from '../../ui/PrimaryButton';
import { shadowStyling } from '../../util/Helpers';
import TextTheme from '../../constants/TextTheme';
import { Ionicons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { calculateAmountForRewardPoints, updateCalculatedPrice, updateRewardAmount } from '../../store/cartSlice';
import splitPaymentAPI from '../../apis/checkoutAPIs/SplitPaymentAPI';
import Colors from '../../constants/Colors';

const RewardPointModal = (props) => {
    const dispatch = useDispatch();
    const clientInfo = useSelector(state => state.clientInfo);
    const rewardValue = useSelector(state => state.cart.rewardAllocated.rewardAmount)
    const rewardPoints = useSelector(state => state.cart.rewardAllocated.rewardPoints)

    const rewardStatus = useSelector(state => state.cart.rewardAllocated.statusCode)
    const ss = useSelector(state => state.cart.rewardAllocated)
    
    const [rewardPoint, setrewardPoint] = useState(rewardPoints);
    const insets = useSafeAreaInsets();
    return (
        <Modal visible={props.isVisible} onRequestClose={props.onCloseModal} animationType='slide'>
            <View style={{ paddingTop: insets.top, height: '100%', paddingBottom: insets.bottom }}>
                <View
                    style={[styles.headingAndCloseContainer]}>
                    <Text style={[TextTheme.titleMedium, styles.heading]}>Redeem Reward Points</Text>
                    <PrimaryButton
                        buttonStyle={styles.closeButton}
                        onPress={() => {
                            dispatch(updateRewardAmount(0))
                            if(rewardValue <= 0) {
                                props.setSelectedPaymentOption(null)
                            }
                            props.onCloseModal()
                        }}
                    >
                        <Ionicons name="close" size={25} color="black" />
                    </PrimaryButton>
                </View>
                <ScrollView style={styles.textEditor} >
                    <CustomTextInput
                        onChangeText={setrewardPoint}
                        defaultValue={0}
                        label='Enter Points'
                        type='number'
                        labelTextStyle={styles.labelStyle}
                        placeholder='0'
                        onEndEditing={async (rp) => {
                            if (rp.length !== 0) {
                                await dispatch(calculateAmountForRewardPoints(clientInfo.clientId, rp, props.price))
                            }
                        }
                        }
                        value={rewardPoint}
                        // validator={(e)=>{
                        //     console.log("rewardValue");
                        //     console.log(rewardValue);
                        //     console.log("rewardStatus");
                        //     console.log(rewardStatus);

                        //     if((rewardStatus === 200)  ){
                        //         return true;
                        //     }
                        //     else return false;
                        // }}
                        textInputStyle={{ borderColor: rewardPoint === 0 ? "grey" : rewardStatus === 200 ? "grey" : "red" }}
                    />
                    <Text style={{ color: "#E24C0C", marginTop: -10 }}>1 Reward Points = {props.perPointValue ?? 0} INR</Text>
                    <Text style={{ marginTop: 20, marginBottom: 5 }}>Value</Text>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '10%', justifyContent: 'center', borderWidth: 1, borderColor: "#D5D7DA", borderRadius: 4, backgroundColor: "#F8F8FB", borderRightColor: 'transparent' }}>
                            <Text style={[TextTheme.titleMedium, { alignSelf: 'center', }]}>
                                ₹
                            </Text>
                        </View>
                        <TextInput
                            readOnly
                            style={[styles.readOnlyTextBar, TextTheme.titleMedium]}
                            value={rewardValue.toString()}
                        />
                    </View>
                    <Text style={[{ textAlign: 'right', marginTop: 20 }, TextTheme.titleSmall]}>Payable Amount ₹ {props.price}</Text>
                </ScrollView>
                <Divider />
                <View style={{ paddingTop: 20 }} />
                <View style={{ flexDirection: 'row', gap: "20%", justifyContent: 'center' }}>
                    <PrimaryButton onPress={() => {
                        dispatch(updateRewardAmount(0))
                        props.setSelectedPaymentOption(null)
                        props.onCloseModal()
                    }} label='Cancel' buttonStyle={{ width: "40%", backgroundColor: Colors.white, borderWidth: 1, borderColor: "#D5D7DA" }} textStyle={{ color: Colors.black }} />
                    <PrimaryButton onPress={async () => {
                        await splitPaymentAPI({ booking_amount: props.price, paid_amount: [{ mode: "REWARDS", amount: rewardValue }, { mode: "CASH", amount: 0 }] });
                        dispatch(updateCalculatedPrice(clientInfo.clientId))
                        props.onCloseModal();
                    }} label='Redeem' buttonStyle={{ width: "40%" }}
                        disabled={rewardStatus !== 200 && parseInt(rewardValue) <= 0}
                    />
                </View>
            </View>
        </Modal>
    )
}

export default RewardPointModal

const styles = StyleSheet.create({
    headingAndCloseContainer: {
        // marginTop: Platform.OS === "ios" ? 50 : 0,
        paddingVertical: 15,
        // alignItems: "center",
        borderBottomColor: Colors.grey100,
        borderBottomWidth: 0.2
    },
    heading: {
        fontWeight: 500,
        paddingHorizontal: 15,
    },
    closeButton: {
        position: "absolute",
        right: 0,
        top: 5,
        backgroundColor: Colors.background,
    },
    textEditor: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        flex: 1,
    },
    labelStyle: {
        fontWeight: 500
    },
    readOnlyTextBar: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#D5D7DA",
        borderRadius: 4,
        backgroundColor: "#F8F8FB",
        width: '92%',
        marginLeft: "-2%",
        borderLeftColor: 'transparent',
        borderLeftWidth: 0
    }
})