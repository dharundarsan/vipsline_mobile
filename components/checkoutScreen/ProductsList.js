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
import {useSelector} from "react-redux";
import SearchBar from "../../ui/SearchBar";

const ProductsList = (props) => {
    const productsData = useSelector(state => state.catalogue.products.items);
    const [filteredProductsData, setFilteredProductsData] = useState(productsData);

    const filterProductsData = (filterValue) => {
        const lowerCaseFilterValue = filterValue.toLowerCase();
        const newFilteredData = productsData.map((categoryObj) => {
            const filteredCategories = {};

            Object.keys(categoryObj).forEach((category) => {
                const filteredProducts = categoryObj[category].filter((product) => {
                    return product.name.toLowerCase().includes(lowerCaseFilterValue) ||
                        product.price.toString().includes(filterValue) || product.discounted_price.toString().includes(filterValue);

                });

                if (filteredProducts.length > 0) {
                    filteredCategories[category] = filteredProducts;
                }
            });

            return filteredCategories;
        }).filter(categoryObj => Object.keys(categoryObj).length > 0);

        setFilteredProductsData(newFilteredData);
    };

    const transformedData = filteredProductsData.map(categoryObj =>
        Object.keys(categoryObj).map(key => ({
            parent_category: key,
            products: categoryObj[key]
        }))
    ).flat();
    return (
        <View style={styles.commonSelectTemplate}>
            <View style={styles.headingAndSearchContainer}>
                <Text style={[textTheme.titleMedium, styles.headingText]}>Select Products</Text>
                <SearchBar filter={true}
                           onPressFilter={() => {
                               // console.log("Filter pressed");
                           }}
                           onChangeText={filterProductsData}
                           placeholder={"Search by product name or prices"}/>
            </View>
            <ScrollView style={styles.flatListContainer} fadingEdgeLength={75}>
                {transformedData.map((item, index) => (
                    <View key={index}>
                        <View style={styles.parentCategoryAndProductsLengthContainer}>
                            <Text style={[textTheme.titleMedium, styles.parentCategoryText]}>
                                {item.parent_category}
                            </Text>
                            <View style={styles.productsLengthContainer}>
                                <Text
                                    style={[textTheme.titleMedium, styles.productsLengthText]}>{item.products.length}</Text>
                            </View>
                        </View>
                        <FlatList
                            data={item.products}
                            renderItem={({item}) => <ProductItem data={item}
                                                                 closeOverallModal={props.closeOverallModal}
                            />}
                            // renderItem={({item}) => <ProductItem data={item}
                            //                                      addToTempSelectedItems={addToTempSelectedItems}
                            //                                      selected={tempSelectedItems.includes(item)}/>}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                        />
                    </View>
                ))}
            </ScrollView>
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
    parentCategoryText: {},
    flatListContainer: {
        // marginBottom: 120,
    },
    parentCategoryAndProductsLengthContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 40,
        marginVertical: 25,
        gap: 10,
    },
    productsLengthContainer: {
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 100,
        paddingVertical: 0,
        paddingHorizontal: 6,
    },
    productsLengthText: {}
});

export default ProductsList;