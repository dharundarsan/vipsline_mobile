import ClientFilterCard from "./ClientFilterCard";
import Colors from "../../constants/Colors";
import {ScrollView, StyleSheet} from "react-native";

export default function ClientFiltersCategories(props) {
    return (
        <ScrollView
            horizontal style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
        >
            <ClientFilterCard
                clientFilterName ="Total Clients"
                totalClients={"223423"}
                color={Colors.totalClients}
                imgSource={require("../../assets/icons/total_clients.png")}
                iconSize={{width: 38, height: 38}}
                onPress={() => props.setFilterPressed(1)}
                isPressed={props.filterPressed === 1}
            />
            <ClientFilterCard
                clientFilterName ="Active clients"
                totalClients={"223423"}
                color={Colors.activeClient}
                imgSource={require("../../assets/icons/activeClients.png")}
                onPress={() => props.setFilterPressed(2)}
                isPressed={props.filterPressed === 2}
                iconSize={{width: 21}}
            />
            <ClientFilterCard
                clientFilterName ="Inactive clients"
                totalClients={"223423"}
                color={Colors.inactiveClient}
                imgSource={require("../../assets/icons/churin.png")}
                onPress={() => props.setFilterPressed(3)}
                isPressed={props.filterPressed === 3}
            />
            <ClientFilterCard
                clientFilterName ="Churn clients"
                totalClients={"223423"}
                color={Colors.churnClient}
                imgSource={require("../../assets/icons/churin.png")}
                onPress={() => props.setFilterPressed(4)}
                isPressed={props.filterPressed === 4}
            />
            <ClientFilterCard
                clientFilterName ="All Leads"
                totalClients={"223423"}
                color={Colors.allLeads}
                imgSource={require("../../assets/icons/allLeads.png")}
                iconSize={{width: 24, height: 18}}
                onPress={() => props.setFilterPressed(5)}
                isPressed={props.filterPressed === 5}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {}
})