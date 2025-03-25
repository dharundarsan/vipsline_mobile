import {Text, View, StyleSheet, Image} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PrimaryButton from "../../ui/PrimaryButton";
import Colors from "../../constants/Colors";
import {Divider} from "react-native-paper";
import textTheme from "../../constants/TextTheme";
import {useEffect, useState} from "react";
import getListOfCampaignAPI from "../../apis/marketingAPI/SMSCampaignAPI/getListOfCampaignAPI";

export default function SMSCampaign(props) {
    const [nextPageName, setNextPageName] = useState("SMS Campaign Landing Page")

    useEffect(() => {
        getListOfCampaignAPI(0, 10).then((response) => {
            setNextPageName(response.data.data[0].total_count === 0 ?
                "SMS Campaign Landing Page" :
                "Dashboard"
            )
        });
    }, []);


    return <View style={styles.smsCampaign}>
        <PrimaryButton buttonStyle={styles.card} pressableStyle={styles.cardPressable} onPress={() => {
            props.navigation.navigate(nextPageName)
        }}>
            <View style={{flexDirection: "row", gap: 12, alignItems: "center"}}>
                <Image source={require('../../assets/icons/marketingIcons/smsCampaign/dashboard.png')} style={styles.dashboardIcon} />
                <Text style={[textTheme.titleSmall]}>Dashboard</Text>
            </View>
            <FontAwesome name="angle-right" size={24} color="black" />
        </PrimaryButton>
        <Divider />
        <PrimaryButton buttonStyle={styles.card} pressableStyle={styles.cardPressable}>
            <View style={{flexDirection: "row", gap: 12, alignItems: "center"}}>
                <Image source={require('../../assets/icons/marketingIcons/smsCampaign/sms_recharge.png')} style={styles.dashboardIcon} />
                <Text style={[textTheme.titleSmall]}>SMS recharge</Text>
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