import { fetchSalesReportByBusiness, updateDateChangeValue, updateSalesReportList } from "../../store/reportSlice";


export const fetchAndUpdateSalesReport = (dispatch,{ page, limit, fromDate, toDate, query, sortName, sortOrder }) => {
    console.log("fetchAndUpdateSalesReport");
    console.log(page, limit, fromDate, toDate, query, sortName, sortOrder );
    
    
    dispatch(fetchSalesReportByBusiness(page, limit, fromDate, toDate, query, sortName, sortOrder))
        .then((res) => {
            const data = res.data[0];
            dispatch(updateSalesReportList({ type: 'update', value: data.sales_report_list }));
            dispatch(updateDateChangeValue({
                type: 'update',
                values: {
                    total_count: data.total_count,
                    totalSalesValue: data.total_revenue,
                    totalNetSalesValue: data.net_revenue,
                },
            }));
        })
        .catch((error) => {
            console.error("Error fetching sales report:", error);
        });
};