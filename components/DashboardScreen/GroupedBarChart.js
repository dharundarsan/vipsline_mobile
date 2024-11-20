import React from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryGroup } from 'victory-native';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const GroupedBarChart = (props) => {

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
  function roundUpToNearestPowerOfTen(value) {
    const power = Math.pow(10, Math.floor(Math.log10(value)));
    return Math.ceil(value / power) * power;
  }

  function roundUp(value) {
    return value <= 10 ? value : roundUpToNearestPowerOfTen(value);
  }

  function removeZero(roundedValue) {
    return roundedValue.toString().replace(/0+$/, '');
  }

  const countPass = props.count.map((value) => ({ value }));
  const maxCount = Math.max(...props.count);
  const countSections = parseInt(removeZero(roundUp(maxCount)))
  const maxRevenue = Math.max(...props.revenue)
  const revenuePass = props.revenue.map((value) => ({ value }));
  const revenueSections = parseInt(removeZero(roundUp(maxRevenue)))

  return (
    <View >
      <LineChart data={revenuePass} 
        maxValue={roundUp(maxRevenue)} 
        secondaryData={countPass} 
        noOfSections={revenueSections || 10}
        secondaryYAxis={{ maxValue: roundUp(maxCount) || 10,noOfSections:countSections || 10 }} 
        width={250}
        yAxisTextNumberOfLines={100}
        yAxisLabelWidth={50}
        yAxisTextStyle={{fontSize:10}}
        // rulesColor={"#9B9BFF"}
        // yAxisColor={"#9B9BFF"}
        color='#9B9BFF'
        dataPointsColor1='#5959b5'
        // yAxisIndicesColor={"#9B9BFF"}
        secondaryLineConfig={{color:"#4A90E2",dataPointsColor:"#0060d1"}}
        adjustToWidth
      />
    </View>
  );
};

export default GroupedBarChart;
