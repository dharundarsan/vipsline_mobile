import {Text, View, StyleSheet, FlatList} from "react-native";
import textTheme from "../../constants/TextTheme";
import MarketingCard from "../../components/marketing/MarketingCard";

export default function Campaigns(props) {

    const listItems = [
        {
            title: "SMS",
            content: "Reach out to your customers by launching an SMS campaign today",
            source: require("../../assets/icons/marketingIcons/sms.png"),
            onPress: () => props.navigation.navigate("SMS Campaign"),
        },
        {
            title: "Service Reminders",
            content: "Schedule and manage automated service reminders",
            source: require("../../assets/icons/marketingIcons/service_remainders.png"),
            onPress: () => props.navigation.navigate("Service Reminders"),
        },
        {
            title: "Greetings",
            content: "Manage birthday and anniversary greetings",
            source: require("../../assets/icons/marketingIcons/greetings.png"),
            onPress: () => props.navigation.navigate("Greetings")
        }
    ]

    function renderItem({item}) {
        return <MarketingCard
            title={item.title}
            content={item.content}
            source={item.source}
            onPress={item.onPress}
        />
    }


    return <View style={styles.campaigns}>
        <Text style={[textTheme.titleSmall]}>
            Select your campaign type to proceed
        </Text>
        <FlatList
            data={listItems}
            renderItem={renderItem}
            style={styles.flatList}
            contentContainerStyle={styles.contentContainerStyle}
        />
    </View>
}

const styles = StyleSheet.create({
    campaigns: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 32
    },
    flatList: {
        marginVertical: 32,
    },
    contentContainerStyle: {
        gap: 16
    }
})