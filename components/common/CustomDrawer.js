import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import Colors from '../../constants/Colors';

const CustomDrawer = (props) => {
    return (
        <ScrollView>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
});

export default CustomDrawer;
