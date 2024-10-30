import {View, Text, StyleSheet, Modal, FlatList} from 'react-native';
import {checkNullUndefined, shadowStyling} from "../../util/Helpers";
import textTheme from "../../constants/TextTheme";
import PrimaryButton from "../../ui/PrimaryButton";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import Colors from "../../constants/Colors";
import {useSelector} from "react-redux";


export default function PackageDetailModal(props) {

    const packageHistory = useSelector(state => state.clientInfo.packageHistory);

    if(packageHistory === undefined) {
        return <View style={{flex:1, justifyContent:"center", alignItems:"center"}}><Text style={textTheme.titleMedium}>Loading</Text></View>
    }



    function renderItem(itemData) {
        return <View style={styles.card}>
            <Text style={[textTheme.titleMedium]}>{itemData.item.name}</Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: "50%", marginTop: 16}}>
                <Text style={[textTheme.bodyMedium]}>Total Sessions</Text>
                <Text style={[textTheme.bodyMedium]}>{itemData.item.total_quantity}</Text>

            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: "50%"}}>
                <Text style={[textTheme.bodyMedium]}>Available Sessions </Text>
                <Text style={[textTheme.bodyMedium]}>{itemData.item.available_quantity}</Text>

            </View>
        </View>
    }


    return <Modal style={{flex: 1}} visible={props.visible} onCancel={props.closeModal} animationType={"slide"}>
        <View style={styles.packageDetails}>
            <View style={[styles.closeAndHeadingContainer, shadowStyling]}>
                <Text style={[textTheme.titleLarge, styles.selectClientText]}>Transformation Package</Text>
                <PrimaryButton
                    buttonStyle={styles.closeButton}
                    pressableStyle={styles.closeButtonPressable}
                    onPress={props.closeModal}>
                    <Ionicons name="close" size={25} color="black" />
                </PrimaryButton>
            </View>
            <View style={{padding: 32}}>
                <Text style={[textTheme.titleMedium]}>Transformation Package</Text>
                <Text style={[textTheme.bodyMedium, {marginTop: 8}]}>{packageHistory.total_sessions} Services</Text>
                <Text style={[textTheme.bodyMedium]}>This package will expire on <Text style={{color: Colors.error}}>{checkNullUndefined(packageHistory.valid_till) ? packageHistory.valid_till.replace(",", " ") : ""}</Text></Text>
                <Text style={[textTheme.titleMedium, {marginTop: 8}]}>₹ {packageHistory.package_price}</Text>

            </View>

            <FlatList
                data={packageHistory.Services_List}
                renderItem={renderItem}
                style={styles.list}
                contentContainerStyle={{gap: 16}}

            />



        </View>
    </Modal>;
}

const styles = StyleSheet.create({
    packageDetails: {
        flex: 1,
    },
    closeAndHeadingContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        flexDirection: "row",
    },
    closeButton: {
        position: "absolute",
        right: 0,
        backgroundColor: Colors.white,
    },
    closeButtonPressable: {
        alignItems: "flex-end",
    },
    selectClientText: {
        fontWeight: "500",
        flex: 1,
        justifyContent: "center",
        textAlign: "center",
    },
    card: {
        borderWidth: 1,
        borderColor: Colors.grey250,
        borderRadius: 6,
        padding: 16
    },
    list: {
        paddingHorizontal: 16
    }
})