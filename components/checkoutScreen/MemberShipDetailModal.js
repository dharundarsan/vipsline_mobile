import { Modal, View, StyleSheet, Text, FlatList } from "react-native";
import Colors from "../../constants/Colors";
import TextTheme from "../../constants/TextTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import Divider from "../../ui/Divider";
import PrimaryButton from "../../ui/PrimaryButton";
import React, { useEffect } from "react";

const MemberShipDetailModal = React.memo((props) => {
    const insets = useSafeAreaInsets();
    console.log(props.membershipDetails.length);
    useEffect(() => {
        if (props.isMembershipModalVisible && props.membershipDetails.length === 1) {
            props.onApplyMembership(props.membershipDetails[0].id, props.membershipDetails[0].client_id);
        }
    }, [props.membershipDetails, props.isMembershipModalVisible]);


    return (
        <Modal visible={props.isMembershipModalVisible} animationType="slide">
            <View style={[styles.modalContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.membershipDetailContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={[styles.header, TextTheme.bodyLarge]}>Available Membership</Text>
                        <AntDesign name="close" size={24} color="black" style={{ position: "absolute", right: 10 }}
                            onPress={props.closeModal} />
                    </View>
                    <Divider />
                    <FlatList
                        data={props.membershipDetails}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.membershipDetails}>
                                    <View style={styles.membershipNameAndButton}>
                                        <Text style={TextTheme.titleSmall}>{item.membership_name}</Text>
                                        <Text>This Membership will expire on
                                            <Text style={{ color: Colors.error }}> {item.validTill}</Text>
                                        </Text>
                                    </View>
                                    <PrimaryButton
                                        pressableStyle={{ flex: 1 }}
                                        buttonStyle={props.storedMembershipId === item.id ? styles.selectedMembership : styles.primaryButtonStyle}
                                        onPress={() => {
                                            props.onApplyMembership(item.id, item.client_id)
                                            props.closeModal()
                                        }}
                                    >
                                        <Text
                                            style={[
                                                props.storedMembershipId === item.id
                                                    ? { color: Colors.white }
                                                    : { color: Colors.black },
                                                { alignItems: "center", alignContent: "center", alignSelf: "center" }
                                            ]}
                                        >
                                            {props.storedMembershipId === item.id ? "Applied" : "Apply"}
                                        </Text>
                                    </PrimaryButton>
                                </View>
                            )
                        }
                        }
                    />
                </View>
            </View>
        </Modal>
    )
})

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    membershipDetailContainer: {
        borderRadius: 10,
        paddingVertical: 10,
        height: "100%",
        backgroundColor: Colors.white,
        // alignItems: "center",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: 10,
    },
    membershipDetails: {
        flexDirection: "row",
        paddingVertical: 20,
        borderBottomWidth: 1,
        paddingHorizontal: 15
    },
    membershipNameAndButton: {
        flex: 1,  // Take up available space
        marginRight: 10,  // Add space between text and button
    },
    primaryButtonStyle: {
        backgroundColor: Colors.transparent,
        borderWidth: 1,
        borderColor: Colors.ripple,
        width: "35%",
    },
    selectedMembership: {
        backgroundColor: Colors.green,
        borderWidth: 1,
        borderColor: Colors.ripple,
        width: "35%",
    }
})

export default MemberShipDetailModal;