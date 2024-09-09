import {ActivityIndicator, FlatList, ScrollView, ScrollViewBase, StyleSheet, Text, TextInput, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {Ionicons} from '@expo/vector-icons';
import PrimaryButton from "../../ui/PrimaryButton";
import Divider from "../../ui/Divider";
import TextTheme from "../../constants/TextTheme";
import React, {useEffect, useState, useLayoutEffect} from "react";
import ServiceItem from "./ServiceItem";
import ProductItem from "./ProductItem";
import axios from "axios";
import MembershipItem from "./MembershipItem";
import {useSelector} from "react-redux";
import PackageItem from "./PackageItem";
import SearchBar from "../../ui/SearchBar";
import EditMembershipModal from "./EditMembershipModal";

const MembershipsAndPackagesList = (props) => {
    const data = useSelector(state => props.category === "memberships" ? state.catalogue.memberships.items : state.catalogue.packages.items);
    const [filteredData, setFilteredData] = useState(data);


    const searchData = (searchValue) => {
        const lowerCaseFilterValue = searchValue.toLowerCase();
        // console.log(data);
        setFilteredData(data.filter(item => {
            if (props.category === "memberships")
                return item.name.toLowerCase().includes(searchValue) || item.price.toString().includes(searchValue)
            else
                return item.name.toLowerCase().includes(searchValue) || item.price.toString().includes(searchValue) || item.package_cost.toString().includes(searchValue)

        }))
    };

    return (
        <>
            <View style={styles.commonSelectTemplate}>
                <View style={styles.headingAndSearchContainer}>
                    <Text
                        style={[textTheme.titleMedium, styles.headingText]}>Select {props.category === "packages" ? "Package" : "Membership"}</Text>
                    <SearchBar filter={true}
                               onPressFilter={() => {
                                   console.log("Filter pressed");
                               }}
                               onChangeText={searchData}
                               placeholder={"Search by name or prices"}/>
                </View>
                <FlatList
                    data={filteredData}
                    renderItem={({item}) => {
                        return (props.category === "memberships" ?
                            <MembershipItem data={item}
                                            closeOverallModal={props.closeOverallModal}

                            /> :
                            <PackageItem data={item}
                                         closeOverallModal={props.closeOverallModal}

                            />)
                    }}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </>


    );
};

const styles = StyleSheet.create({
    commonSelectTemplate: {
        flex: 1,
    },
    headingAndSearchContainer: {
        padding: 15,
    },
    headingText: {
        marginBottom: 10
    },
    parentCategoryText: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    flatListContainer: {
        marginBottom: 120,
    }
});

export default MembershipsAndPackagesList;