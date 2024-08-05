import React from 'react';
import {View, StyleSheet} from 'react-native';

const Divider = ({color = 'gray', thickness = 1}) => {
    return (
        <View style={[styles.divider, {backgroundColor: color, height: thickness}]}/>
    );
}

const styles = StyleSheet.create({
    divider: {
        width: '100%',
    },
});

export default Divider;