import { pieChartColorCode } from "../../data/DashboardSelection";

export const processPieChartData = (dataArray, pageType) => {
  if (!dataArray || dataArray.length === 0) {
    return [
      {
        page: pageType,
        value: 0,
        text: "0%",
        color: "#E0E0E0",
      },
    ];
  }

  return dataArray.map((item, index) => {
    return {
      page: pageType,
      value: item.revenue || 0,
      text: item.percent <= 3.0 ? "" : item.percent.toFixed(1) + "%",
      color: pieChartColorCode[index % pieChartColorCode.length].color,
    };
  });
};

export const calculateTotalValue = (chartData) => {
  if (!chartData || chartData.length === 0) return 0;
  return chartData.reduce((sum, item) => sum + item, 0);
};

// Example usage for products and services
// export const toggleProductData = processPieChartData(
//   topProductDetails[0].services_list,
//   "salesProduct"
// );
// export const productsTotalValue = calculateTotalValue(
//   topProductDetails[0].chart_series
// );

// export const toggleServiceData = processPieChartData(
//   topRevenueDetails[0].services_list,
//   "salesPercent"
// );

// export const servicesTotalValue = calculateTotalValue(
//   topRevenueDetails[0].chart_series
// );
