import {View, Text, StyleSheet, Platform, ScrollView, FlatList} from 'react-native';
import textTheme from "../constants/TextTheme";
import Colors from "../constants/Colors";
import Divider from "../ui/Divider";
import BusinessCard from "../components/listOfBusinessesScreen/BusinessCard";
import {useSelector} from "react-redux";


export default function ListOfBusinessesScreen() {
    const listOfBusinesses = useSelector(state => state.businesses.listOfBusinesses);
    const name = useSelector(state => state.loginUser.details).name;

    function renderItem(itemData) {
        return (
            <BusinessCard
                name={itemData.item.name}
                area={itemData.item.area}
                address={itemData.item.address}
                imageURL={itemData.item.photo}
                status={itemData.item.verificationStatus}
            />
        );
    }



    return (
        <ScrollView style={styles.listOfBusinesses} contentContainerStyle={{alignItems: "center"}}>
            <View style={styles.header}>
                <Text style={[textTheme.titleLarge]}>Locations</Text>
            </View>
            <Divider />
            <View style={styles.body}>
                <Text style={[textTheme.titleMedium]}>
                    Hi, {name}!
                </Text>
                <Text style={[textTheme.bodyMedium, styles.descriptionText]}>
                    You are a part of the following business. Go to the business which you wish to access now
                </Text>

                <FlatList
                    data={listOfBusinesses}
                    renderItem={renderItem}
                    style={styles.listStyle}
                    scrollEnabled={false}
                    contentContainerStyle={{gap: 16, borderRadius: 8, overflow: 'hidden'}}
                />
            </View>

        </ScrollView>
    );
}


const styles = StyleSheet.create({
    listOfBusinesses :{
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        marginVertical: 16,
    },
    body: {
        width: "90%",
        marginTop: 16,
        marginBottom: 32
    },
    descriptionText: {
        marginTop: 16,
        color: Colors.grey650,
    },
    listStyle: {
        marginTop: 32,
    }

})