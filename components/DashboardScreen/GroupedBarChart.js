import React from 'react';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryGroup } from 'victory-native';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const GroupedBarChart = (props) => {
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

  const countPass = props.count.map((value) => ({ value : value,dataPointText: value.toString() }));
  const maxCount = Math.max(...props.count);
  const countSections = parseInt(removeZero(roundUp(maxCount)))
  const maxRevenue = Math.max(...props.revenue)
  const revenuePass = props.revenue.map((value) => ({ value: value,dataPointText:value.toString() }));
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
        // adjustToWidth
        focusEnabled
        showTextOnFocus
        delayBeforeUnFocus={3000}
        focusedDataPointHeight={20}
      />
    </View>
  );
};

export default GroupedBarChart;
