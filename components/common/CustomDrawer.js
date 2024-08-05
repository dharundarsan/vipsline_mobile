import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import Colors from '../../constants/Colors';

const CustomDrawer = (props) => {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        backgroundColor: Colors.darkBlue,
        flex: 1,
    },
});

export default CustomDrawer;
