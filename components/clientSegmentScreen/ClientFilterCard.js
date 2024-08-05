import {View, Text, StyleSheet, Image, Pressable} from "react-native";
import Colors from "../../constants/Colors";
import {useEffect, useState} from "react";

export default function ClientFilterCard(props) {
    const styles = StyleSheet.create({
        clientCard: {
            borderWidth: 1,
            borderColor: Colors.grey250,
            backgroundColor: props.isPressed ? Colors.highlight : Colors.white,
            width: 162,
            height: 80,
            borderRadius: 6,
            marginHorizontal: 10,
            alignItems: 'center'
        },
        iconContainer: {
            width: 38,
            height: 38,
            borderRadius: 38,
            backgroundColor: props.isPressed ? Colors.white : props.color,
            marginTop: 8,
            justifyContent: "center",
            alignItems: "center"
        },
        innerContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            width: '80%',
        },
        icon: {
            height: 20,
            width: 20,
        },
        totalClientsText: {
            fontWeight: '800',
            color: props.isPressed ? Colors.white : Colors.black,
        },
        filterType: {
            marginLeft: 8,
            marginTop: 8,
            color: props.isPressed ? Colors.white : Colors.black,
        },
    })


    // const imageSource = props.imageSource;



    return (
        <Pressable style={[styles.clientCard]}
           onPress={props.onPress}
        >
            <View style={styles.innerContainer}>
                <View style={styles.iconContainer}>
                    <Image source={props.imgSource} style={[styles.icon, props.iconSize]}/>
                </View>
                <Text style={styles.filterType}>
                    {props.clientFilterName}
                </Text>
            </View>
            <Text style={styles.totalClientsText}>
                {props.totalClients}
            </Text>
        </Pressable>
    );
}

