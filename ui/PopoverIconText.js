import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextTheme from '../constants/TextTheme'
import Popover from "react-native-popover-view";
import { checkNullUndefined } from '../util/Helpers';
const PopoverIconText = ({ popoverText, title, titleStyle, popoverOffset, popoverArrowShift = 0.83,containerStyle }) => {
    return (
        <Popover popoverStyle={styles.popoverStyle}
            from={<Pressable style={[styles.checkoutDetailInnerContainer, checkNullUndefined(title) ? { flexWrap: 'wrap',flexDirection:'row' } : null,
                containerStyle
            ]}>
                {
                    checkNullUndefined(title) ? <Text style={[titleStyle]}>{title}</Text> : null
                }
                <MaterialCommunityIcons name="information-outline" size={13} color="black" style={{ marginLeft: 5 }} />
            </Pressable>}
            offset={popoverOffset}
            arrowShift={popoverArrowShift}
        >
            <View>
                <Text style={[TextTheme.bodyMedium, styles.checkoutDetailText]}>
                    {popoverText ?? ""}
                </Text>
            </View>
        </Popover>
    )
}

export default PopoverIconText

const styles = StyleSheet.create({
    popoverStyle: {
        padding: 12
    },
    checkoutDetailInnerContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: "#101928",
        opacity: 0.6,
        fontSize: 13,
        textAlign: "center"
    },
})