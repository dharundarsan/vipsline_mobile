import {ActivityIndicator, FlatList, ScrollView, ScrollViewBase, StyleSheet, Text, TextInput, View} from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {Ionicons} from '@expo/vector-icons';
import PrimaryButton from "../../ui/PrimaryButton";
import Divider from "../../ui/Divider";
import TextTheme from "../../constants/TextTheme";
import {useEffect, useState, useLayoutEffect} from "react";
import ServiceItem from "./ServiceItem";
import ProductItem from "./ProductItem";
import axios from "axios";
import MembershipItem from "./MembershipItem";
import {useSelector} from "react-redux";
import PackageItem from "./PackageItem";

const MembershipsAndPackagesList = (props) => {
    const data = useSelector(state => props.category === "memberships" ? state.catalogue.memberships.items : state.catalogue.packages.items);
    const [filteredData, setFilteredData] = useState(data);
    const [tempSelectedItems, setTempSelectedItems] = useState([]);

    console.log(data);

    const addToTempSelectedItems = (item) => {
        setTempSelectedItems((prevState) => [...prevState, item]);
    }

    const filterData = (filterValue) => {
        const lowerCaseFilterValue = filterValue.toLowerCase();
        const newFilteredData = data.map((categoryObj) => {
            const filteredCategories = {};

            Object.keys(categoryObj).forEach((category) => {
                const filteredProducts = categoryObj[category].filter((product) => {
                    return product.name.toLowerCase().includes(lowerCaseFilterValue) ||
                        product.price.toString().includes(filterValue);
                });

                if (filteredProducts.length > 0) {
                    filteredCategories[category] = filteredProducts;
                }
            });

            return filteredCategories;
        }).filter(categoryObj => Object.keys(categoryObj).length > 0);

        setFilteredData(newFilteredData);
    };

    return (
        <View style={styles.commonSelectTemplate}>
            <View style={styles.headingAndSearchContainer}>
                <Text
                    style={[textTheme.titleMedium, styles.headingText]}>Select {props.category === "packages" ? "Package" : "Membership"}</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-sharp" style={styles.searchLogo} size={20} color={Colors.grey400}/>
                    <TextInput
                        style={[textTheme.bodyMedium, styles.searchTextInput]}
                        placeholder={"Search by name or prices"}
                        onChangeText={filterData}
                        placeholderTextColor={Colors.grey400}
                    />
                </View>
            </View>
            <FlatList
                data={filteredData}
                renderItem={({item}) => {
                    return (props.category === "memberships" ?
                        <MembershipItem data={item}
                                        addToTempSelectedItems={addToTempSelectedItems}
                                        selected={tempSelectedItems.includes(item)}/> :
                        <PackageItem data={item}
                                     addToTempSelectedItems={addToTempSelectedItems}
                                     selected={tempSelectedItems.includes(item)}/>)
                }}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>

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
    searchContainer: {
        flexDirection: "row",
        backgroundColor: Colors.background,
        borderRadius: 20,
        borderColor: Colors.grey500,
        borderWidth: 1
    },
    searchLogo: {
        paddingVertical: 9,
        paddingLeft: 9,
    },
    searchTextInput: {
        fontSize: 15,
        marginLeft: 10,
        flex: 1,
    },
    searchFilterPressable: {
        paddingHorizontal: 9,
        paddingVertical: 9,
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