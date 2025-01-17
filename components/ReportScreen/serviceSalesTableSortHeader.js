import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import TextTheme from '../../constants/TextTheme';
import sortIcon from "../../assets/icons/reportIcons/sort.png"
import { fetchSalesByServiceForBusiness } from '../../store/reportSlice';

const serviceSalesTableSortHeader = (dispatch,str,pageNo,maxEntry,fromDate,toDate,query,setGetSortOrderKey,setToggleSortItem,toggleSortItem) => {
    const [serviceNameSortOrderKey, setServiceNameSortOrderKey] = useState(1);
    const [categorySortOrderKey, setCategorySortOrderKey] = useState(1);
    const [serviceCostSortOrderKey, setServiceCostSortOrderKey] = useState(1);
    const [qtySoldSortOrderKey, setQtySoldSortOrderKey] = useState(1);
    const [totalSalesSortOrderKey, setTotalSalesSortOrderKey] = useState(1);
    return (
        <TouchableOpacity
            onPress={() => {
                if (str === "SERVICE NAME") {
                    setToggleSortItem("name");
                    setServiceNameSortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            dispatch(fetchSalesByServiceForBusiness(pageNo, maxEntry, fromDate, toDate, query, "name", sortOrder === "reset" ? "desc" : sortOrder))
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                } else if (str === "CATEGORY") {
                    setToggleSortItem("category");
                    setCategorySortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            dispatch(fetchSalesByServiceForBusiness(pageNo, maxEntry, fromDate, toDate, query, "category", sortOrder === "reset" ? "desc" : sortOrder))
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                } else if (str === "SERVICE COST") {
                    setToggleSortItem("price");
                    setServiceCostSortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            dispatch(fetchSalesByServiceForBusiness(pageNo, maxEntry, fromDate, toDate, query, "price", sortOrder === "reset" ? "desc" : sortOrder))
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                } else if (str === "QTY SOLD") {
                    setToggleSortItem("service_count");
                    setQtySoldSortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            dispatch(fetchSalesByServiceForBusiness(pageNo, maxEntry, fromDate, toDate, query, "service_count", sortOrder === "reset" ? "desc" : sortOrder))
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                } else if (str === "TOTAL SALES") {
                    setToggleSortItem("total_sales");
                    setTotalSalesSortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            dispatch(fetchSalesByServiceForBusiness(pageNo, maxEntry, fromDate, toDate, query, "total_sales", sortOrder === "reset" ? "desc" : sortOrder))
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                }
            }}
            style={{
                flex: 1,
                height: "100%",
                paddingHorizontal: 10,
                paddingVertical: 10,
                width: "100%",
            }}
        >
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    gap: 5,
                }}
            >
                <Text
                    style={[
                        TextTheme.bodyMedium,
                        { textAlign: "start", flexWrap: "wrap" },
                        toggleSortItem === "service_name" && str === "SERVICE NAME"
                            ? { color: Colors.highlight }
                            : toggleSortItem === "category" && str === "CATEGORY"
                                ? { color: Colors.highlight }
                                : toggleSortItem === "service_cost" && str === "SERVICE COST"
                                    ? { color: Colors.highlight }
                                    : toggleSortItem === "qty_sold" && str === "QTY SOLD"
                                        ? { color: Colors.highlight }
                                        : toggleSortItem === "total_sales" && str === "TOTAL SALES"
                                            ? { color: Colors.highlight }
                                            : { color: Colors.black },
                    ]}
                    numberOfLines={1}
                >
                    {str}
                </Text>

                {/* Add Icons for Sorting */}
                {str === "SERVICE NAME" && (
                    toggleSortItem === "service_name" ? (
                        serviceNameSortOrderKey === 1 ? (
                            <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                        ) : serviceNameSortOrderKey === 2 ? (
                            <FontAwesome name="sort-amount-asc" size={14} color="black" />
                        ) : (
                            <FontAwesome name="sort-amount-desc" size={14} color="black" />
                        )
                    ) : (
                        <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                    )
                )}

                {/* Repeat for CATEGORY, SERVICE COST, QTY SOLD, and TOTAL SALES */}
            </View>
        </TouchableOpacity>
    );
}

export default serviceSalesTableSortHeader

const styles = StyleSheet.create({})