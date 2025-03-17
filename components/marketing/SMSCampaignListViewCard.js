import {View, StyleSheet, Text, Image} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {Divider} from "react-native-paper";
import PrimaryButton from "../../ui/PrimaryButton";
import {capitalizeFirstLetter} from "../../util/Helpers";
import {useState} from "react";

export default function SMSCampaignListViewCard(props) {
    function statusText() {
        if(props.status === "IN_PROGRESS") {
            return "In-progress";
        }
        else if(props.status === "PARTIALLYCOMPLETED"){
            return "Partially Completed";
        }
        else if(props.status === "COMPLETED"){
            return "Completed";
        }
        else if(props.status === "FAILED"){
            return "Failed";
        }
    }

    function statusContainerStyle() {
        if(props.status === "IN_PROGRESS") {
            return {
                borderColor: Colors.orange,
                backgroundColor: Colors.orange10,
            }
        }
        else if(props.status === "FAILED") {
            return {
                borderColor: Colors.error,
                backgroundColor: Colors.error10,
            }
        }
        else {
            return {
                borderColor: Colors.green,
                backgroundColor: Colors.green10,
            }
        }
    }




    return <PrimaryButton buttonStyle={styles.card} pressableStyle={styles.pressableStyle}>
        <View style={styles.innerContainer}>
        <View style={styles.leftContainer}>
            <View style={styles.dateContainer}>
                <Image source={require("../../assets/icons/marketingIcons/smsCampaign/date.png")} style={styles.image} />
                <Text style={[textTheme.bodyMedium]}>{"Date: " + props.date}</Text>
            </View>
            <View style={styles.dateContainer}>
                <Image source={require("../../assets/icons/marketingIcons/smsCampaign/speaker.png")} style={styles.image}/>
                <Text style={[textTheme.bodyMedium]}>{props.name}</Text>
            </View>
            <View style={styles.dateContainer}>
                <Image source={require("../../assets/icons/marketingIcons/smsCampaign/contact.png")} style={styles.image}/>
                <Text style={[textTheme.bodyMedium]}>{props.type}</Text>
            </View>
            <Text style={[textTheme.bodyMedium, {paddingLeft: 32}]}>Total count</Text>
        </View>
        <View style={styles.rightContainer}>
            <View style={styles.dateContainer}>
                <Image source={require("../../assets/icons/marketingIcons/smsCampaign/time.png")} style={styles.image}/>
                <Text style={[textTheme.bodyMedium]}>{props.time}</Text>
            </View>
            <Text style={[textTheme.bodyMedium]}>{props.count}</Text>
        </View>
        </View>
        <View style={{backgroundColor: Colors.grey400, height: 1.2, width: "100%"}} />

        <View style={styles.bottomContainer}>
            <View style={styles.viewDetailsContainer}>
                <Text style={textTheme.bodyMedium}>{"View Details"}</Text>
            </View>
            <View style={[styles.viewDetailsContainer, {marginRight: 32}, {...statusContainerStyle()}]}>
                <Text style={[textTheme.bodyMedium, {color: statusContainerStyle().borderColor}]}>
                    {statusText()}
                </Text>
            </View>
        </View>

    </PrimaryButton>
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: Colors.grey400,
        marginHorizontal: 12,
        borderRadius: 8,
        backgroundColor: Colors.white,

    },
    pressableStyle: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        justifyContent: 'space-between',

    },
    image: {
        width: 25,
        height: 25
    },
    leftContainer: {
        gap: 12,
        paddingBottom: 8
    },
    rightContainer: {
        justifyContent: "space-between",
        paddingBottom: 8
    },
    dateContainer: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",

    },
    speakerContainer: {

    },
    contactContainer: {

    },
    timeContainer: {

    },
    bottomContainer: {
        // backgroundColor: Colors.grey400,
        flexDirection: "row",
        justifyContent: 'flex-end',
        gap: 12,
        paddingVertical: 12,
        width: '100%',
    },
    innerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 16,
        paddingHorizontal: 32,
        width: "100%",

    },
    viewDetailsContainer: {
        borderWidth: 1,
        padding: 8,
        borderRadius: 8,
        borderColor: Colors.grey400,
    },
    statusContainer: {
        borderWidth: 1,
        padding: 8,
        borderRadius: 8,
        borderColor: Colors.grey400,
    }
})