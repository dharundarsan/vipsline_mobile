import React from 'react';
import {View, StyleSheet} from 'react-native';
import Colors from "../constants/Colors";

const Divider = () => {
    return (
        <View style={[styles.divider]}/>
    );
}

const styles = StyleSheet.create({
    divider: {
        // paddingVertical:1,
        borderBottomWidth: 1,
        width: '100%',
        borderBottomColor: Colors.grey500,
    },
});

export default Divider;