import {StyleSheet, View, Text, Pressable} from "react-native";
import Colors from "../../constants/Colors";
import LeadDetailsModal from "./LeadDetailsModal";
import React, {useState} from "react";
import getLeadStatusColor from "../../util/getLeadStatusColor";
import PrimaryButton from "../../ui/PrimaryButton";
import {useNavigation} from "@react-navigation/native";


const LeadCard = (props) => {
    const [isLeadDetailsModalVisible, setIsLeadDetailsModalVisible] = useState(false);
    const navigation = useNavigation();
    const styles = StyleSheet.create({
        leadCardPressable: {
            flexDirection: "row",
            justifyContent: "spaceBetween",
            borderBottomWidth:1,
            borderBottomColor: Colors.grey200,
            paddingVertical: 12,
            paddingHorizontal: 25,
        },
        detailsContainer: {
            flex:1,
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
            paddingHorizontal: 10,
            backgroundColor: getLeadStatusColor(props.lead.lead_status).background,
            alignItems: "center",
            borderRadius: 5,
        },
        badgeText: {
            color: getLeadStatusColor(props.lead.lead_status).text,
        }
    })
    return <PrimaryButton buttonStyle={{backgroundColor: "white"}}
                          pressableStyle={styles.leadCardPressable}
                          onPress={() => {
                              navigation.navigate("Lead Profile", { leadDetails: props.lead })

                          }} style={styles.leadCard}>
        <View style={styles.detailsContainer}>
            <Text style={[styles.nameText]}>{props.lead.name}</Text>
            <Text style={[styles.phoneNoText]}>{props.lead.mobile}</Text>
            {props.lead.followup_date && <Text style={{color: Colors.grey600}}>Follow up:
                <Text style={{color: Colors.black}}> {props.lead.followup_date}</Text>
            </Text>}
        </View>
        <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{props.lead.lead_status}</Text>
        </View>
    </PrimaryButton>
}

export default LeadCard;