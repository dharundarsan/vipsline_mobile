import PrimaryButton from "../../ui/PrimaryButton";
import {FontAwesome6, Ionicons} from "@expo/vector-icons";
import {Pressable, StyleSheet, Text, View} from "react-native";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import {useDispatch, useSelector} from "react-redux";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ClientCard from "../clientSegmentScreen/ClientCard";
import Entypo from '@expo/vector-icons/Entypo';
import {clearClientInfo, loadClientInfoFromDb, updateClientId} from "../../store/clientInfoSlice";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import React, {useEffect, useState} from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import ClientInfoModal from "../clientSegmentScreen/ClientInfoModal";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MemberShipDetailModal from "./MemberShipDetailModal";

import {loadCartFromDB, modifyClientMembershipId, updateCalculatedPrice} from "../../store/cartSlice";

import {loadClientFiltersFromDb} from "../../store/clientFilterSlice";
import PackageModal from "./PackageModal";
import AvailablePackagesModal from "./AvailablePackagesModal";


const AddClientButton = (props) => {
    const clientInfo = useSelector(state => state.clientInfo);
    const [isClientInfo, setIsClientInfo] = useState(false)
    const [isVisibileModal, setIsVisibleModal] = useState(false)
    const [isMembershipModalVisible, setIsMembershipModalVisible] = useState(false)
    // const [storeMembershipId, setStoreMembershipId] = useState(useSelector(state => state.cart.clientMembershipID));
    const dispatch = useDispatch();
    const storeMembershipId = useSelector(state => state.cart.clientMembershipID);
    const [isAvailablePackagesModalVisible, setIsAvailablePackageModalVisible] = useState(false);

    async function onApplyMembership(clientMembershipId, clientId) {
        // setStoreMembershipId(clientMembershipId)
        // console.log("clientId " + clientInfo.client_id);
        dispatch(updateClientId(clientId))
        dispatch(modifyClientMembershipId({type: "add", payload: clientMembershipId}))
        dispatch(loadCartFromDB(clientInfo.client_id))
        // dispatch(updateCalculatedPrice())
    }

    // console.log("clientInfo.membershipDetails.length ");
    // console.log(clientInfo.membershipDetails.length);

    useEffect(() => {
        function singleMembershipApply() {

            if (clientInfo.membershipDetails.length === 1 && clientInfo.isClientSelected) {
                if (clientInfo.membershipDetails[0].id !== undefined || clientInfo.membershipDetails[0].client_id !== undefined) {
                    dispatch(modifyClientMembershipId({type: "add", payload: clientInfo.membershipDetails[0].id}))
                    onApplyMembership(clientInfo.membershipDetails[0].id, clientInfo.membershipDetails[0].client_id)
                }
            }
            // console.log("storeMembershipId " + storeMembershipId);

            if (((storeMembershipId !== undefined) && clientInfo.membershipDetails[0] !== undefined)) {
                dispatch(modifyClientMembershipId({type: "add", payload: clientInfo.membershipDetails[0].id}))
                onApplyMembership(clientInfo.membershipDetails[0].id, clientInfo.membershipDetails[0].client_id)
            }
        }

        singleMembershipApply();
    }, [clientInfo.isClientSelected])

    const openRedeemPackageModalHandler = () => {
        setIsAvailablePackageModalVisible(true);
    }

    return (
        <>
            {
                clientInfo.isClientSelected ?
                    <View style={{borderBottomWidth: 1, borderColor: Colors.highlight}}>
                        {isVisibileModal && (
                            <ClientInfoModal
                                visible={isVisibileModal}
                                setVisible={setIsVisibleModal}
                                closeModal={() => {
                                    setIsVisibleModal(false);
                                    dispatch(clearClientInfo());
                                }}
                                onClose={() => {
                                    setIsVisibleModal(false);
                                }}
                                phone={clientInfo.details?.mobile_1}
                                name={clientInfo.details?.firstName}
                                id={clientInfo.details?.id}
                            />
                        )}
                        {isAvailablePackagesModalVisible &&
                            <AvailablePackagesModal isVisible={isAvailablePackagesModalVisible}
                                                    onCloseModal={() => setIsAvailablePackageModalVisible(false)}/>
                        }
                        <View style={styles.clientCardContainer}>
                            <ClientCard
                                phone={clientInfo.details.mobile_1}
                                name={clientInfo.details.firstName}
                                email={clientInfo.details.username}
                                onPress={() => {
                                    return null;
                                }}
                                rippleColor={Colors.transparent}
                                card={styles.clientCard}


                            />
                            <View style={styles.actionMenu}>
                                {
                                    clientInfo.details ? (
                                            isClientInfo ? (
                                                <Pressable style={[styles.activePlan, {
                                                    flexDirection: 'row', alignItems: "center",
                                                    borderColor: Colors.transparent
                                                }]} onPress={() => {
                                                    setIsVisibleModal(true);
                                                }}>
                                                    <MaterialIcons name="sort" size={17} color={Colors.highlight}/>
                                                    <Text
                                                        style={{color: Colors.highlight}}
                                                    >
                                                        client info
                                                    </Text>
                                                </Pressable>
                                            ) : (
                                                <SimpleLineIcons
                                                    name="options"
                                                    size={24}
                                                    color="black"
                                                    onPress={() => setIsClientInfo(true)}
                                                />
                                            )
                                        ) :
                                        <Pressable style={[styles.activePlan, {
                                            flexDirection: 'row', alignItems: "center",
                                            borderColor: Colors.transparent
                                        }]} onPress={() => {
                                            setIsVisibleModal(true);
                                        }}>
                                            <MaterialIcons name="sort" size={17} color={Colors.highlight}/>
                                            <Text
                                                style={{color: Colors.highlight}}
                                            >
                                                client info
                                            </Text>
                                        </Pressable>
                                }

                                <Ionicons name="close" size={24} color="black" onPress={() => {
                                    onApplyMembership(null, undefined)
                                    // setStoreMembershipId(null);
                                    dispatch(modifyClientMembershipId({type: "clear"}));
                                    dispatch(clearClientInfo())
                                }}/>


                            </View>
                        </View>
                        {isClientInfo ?
                            <View style={styles.clientDetailContainer}>
                                {
                                    clientInfo.details.wallet_balance !== 0 &&
                                    clientInfo.details.wallet_balance !== undefined &&
                                    <PrimaryButton buttonStyle={styles.activePlan}
                                                   pressableStyle={styles.activePlanPressable}>
                                        <Text style={styles.activePlanText}>
                                            Bal <Text style={{color: Colors.highlight}}> -
                                            ₹{clientInfo.details.wallet_balance}</Text>
                                        </Text>
                                    </PrimaryButton>
                                }
                                <MemberShipDetailModal isMembershipModalVisible={isMembershipModalVisible}
                                                       membershipDetails={clientInfo.membershipDetails}
                                                       closeModal={() => setIsMembershipModalVisible(false)}
                                                       onApplyMembership={onApplyMembership}
                                                       storedMembershipId={storeMembershipId}
                                />
                                {clientInfo.membershipDetails.length !== 0 &&
                                    <PrimaryButton buttonStyle={styles.activePlan}
                                                   pressableStyle={styles.activePlanPressable}
                                                   onPress={() => setIsMembershipModalVisible(true)}
                                    >
                                        <Feather name="user-check" size={17} color="black"/>
                                        <Text> Membership</Text>
                                    </PrimaryButton>}
                                {clientInfo.packageDetails.length !== 0 &&
                                    <PrimaryButton buttonStyle={styles.activePlan}
                                                   pressableStyle={styles.activePlanPressable}
                                                   onPress={openRedeemPackageModalHandler}
                                    >
                                        <MaterialCommunityIcons name="clipboard-list-outline" size={17} color="black"/>
                                        <Text style={styles.activePlanText}> Package</Text>
                                    </PrimaryButton>
                                }
                            </View>
                            : null
                        }
                    </View>
                    :
                    <PrimaryButton buttonStyle={styles.addClientButton} onPress={props.onPress}>
                        <View style={styles.addClientButtonInnerContainer}>
                            <FontAwesome name="plus-square-o" size={24} color={Colors.highlight}/>
                            <Text
                                style={[TextTheme.bodyLarge, styles.addClientButtonText]}>{
                                clientInfo.isClientSelected ?
                                    clientInfo.details.name : "Add Client"}</Text>
                        </View>
                    </PrimaryButton>
            }
        </>
    )
};

const styles = StyleSheet.create({
    addClientButton: {
        backgroundColor: Colors.transparent,
        borderColor: Colors.highlight,
        borderWidth: 1.5,
        marginVertical: 15,
        marginHorizontal: "auto",
        width: '85%',
    },
    addClientButtonInnerContainer: {
        gap: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
    },
    addClientButtonText: {
        color: Colors.highlight,
    },
    clientCardContainer: {
        flexDirection: "row",
    },
    clientCard: {
        flex: 0.60,
    },
    actionMenu: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flex: 0.40
    },
    clientDetailContainer: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    activePlan: {
        borderColor: Colors.grey200,
        borderWidth: 1,
        marginTop: "-2%",
        marginBottom: "2%",
        alignSelf: "center",
        backgroundColor: Colors.background,
    },
    activePlanPressable: {
        backgroundColor: Colors.background,
        justifyContent: "flex-start",
        flexDirection: "row",
        // flex:1
    }
});

export default AddClientButton;