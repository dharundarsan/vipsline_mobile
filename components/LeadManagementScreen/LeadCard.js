import {StyleSheet, View, Text, Pressable} from "react-native";
import Colors from "../../constants/Colors";
import LeadDetailsModal from "./LeadDetailsModal";
import React, {useState} from "react";
import getLeadStatusColor from "../../util/getLeadStatusColor";


const LeadCard = (props) => {
    const [isLeadDetailsModalVisible, setIsLeadDetailsModalVisible] = useState(false);

    const styles = StyleSheet.create({
        leadCard: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.grey400
        },
        detailsContainer: {
            gap: 3,
        },
        nameText: {
            fontWeight: 500,
            fontSize: 15,
        },
        phoneNoText: {
            fontWeight: 500,
            color: Colors.grey600,
            letterSpacing: 0.5,
        },
        badgeContainer: {
            minWidth: 80,
            paddingHorizontal:10,
            backgroundColor: getLeadStatusColor(props.status).background,
            alignItems: "center",
            borderRadius: 5,
        },
        badgeText: {
            color: getLeadStatusColor(props.status).text,
        }
    })

    return <Pressable onPress={() => {setIsLeadDetailsModalVisible(true)}} style={styles.leadCard}>
        {isLeadDetailsModalVisible && <LeadDetailsModal isVisible={isLeadDetailsModalVisible}/>}
        <View style={styles.detailsContainer}>
            <Text style={[styles.nameText]}>{props.name}</Text>
            <Text style={[styles.phoneNoText]}>{props.phoneNo}</Text>
            <Text style={{color: Colors.grey600}}>Follow up:
                <Text style={{color: Colors.black}}> {props.followUp}</Text>
            </Text>
        </View>
        <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{props.status}</Text>
        </View>
    </Pressable>
}

export default LeadCard;