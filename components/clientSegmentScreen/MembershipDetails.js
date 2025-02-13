import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {MembershipCard} from "./MembershipCard";
import textTheme from "../../constants/TextTheme";


export function MembershipDetails(props) {

    function renderItem(itemData) {
        return <MembershipCard
            status={itemData.item.validity}
            startDate={itemData.item.valid_from}
            expiryDate={itemData.item.valid_till}
            length={itemData.item.duration}
            validFor={itemData.item.total_services_count}
            name={itemData.item.membership_name}
            isAllServices={itemData.item.is_all_services_included}
            serviceCount={itemData.item.total_services_count}
            imagePath={require("../../assets/icons/membershipAvatar.png")}
            size={40}
        />
    }


    return <View style={styles.membershipDetails}>
        <Text style={[textTheme.titleMedium, styles.title]}>Memberships</Text>

        <FlatList
            data={props.membershipData}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
            contentContainerStyle={{gap: 16}}
        />

    </View>
}

const styles = StyleSheet.create({
    membershipDetails: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        paddingVertical: 16
    },
    flatList: {
        width: '100%',
        marginBottom: 32

    }
})