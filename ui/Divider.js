import React from 'react';
import {View, StyleSheet} from 'react-native';
import Colors from "../constants/Colors";

const Divider = ({color = Colors.grey400, thickness = 1}) => {
    return (
        <View style={[styles.divider, {backgroundColor: color, height: thickness}]}/>
    );
}

const styles = StyleSheet.create({
    divider: {
        paddingVertical:1,
        width: '100%',
    },
});

export default Divider;