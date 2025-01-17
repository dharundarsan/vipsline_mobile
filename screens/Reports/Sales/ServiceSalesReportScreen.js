import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import useDateRange from '../../../hooks/useDateRange';
import TextTheme from '../../../constants/TextTheme';
import { useDispatch } from 'react-redux';
import DatePicker from '../../../ui/DatePicker';
import { fetchSalesByServiceForBusiness } from '../../../store/reportSlice';
import SearchBar from '../../../ui/SearchBar';
import Colors from '../../../constants/Colors';
import { Row, Table } from "react-native-table-component";
import SortableHeader from '../../../components/ReportScreen/SortableHeader';
import EntryPicker from '../../../components/common/EntryPicker';
import CustomPagination from '../../../components/common/CustomPagination';
import { serviceSalesHeader, serviceSalesHeaderWithSort } from '../../../data/ReportData';
import { formatDateYYYYMMDD } from '../../../util/Helpers';

const ServiceSalesReportScreen = () => {
  const dispatch = useDispatch();

  const [getSortOrderKey, setGetSortOrderKey] = useState("");
  const [toggleSortItem, setToggleSortItem] = useState("name");
  const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
  const [query, setQuery] = useState("")
  const [servicesList, setServicesList] = useState([]);
  const [maxPageCount, setMaxPageCount] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [maxEntry, setMaxEntry] = useState(10);

  const sortName = toggleSortItem !== "" ? toggleSortItem : "name"

  const {
    isCustomRange,
    isLoading,
    dateData,
    selectedValue,
    date,
    selectedFromCustomDate,
    selectedToCustomDate,
    handleSelection,
    handleCustomDateConfirm,
    currentFromDate,
    currentToDate,
    handleCustomDate,
  } = useDateRange({
    onDateChangeDays: (firstDate, SecondDate) => {
      dispatch(fetchSalesByServiceForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
        .then((res) => {
          setMaxPageCount(res.data[0].total_count)
          const transformedData = res.data[0].sales_summary_data.map((item) => [
            item.service,
            item.category,
            item.service_price.toString(),
            item.service_count.toString(),
            "₹ " + item.discounts.toString(),
            "₹ " + item.gross_sales.toString(),
            "₹ " + item.gst.toString(),
            "₹ " + item.total_sales.toString(),
          ]);

          setServicesList(transformedData);
        })
    },
    onDateChangeMonth: (firstDate, SecondDate) => {
      dispatch(fetchSalesByServiceForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
        .then((res) => {

          setMaxPageCount(res.data[0].total_count)
          const transformedData = res.data[0].sales_summary_data.map((item) => [
            item.service,
            item.category,
            item.service_price.toString(),
            item.service_count.toString(),
            "₹ " + item.discounts.toString(),
            "₹ " + item.gross_sales.toString(),
            "₹ " + item.gst.toString(),
            "₹ " + item.total_sales.toString(),
          ]);

          setServicesList(transformedData);
        })
    },
    onFirstCustomRangeSelectes: (firstDate, SecondDate) => {
      dispatch(fetchSalesByServiceForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
        .then((res) => {

          setMaxPageCount(res.data[0].total_count)
          setServicesList(transformedData);
          const transformedData = res.data[0].sales_summary_data.map((item) => [
            item.service,
            item.category,
            item.service_price.toString(),
            item.service_count.toString(),
            "₹ " + item.discounts.toString(),
            "₹ " + item.gross_sales.toString(),
            "₹ " + item.gst.toString(),
            "₹ " + item.total_sales.toString(),
          ]);

          setServicesList(transformedData);
        })
    },
    onFirstOptionCustomChange: (firstDate, SecondDate) => {
      dispatch(fetchSalesByServiceForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
        .then((res) => {

          setMaxPageCount(res.data[0].total_count)
          const transformedData = res.data[0].sales_summary_data.map((item) => [
            item.service,
            item.category,
            item.service_price.toString(),
            item.service_count.toString(),
            "₹ " + item.discounts.toString(),
            "₹ " + item.gross_sales.toString(),
            "₹ " + item.gst.toString(),
            "₹ " + item.total_sales.toString(),
          ]);

          setServicesList(transformedData);
        })
    },
    onSecondOptionCustomChange: (firstDate, SecondDate) => {
      dispatch(fetchSalesByServiceForBusiness(0, 10, firstDate, SecondDate, query, sortName, getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"))
        .then((res) => {

          setMaxPageCount(res.data[0].total_count)
          const transformedData = res.data[0].sales_summary_data.map((item) => [
            item.service,
            item.category,
            item.service_price.toString(),
            item.service_count.toString(),
            "₹ " + item.discounts.toString(),
            "₹ " + item.gross_sales.toString(),
            "₹ " + item.gst.toString(),
            "₹ " + item.total_sales.toString(),
          ]);

          setServicesList(transformedData);
        })
    },
  });

  function onChangeData(res) {
    const transformedData = res.data[0].sales_summary_data.map((item) => [
      item.service,
      item.category,
      item.service_price.toString(),
      item.service_count.toString(),
      "₹ " + item.discounts.toString(),
      "₹ " + item.gross_sales.toString(),
      "₹ " + item.gst.toString(),
      "₹ " + item.total_sales.toString(),
    ]);

    setServicesList(transformedData);
  }

  const calculateColumnWidths = useMemo(() => {
    return serviceSalesHeader.map((header, index) => {
      const headerWidth = header.length * 14;
      const maxDataWidth = servicesList.reduce((maxWidth, row) => {
        const cellContent = row[index] || '';
        return Math.max(maxWidth, cellContent.length * 16);
      }, 0);
      return Math.max(headerWidth, maxDataWidth);
    });
  },[serviceSalesHeader, servicesList]);

  const widthArr = calculateColumnWidths;

  useEffect(() => {
    const fetchData = () => {
      dispatch(fetchSalesByServiceForBusiness(0, 10, formatDateYYYYMMDD(0), formatDateYYYYMMDD(0)))
        .then((res) => {

          setMaxPageCount(res.data[0].total_count)
          const transformedData = res.data[0].sales_summary_data.map((item) => [
            item.service,
            item.category,
            item.service_price.toString(),
            item.service_count.toString(),
            "₹ " + item.discounts.toString(),
            "₹ " + item.gross_sales.toString(),
            "₹ " + item.gst.toString(),
            "₹ " + item.total_sales.toString(),
          ]);

          setServicesList(transformedData);
        })
    }
    fetchData()
  }, [])

  return (
    <ScrollView style={{ backgroundColor: 'white' }} >
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        <Text style={[TextTheme.bodyMedium, { alignSelf: 'center', marginBottom: 20 }]}>Shows complete list of all sales transactions.</Text>
        <DatePicker
          isCustomRange={isCustomRange}
          handleSelection={handleSelection}
          isLoading={isLoading}
          handleCustomDateConfirm={handleCustomDateConfirm}
          handleCustomDate={handleCustomDate}
          dateData={dateData}
          selectedValue={selectedValue}
          date={date}
          selectedToCustomDate={selectedToCustomDate}
          selectedFromCustomDate={selectedFromCustomDate}
        />
      </View>
      <SearchBar
        onChangeText={(text) => {
          setQuery(text)
          dispatch(fetchSalesByServiceForBusiness(0, maxPageCount, currentFromDate, currentToDate, text)).then((res) => {
            const transformedData = res.data[0].sales_summary_data.map((item) => [
              item.service,
              item.category,
              item.service_price.toString(),
              item.service_count.toString(),
              "₹ " + item.discounts.toString(),
              "₹ " + item.gross_sales.toString(),
              "₹ " + item.gst.toString(),
              "₹ " + item.total_sales.toString(),
            ]);

            setServicesList(transformedData);
          });
        }}
        placeholder='Search by service name'
        searchContainerStyle={{ marginBottom: 20,marginHorizontal: 20 }}
        logoAndInputContainer={{ borderWidth: 1, borderColor: Colors.grey250 }}
        value={query}
      />
      {isEntryModalVisible && (
        <EntryPicker
          setIsModalVisible={setIsEntryModalVisible}
          onPress={(number) => {
            setMaxEntry(number);
            setIsEntryModalVisible(false);
          }}
          maxEntry={maxEntry}
          isVisible={isEntryModalVisible}
        />
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Table borderStyle={{ borderColor: '#c8e1ff' }}>
            <Row
              data={
                serviceSalesHeaderWithSort.map((item, index) => (
                  <SortableHeader
                    key={item.key}
                    title={item.title}
                    sortKey={item.sortKey}
                    currentSortKey={toggleSortItem}
                    dispatch={dispatch}
                    pageNo={pageNo}
                    maxEntry={maxEntry}
                    fromDate={currentFromDate}
                    toDate={currentToDate}
                    query={query}
                    onSortChange={setToggleSortItem}
                    onChangeData={onChangeData}
                    setGetSortOrderKey={setGetSortOrderKey}
                    sortOrderKey={getSortOrderKey}
                  />
                ))
              }
              textStyle={{ flex: 1, width: "100%", paddingVertical: 10 }}
              widthArr={servicesList.length > 0 ? widthArr : undefined}
              style={{ borderWidth: 1, borderColor: Colors.grey250, backgroundColor: Colors.grey150 }}
            />
            {servicesList.length > 0 ? (
              servicesList.map((rowData, rowIndex) => (
                <Row
                  key={rowIndex}
                  data={rowData.map((cell, cellIndex) => {
                    return (
                      <Text style={[styles.text, { paddingHorizontal: 10 }]}>
                        {cell}
                      </Text>
                    );
                  })}
                  widthArr={widthArr}
                  style={styles.tableBorder}
                />
              ))
            ) :
              <Text style={[styles.noDataText, styles.tableBorder]}>No Data Found</Text>
            }
          </Table>
        </View>
      </ScrollView>
      {
        maxPageCount > 10 &&
        <CustomPagination
          setIsModalVisible={setIsEntryModalVisible}
          maxEntry={maxEntry}
          incrementPageNumber={() => setPageNo(prev => prev + 1)}
          decrementPageNumber={() => setPageNo(prev => prev - 1)}
          refreshOnChange={async () =>
            dispatch(
              fetchSalesByServiceForBusiness(
                pageNo,
                maxEntry,
                currentFromDate,
                currentToDate,
                query,
                toggleSortItem === "" ? "name" : toggleSortItem,
                getSortOrderKey === 1 ? "desc" : getSortOrderKey === 2 ? "asc" : "desc"
              )
            ).then((res) => {
              onChangeData(res)
            })
          }
          currentCount={servicesList?.length ?? 1}
          totalCount={maxPageCount}
          resetPageNo={() => {
            setPageNo(0);
          }}
          isFetching={false}
          currentPage={pageNo}
        />
      }
    </ScrollView>
  )
}

export default ServiceSalesReportScreen

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
  }
})