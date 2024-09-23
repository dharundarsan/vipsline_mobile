import {View, Text, StyleSheet, Image, Pressable, Platform} from "react-native";
import Colors from "../../constants/Colors";
import {useEffect, useState} from "react";
import textTheme from "../../constants/TextTheme";

/**
 * ClientFilterCard Component
 *
 * This component represents a filter card for clients, typically used in a list or grid format.
 * The card displays an icon, filter type name, and the total number of clients under that filter.
 * The card's appearance changes when it is pressed, indicating it is selected.
 *
 * @param {Object} props - The properties passed to this component.
 * @param {string} props.clientFilterName - The name of the filter displayed on the card.
 * @param {string | number} props.totalClients - The number of clients associated with the filter.
 * @param {function} props.onPress - Function to handle press events on the card.
 * @param {boolean} props.isPressed - Boolean to determine if the card is selected/pressed.
 * @param {string} props.color - The background color of the icon when the card is not pressed.
 * @param {Object} props.imgSource - The source of the icon image to be displayed on the card.
 * @param {Object} [props.iconSize] - (Optional) Custom styles for the icon size, default is 20x20.
 *
 * @returns {JSX.Element} The rendered card component.
 */



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
            color: props.isPressed ? Colors.white : Colors.black,
        },
        filterType: {
            marginLeft: 8,
            marginTop: 8,
            color: props.isPressed ? Colors.white : Colors.black,
        },
        opacity:{
            opacity:Platform.OS === 'ios' ? 0.5 : 1,
        }
    })


    // const imageSource = props.imageSource;



    return (
        <Pressable style={({pressed}) => pressed ? [styles.clientCard,styles.opacity] : styles.clientCard}
           onPress={props.onPress} android_ripple={{color:Colors.grey200}}
        >
            <View style={styles.innerContainer}>
                <View style={styles.iconContainer}>
                    <Image source={props.imgSource} style={[styles.icon, props.iconSize]}/>
                </View>
                <Text style={[textTheme.bodyMedium, styles.filterType]}>
                    {props.clientFilterName}
                </Text>
            </View>
            <Text style={[textTheme.titleSmall, styles.totalClientsText]}>
                {props.totalClients}
            </Text>
        </Pressable>
    );
}

