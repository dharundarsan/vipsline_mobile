import {StyleSheet, View, Text} from "react-native";
import Colors from "../../constants/Colors";

const getBadgeColor = (badge) => {
    if (badge === "New") return {background: "#6950F31A", text: Colors.highlight}
    if (badge === "Follow up") return {background: "#F7941D1A", text: Colors.orange}
    if (badge === "Prospective") return {background: "#EF5DA81A", text: "#EF5DA8"}
    if (badge === "Sales opportunity") return {background: "#0352321A", text: "#035232"}
    if (badge === "Converted") return {background: "#22B3781A", text: "#22B378"}
    if (badge === "Not interested") return {background: "#D1373F1A", text: "#D1373F"}
    if (badge === "Unqualified") return {background: "#1019281A", text: "#10192899"}
}

const LeadCard = (props) => {

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
            backgroundColor: getBadgeColor(props.status).background,
            alignItems: "center",
            borderRadius: 5,
        },
        badgeText: {
            color: getBadgeColor(props.status).text,
        }
    })

    return <View style={styles.leadCard}>
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
    </View>
}

export default LeadCard;