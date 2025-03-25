import {Text, View, StyleSheet, Image} from "react-native";
import Colors from "../../../constants/Colors";
import textTheme from "../../../constants/TextTheme";
import BulletListView from "../BulletListView";
import PrimaryButton from "../../../ui/PrimaryButton";
import {useRef, useState} from "react";
import ManageGreetingsModal from "./ManageGreetingsModal";
import Toast from "../../../ui/Toast";
import getListOfGreetingsAPI from "../../../apis/marketingAPI/greetingsAPI/getListOfGreetingsAPI";

export default function GreetingsLandingPage(props) {
    const [configureGreetingsVisibility, setConfigureGreetingsVisibility] = useState(false)

    const data = [
        "Easy contact selection - select the target audience from your database or load them using ‘file upload’",
        "Quick launch - send messages to a large audience in a short span of time",
        "Track performance with detailed reports",
    ];

    const toastRef = useRef(null);


    return (<View style={styles.SMSCampaignLandingPage}>
        <Toast ref={toastRef}/>
        <View style={styles.content}>
            <Image source={require("../../../assets/icons/marketingIcons/serviceReminders/bell.png")} style={styles.mobileIcon} />

            <Text style={[textTheme.titleMedium, {marginTop: 24, textAlign: 'center'}]}>Greetings for Birthday and Anniversaries</Text>

            <Text style={[textTheme.bodyMedium, {marginTop: 8, textAlign: 'center'}]}>Send automated wishes to make your clients feel special</Text>

            {
                configureGreetingsVisibility &&
                <ManageGreetingsModal
                    visible={configureGreetingsVisibility}
                    onClose={() => {
                        setConfigureGreetingsVisibility(false);
                        getListOfGreetingsAPI().then((response) => {
                            props.setGetGreetingsList(response.data.data[0].campaign_list);
                            if (response.data.data[0].campaign_list.length === 0) {
                                props.setIsCampaignListEmpty(true);
                                props.navigation.setOptions({ title: 'Greetings Landing Page' });
                            }
                            else {
                                props.setIsCampaignListEmpty(false);
                                props.navigation.setOptions({ title: 'Greetings List' });
                            }

                        })
                    }}
                    toastRef={toastRef}
                />
            }

            <PrimaryButton
                label={"Manage Greetings"}
                buttonStyle={styles.button}
                onPress={() => {
                    setConfigureGreetingsVisibility(true);
                }}

            />


        </View>


    </View>)
}

const styles = StyleSheet.create({
    SMSCampaignLandingPage: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        paddingVertical: 18,

    },
    mobileIcon: {
        width: 98,
        height: 98,
        marginTop: 32,
        alignSelf: "center",

    },
    content: {
        borderWidth: 1,
        borderRadius: 8,
        width: "100%",
        borderColor: Colors.grey400,
        paddingHorizontal: 32,
        backgroundColor: Colors.background100
    },
    bulletList: {
        marginTop: 24
    },
    contentContainerStyle: {
        gap: 8
    },
    button: {
        marginVertical: 32
    }
})