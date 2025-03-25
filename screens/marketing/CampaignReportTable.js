import {View, Text, ScrollView, StyleSheet} from "react-native";
import {useMemo} from "react";
import {Row, Table} from "react-native-table-component";
import SortableHeader from "../../components/ReportScreen/SortableHeader";
import Colors from "../../constants/Colors";
import {useDispatch} from "react-redux";

export default function CampaignReportTable({
                                                tableHeaderList,
                                                dataList,
                                                pageNo,
                                                apiFunction,
                                                maxEntry,
                                                currentFromDate,
                                                currentToDate,
                                                onChangeData,
                                                tableWidthHeader,
                                                renderItem,
                                                mergedColumns,

                                            }) {
    // const calculateColumnWidths = useMemo(() => {
    //     return tableWidthHeader?.map((header, index) => {
    //         const headerWidth = header.length * 14;
    //         const maxDataWidth = dataList.reduce((maxWidth, row) => {
    //
    //             const cellContent = row[index]?.toString() || '';
    //             return Math.max(maxWidth, cellContent.length * 14);
    //         }, 0);
    //         console.log(headerWidth)
    //         return Math.max(headerWidth, maxDataWidth);
    //     });
    // }, [dataList]);
    const calculateColumnWidths = useMemo(() => {
        return tableWidthHeader?.map((header, index) => {
            const headerWidth = header.length * 12; // Reduce base multiplier for better fit

            const maxDataWidth = dataList.reduce((maxWidth, row) => {
                let cellContent = "";

                if (mergedColumns[index].includes(" + ")) {
                    const keys = mergedColumns[index].split(" + ").map(k => k.trim());
                    cellContent = keys.map(key => row[key]?.toString()?.trim() || "").join(" "); // Join with space
                } else {
                    cellContent = row[mergedColumns[index]]?.toString()?.trim() || "";
                }

                // Measure the longest word instead of full text length to avoid excessive width
                const longestWordLength = Math.max(...cellContent.split(/\s+/).map(word => word.length), 0);

                return Math.max(maxWidth, longestWordLength * 14); // Reduce multiplier to balance width
            }, 0);

            return Math.max(headerWidth, maxDataWidth);
        });
    }, [dataList, mergedColumns]);


    const widthArr = calculateColumnWidths;
    const dispatch = useDispatch();

    return (
        <View>
            <Table borderStyle={{ borderColor: '#c8e1ff',  }}>
                {/* Render Table Header */}
                <Row
                    data={tableHeaderList.map((item) => (
                        <SortableHeader
                            key={item.key}
                            title={item.title}
                            sortKey={""}
                            currentSortKey={() => {}}
                            dispatch={dispatch}
                            pageNo={pageNo}
                            onChangeFunction={apiFunction}
                            maxEntry={maxEntry}
                            fromDate={currentFromDate}
                            toDate={currentToDate}
                            onSortChange={() => {}}
                            onChangeData={onChangeData}
                            setGetSortOrderKey={() => {}}
                            query={""}
                        />
                    ))}
                    textStyle={{ flex: 1, width: "100%", paddingVertical: 10 }}
                    widthArr={dataList.length > 0 ? widthArr : undefined}
                    style={{ borderWidth: 1, borderColor: Colors.grey250, backgroundColor: Colors.grey150 }}
                />

                {/* Render Table Rows */}
                {dataList.length > 0 ? (
                    <>
                        {dataList.map((rowData, rowIndex) => {
                            const formattedRow = mergedColumns.map((column) => {
                                if (column.includes(" + ")) {
                                    // Concatenate values from multiple keys
                                    const keys = column.split(" + ");
                                    return keys
                                        .map((key) => rowData[key]?.toString() || "")
                                        .filter(Boolean) // Remove empty values
                                        .join("\n"); // New line for each entry
                                }
                                return <Text style={{padding: 8}}>{rowData[column]}</Text>; // Normal column rendering
                            });

                            return (
                                <Row
                                    key={rowIndex}
                                    data={formattedRow.map((item, index) => renderItem(item, index))}
                                    widthArr={widthArr}
                                    style={styles.tableBorder}
                                />
                            );
                        })}
                    </>
                ) : (
                    <Text style={[styles.noDataText, styles.tableBorder]}>No Data Found</Text>
                )}
            </Table>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'left',
        paddingVertical: 10,
        fontSize: 14,
        flex: 1,
        width: '100%',
    },
    tableBorder: {
        borderColor: Colors.grey250,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
    },
    noDataText: {
        textAlign: 'center',
        paddingVertical: 20
    },
});

