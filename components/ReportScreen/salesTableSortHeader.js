import { Image, Text, TouchableOpacity, View } from "react-native";
import { fetchAndUpdateSalesReport } from "./fetchAndUpdateSalesReport";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import TextTheme from "../../constants/TextTheme";
import Colors from "../../constants/Colors";
import sortIcon from "../../assets/icons/reportIcons/sort.png"
import { useSelector } from "react-redux";
export const salesTableSortHeader = (dispatch, str, toggleSortItem, setToggleSortItem, setGetSortOrderKey,query,currentFromDate,currentToDate) => {
    const [dateSortOrderKey, setDateSortOrderKey] = useState(1);
    const [clientSortOrderKey, setClientSortOrderKey] = useState(1);
    const [grossTotalSortOrderKey, setGrossTotalSortOrderKey] = useState(1);
    const maxEntry = useSelector((state) => state.report.maxEntry);
    const pageNo = useSelector((state) => state.report.pageNo);
    return (
        <TouchableOpacity
            onPress={() => {
                if (str === "DATE") {
                    setToggleSortItem("invoice_issued_on");
                    setDateSortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            fetchAndUpdateSalesReport(
                                dispatch,
                                pageNo,
                                maxEntry,
                                currentFromDate,
                                currentToDate,
                                query,
                                "invoice_issued_on",
                                sortOrder === "reset" ? "desc" : sortOrder
                            );
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                } else if (str === "CLIENT") {
                    setToggleSortItem("name");

                    setClientSortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            fetchAndUpdateSalesReport(
                                dispatch,
                                pageNo,
                                maxEntry,
                                currentFromDate,
                                currentToDate,
                                query,
                                "name",
                                sortOrder === "reset" ? "desc" : sortOrder
                            );
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                } else if (str === "GROSS TOTAL") {
                    setToggleSortItem("net_total");

                    setGrossTotalSortOrderKey((prev) => {
                        const newOrderKey = prev + 1 > 3 ? 1 : prev + 1;
                        const sortOrder = newOrderKey === 1 ? "reset" : newOrderKey === 2 ? "asc" : "desc";
                        if (newOrderKey === 1) {
                            setToggleSortItem(null);
                        } else {
                            fetchAndUpdateSalesReport(
                                dispatch,
                                pageNo,
                                maxEntry,
                                currentFromDate,
                                currentToDate,
                                query,
                                "net_total",
                                sortOrder === "reset" ? "desc" : sortOrder
                            );
                        }
                        setGetSortOrderKey(newOrderKey);
                        return newOrderKey;
                    });
                }
            }}
            style={{
                flex: 1,
                height: "100%",
                paddingHorizontal: 20,
                paddingVertical: 10,
                width: "100%",
            }}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: 5,
                }}
            >
                <Text
                    style={[
                        TextTheme.bodyMedium,
                        { textAlign: "center", flexWrap: "wrap" },
                        toggleSortItem === "invoice_issued_on" && str === "DATE"
                            ? { color: Colors.highlight }
                            : toggleSortItem === "name" && str === "CLIENT"
                                ? { color: Colors.highlight }
                                : toggleSortItem === "net_total" && str === "GROSS TOTAL"
                                    ? { color: Colors.highlight }
                                    : { color: Colors.black },
                    ]}
                    numberOfLines={1}
                >
                    {str}
                </Text>

                {str === "DATE" && (
                    toggleSortItem === "invoice_issued_on" ? (
                        dateSortOrderKey === 1 ? (
                            <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                        ) : dateSortOrderKey === 2 ? (
                            <FontAwesome name="sort-amount-asc" size={14} color="black" />
                        ) : (
                            <FontAwesome name="sort-amount-desc" size={14} color="black" />
                        )
                    ) : (
                        <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                    )
                )}

                {str === "CLIENT" && (
                    toggleSortItem === "name" ? (
                        clientSortOrderKey === 1 ? (
                            <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                        ) : clientSortOrderKey === 2 ? (
                            <FontAwesome name="sort-amount-asc" size={14} color="black" />
                        ) : (
                            <FontAwesome name="sort-amount-desc" size={14} color="black" />
                        )
                    ) : (
                        <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                    )
                )}

                {str === "GROSS TOTAL" && (
                    toggleSortItem === "net_total" ? (
                        grossTotalSortOrderKey === 1 ? (
                            <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                        ) : grossTotalSortOrderKey === 2 ? (
                            <FontAwesome name="sort-amount-asc" size={14} color="black" />
                        ) : (
                            <FontAwesome name="sort-amount-desc" size={14} color="black" />
                        )
                    ) : (
                        <Image source={sortIcon} style={{ width: 20, height: 20 }} />
                    )
                )}
            </View>
        </TouchableOpacity>
    )
}