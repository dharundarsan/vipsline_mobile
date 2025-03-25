import {Text, View, StyleSheet, Image} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import {Divider} from "react-native-paper";
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";
import getListOfCampaignAPI from "../../apis/marketingAPI/SMSCampaignAPI/getListOfCampaignAPI";
import getListOfServiceRemindersAPI from "../../apis/marketingAPI/serviceRemindersAPI/getListOfServiceRemindersAPI";

export default function ServiceReminders(props) {
    const [nextPageName, setNextPageName] = useState("Service Reminders Landing Page");

    useEffect(() => {
        getListOfServiceRemindersAPI().then((response) => {
            setNextPageName(response.data.data[0].campaign_list.length === 0 ?
                "Service Reminders Landing Page" :
                "Reminders"
            )
        });
    }, []);


    return <View style={styles.smsCampaign}>
        <PrimaryButton buttonStyle={styles.card} pressableStyle={styles.cardPressable} onPress={() => {
            props.navigation.navigate("Reminders")
        }}>
            <View style={{flexDirection: "row", gap: 12, alignItems: "center"}}>
                <Image source={require('../../assets/icons/marketingIcons/smsCampaign/dashboard.png')} style={styles.dashboardIcon} />
                <Text style={[textTheme.titleSmall]}>Reminders</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color="black" />
        </PrimaryButton>
        <Divider />
        <PrimaryButton
            buttonStyle={styles.card}
            pressableStyle={styles.cardPressable}
            onPress={() => {
                props.navigation.navigate("Service Reminders Reports")
            }}
        >
            <View style={{flexDirection: "row", gap: 12, alignItems: "center"}}>
                <Image source={require('../../assets/icons/marketingIcons/smsCampaign/sms_recharge.png')} style={styles.dashboardIcon} />
                <Text style={[textTheme.titleSmall]}>Report</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color="black" />
        </PrimaryButton>
        <Divider />
    </View>
}

const styles = StyleSheet.create({
    smsCampaign:{
        flex: 1,
        backgroundColor: Colors.white,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 0,
    },
    cardPressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    dashboardIcon: {
        width: 25,
        height: 25,
    }
})