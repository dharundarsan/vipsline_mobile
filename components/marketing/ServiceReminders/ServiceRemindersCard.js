import PrimaryButton from "../../../ui/PrimaryButton";
import {Image, StyleSheet, Text, View} from "react-native";
import textTheme from "../../../constants/TextTheme";
import Colors from "../../../constants/Colors";
import CustomSwitch from "../../../ui/CustomSwitch";
import {useState} from "react";

export default function ServiceRemindersCard(props) {
    const [toggle, setToggle] = useState(false)

    function statusContainerStyle() {
        if(props.notification === "whatsapp") {
            return {
                borderColor: Colors.green,
                backgroundColor: Colors.green10,
            }
        }
        else if(props.notification === "sms") {
            return {
                borderColor: Colors.blue,
                backgroundColor: Colors.highlight50,
            }
        }
    }


    return <PrimaryButton
        buttonStyle={styles.card}
        pressableStyle={styles.pressableStyle}
        onPress={props.onPress}
    >
        <View style={styles.innerContainer}>
            <View style={styles.leftContainer}>
                <View style={styles.dateContainer}>
                    <Image source={require("../../../assets/icons/marketingIcons/smsCampaign/date.png")} style={styles.image} />
                    <Text style={[textTheme.bodyMedium]}>{"Date: " + props.date}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Image source={require("../../../assets/icons/marketingIcons/smsCampaign/speaker.png")} style={styles.image}/>
                    <Text style={[textTheme.bodyMedium]}>{props.name}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <Image source={require("../../../assets/icons/marketingIcons/smsCampaign/contact.png")} style={styles.image}/>
                    <Text style={[textTheme.bodyMedium]}>{props.type}</Text>
                </View>
                <Text style={[textTheme.bodyMedium]}>Total Services Selected</Text>
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.dateContainer}>
                    <Image source={require("../../../assets/icons/marketingIcons/smsCampaign/time.png")} style={styles.image}/>
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
            <View style={[styles.viewDetailsContainer, {...statusContainerStyle()}]}>
                <Text style={[textTheme.bodyMedium, ]}>
                    {props.notification}
                </Text>
            </View>
            <View style={{marginRight: 32, alignItems: "center", justifyContent: 'center'}}>
                <CustomSwitch
                    isOn={props.active_status}
                    color={Colors.highlight}
                    onToggle={() => setToggle(!toggle)}

                />
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
