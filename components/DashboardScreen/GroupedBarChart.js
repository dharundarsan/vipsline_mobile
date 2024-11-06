import React from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryGroup } from 'victory-native';
import { View } from 'react-native';

const GroupedBarChart = (props) => {
  const data = [
    { month: 'January', sales: 100, profit: 10 },
    { month: 'February', sales: 80, profit: 8 },
    { month: 'March', sales: 10, profit: 1 },
  ];

  // Separate datasets for sales and profit
  // const formattedData = props.month.map((month, index) => ({
  //   month,
  //   sales: props.revenue[index],  // Use revenue as sales data
  //   profit: props.count[index]     // Use count as profit data for charting purposes
  // }));
  const maxSales = Math.max(...props.revenue);
  const maxProfit = Math.max(...props.count);

  // Normalize data to a range of 0-100
  const normalizedData = props.month.map((month, index) => ({
    month,
    sales: (props.revenue[index] / maxSales) * 100,
    profit: (props.count[index] / maxProfit) * 100
  }));
  // const salesData = formattedData.map(d => ({ month: d.month, y: d.sales }));
  // const profitData = formattedData.map(d => ({ month: d.month, y: d.profit * 10 })); // Scale profit to fit the chart
  return (
    <View>
      <VictoryChart>
        <VictoryGroup offset={20}>
          {/* Sales Bar */}
          <VictoryBar
            data={normalizedData}
            x="month"
            y="sales"
            style={{ data: { fill: '#4A90E2' } }}
          />
          {/* Profit Bar - on its own scale */}
          <VictoryBar
            data={normalizedData}
            x="month"
            y="profit"
            style={{ data: { fill: '#9B9BFF' } }}
          />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
};

export default GroupedBarChart;
