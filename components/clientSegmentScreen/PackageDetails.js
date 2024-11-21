import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {MembershipCard} from "./MembershipCard";
import textTheme from "../../constants/TextTheme";
import {PackageCard} from "./PackageCard";


export function PackageDetails(props) {

    function renderItem(itemData) {
        return <PackageCard
            status={itemData.item.validity}
            startDate={itemData.item.valid_from}
            expiryDate={itemData.item.valid_till}
            length={itemData.item.duration}
            validFor={itemData.item.total_services_count}
            name={itemData.item.package_name}
            isAllServices={itemData.item.is_all_services_included}
            serviceCount={itemData.item.total_services_count}
            imagePath={require("../../assets/icons/packageAvatar.png")}
            size={40}
            totalSessions={itemData.item.total_quantity}
            availableSessions={itemData.item.available_quantity}
            packageId={itemData.item.client_package_id}
        />
    }




    return <View style={styles.membershipDetails}>
        <Text style={[textTheme.titleMedium, styles.title]}>Packages</Text>

        <FlatList
            data={props.pacakgeData}
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