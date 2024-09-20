import { ActivityIndicator, BackHandler, FlatList, ScrollView, ScrollViewBase, StyleSheet, Text, TextInput, View } from "react-native";
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from "../../ui/PrimaryButton";
import Divider from "../../ui/Divider";
import TextTheme from "../../constants/TextTheme";
import React, { useEffect, useState, useLayoutEffect } from "react";
import ServiceItem from "./ServiceItem";
import ProductItem from "./ProductItem";
import axios from "axios";
import { useSelector } from "react-redux";
import SearchBar from "../../ui/SearchBar";

const ProductsList = (props) => {
    const productsData = useSelector(state => state.catalogue.products.items);
    const [filteredProductsData, setFilteredProductsData] = useState(productsData);

    const filterProductsData = (filterValue) => {
        const lowerCaseFilterValue = filterValue.toLowerCase();
        if (productsData[0] === null) return [];
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

    const transformedData = productsData[0] !== null ? filteredProductsData.map(categoryObj =>
        Object.keys(categoryObj).map(key => ({
            parent_category: key,
            products: categoryObj[key]
        }))
    ).flat() : [];
    
    // useEffect(() => {
    //     console.log("1");
    //     const backAction = () => {
    //         console.log("3212");
    //         return true;  // Always return true to indicate that the event has been handled.
    //     };
    
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    
    //     return () => {
    //         backHandler.remove();  // Ensure that the event listener is removed properly.
    //     };
    // }, [props.selectedCategory]);
    
    return (
        <View style={styles.commonSelectTemplate}>
            <View style={styles.headingAndSearchContainer}>
                {
                    productsData[0] !== null ?
                        <>
                            <Text style={[textTheme.titleMedium, styles.headingText]}>Select Products</Text>
                            <SearchBar filter={true}
                                onPressFilter={() => {
                                }}
                                onChangeText={filterProductsData}
                                placeholder={"Search by product name or prices"} />
                        </>
                        : null
                }
            </View>
            {
                productsData[0] === null ? <View style={styles.noDataMessage}>
                    <Text style={TextTheme.titleMedium}>No Products Available</Text>
                </View>
                    :
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
                                    renderItem={({ item }) => <ProductItem data={item}
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

            }
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
    productsLengthText: {},
    noDataMessage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "-50%"
    }
});

export default ProductsList;