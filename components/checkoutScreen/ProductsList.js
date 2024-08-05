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
import {useSelector} from "react-redux";

const ProductsList = (props) => {
    const productsData = useSelector(state => state.catalogue.products.items);
    const [filteredProductsData, setFilteredProductsData] = useState(productsData);
    const [tempSelectedItems, setTempSelectedItems] = useState([]);

    const addToTempSelectedItems = (item) => {
        setTempSelectedItems((prevState) => [...prevState, item]);
    }

    const filterProductsData = (filterValue) => {
        const lowerCaseFilterValue = filterValue.toLowerCase();
        const newFilteredData = productsData.map((categoryObj) => {
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
                <View style={styles.searchContainer}>
                    <Ionicons name="search-sharp" style={styles.searchLogo} size={20} color={Colors.grey400}/>
                    <TextInput
                        style={[textTheme.bodyMedium, styles.searchTextInput]}
                        placeholder={"Search by service name or prices"}
                        onChangeText={filterProductsData}
                        placeholderTextColor={Colors.grey400}
                    />
                    <PrimaryButton buttonStyle={styles.searchFilterButton}
                                   pressableStyle={styles.searchFilterPressable}>
                        <Ionicons name="filter" size={20} color={Colors.grey900}/>
                    </PrimaryButton>
                </View>
            </View>
            <ScrollView style={styles.flatListContainer} fadingEdgeLength={75}>
                {transformedData.map((item, index) => (
                    <View key={index}>
                        <Text style={[textTheme.titleMedium, styles.parentCategoryText]}>
                            {item.parent_category}
                        </Text>
                        <FlatList
                            data={item.products}
                            renderItem={({item}) => <ProductItem data={item}
                                                                 addToTempSelectedItems={addToTempSelectedItems}
                                                                 selected={tempSelectedItems.includes(item)}/>}
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
    searchContainer: {
        flexDirection: "row",
        backgroundColor: Colors.background,
        borderRadius: 8,
        borderColor: Colors.grey600,
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
    searchFilterButton: {
        borderLeftColor: Colors.grey600,
        borderLeftWidth: 1,
        backgroundColor: Colors.transparent,
        borderRadius: 0
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

export default ProductsList;