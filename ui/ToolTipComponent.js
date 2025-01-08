import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TooltipComponent = ({ index, data }) => {
  // Extract the data for the current index
  const item = data[index];

  return (
    <View style={styles.tooltipContainer}>
      <Text style={styles.tooltipText}>Index: {index}</Text>
      <Text style={styles.tooltipText}>Value: {item.value}</Text>
      {/* You can add more information depending on the structure of your data */}
    </View>
  );
};

const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
  },
});

export default TooltipComponent;
