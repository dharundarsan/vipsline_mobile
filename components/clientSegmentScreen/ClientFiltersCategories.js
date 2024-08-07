import ClientFilterCard from "./ClientFilterCard";
import Colors from "../../constants/Colors";
import {ScrollView, StyleSheet} from "react-native";
import {useSelector} from "react-redux";

export default function ClientFiltersCategories(props) {

    const totalClientCount = useSelector(state => state.client.clientCount[0].all_clients_count)
    const activeClientCount = useSelector(state => state.client.clientCount[0].active_clients_count)
    const inactiveClientCount = useSelector(state => state.client.clientCount[0].inactive_clients_count)
    const churnClientCount = useSelector(state => state.client.clientCount[0].churn_clients_count)
    const leadsClientCount = useSelector(state => state.client.clientCount[0].leads_clients_count)



    return (
        <ScrollView
            horizontal style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
        >
            <ClientFilterCard
                clientFilterName ="Total Clients"
                totalClients={totalClientCount}
                color={Colors.totalClients}
                imgSource={require("../../assets/icons/total_clients.png")}
                iconSize={{width: 38, height: 38}}
                onPress={() => props.changeSelectedFilter("all_clients_count")}
                isPressed={props.filterPressed === "all_clients_count"}
            />
            <ClientFilterCard
                clientFilterName ="Active clients"
                totalClients={activeClientCount}
                color={Colors.activeClient}
                imgSource={require("../../assets/icons/activeClients.png")}
                onPress={() => props.changeSelectedFilter("active_clients_count")}
                isPressed={props.filterPressed === "active_clients_count"}
                iconSize={{width: 21}}
            />
            <ClientFilterCard
                clientFilterName ="Inactive clients"
                totalClients={inactiveClientCount}
                color={Colors.inactiveClient}
                imgSource={require("../../assets/icons/churin.png")}
                onPress={() => props.changeSelectedFilter("inactive_clients_count")}
                isPressed={props.filterPressed === "inactive_clients_count"}
            />
            <ClientFilterCard
                clientFilterName ="Churn clients"
                totalClients={churnClientCount}
                color={Colors.churnClient}
                imgSource={require("../../assets/icons/churin.png")}
                onPress={() => props.changeSelectedFilter("churn_clients_count")}
                isPressed={props.filterPressed === "churn_clients_count"}
            />
            <ClientFilterCard
                clientFilterName ="All Leads"
                totalClients={leadsClientCount}
                color={Colors.allLeads}
                imgSource={require("../../assets/icons/allLeads.png")}
                iconSize={{width: 24, height: 18}}
                onPress={() => props.changeSelectedFilter("leads_clients_count")}
                isPressed={props.filterPressed === "leads_clients_count"}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {}
})