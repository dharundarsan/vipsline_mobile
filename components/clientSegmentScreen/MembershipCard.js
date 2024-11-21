import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";


export function MembershipCard(props) {

    const styles = StyleSheet.create({
        membershipCard: {
            borderWidth: 1,
            borderColor:Colors.grey250,
            width: '100%',
            padding: 12,
            borderRadius: 8,
            rowGap: 16
        },
        status: {
            borderWidth: 1,
            alignSelf: 'flex-start',
            borderRadius: 8,
            padding: 4,
            borderColor: statusBorderColorMapper()
        },
        membershipAvatar: {
            width: 40,
            height: 40
        },
        innerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 16
        }
    })

    function statusBorderColorMapper() {
        if(props.status === "Active") {
            return Colors.green
        }
        else if(props.status === "Cancelled") {
            return Colors.error
        }
        else if(props.status === "NOT STARTED") {
            return Colors.grey700
        }
        else {
            return Colors.error
        }

    }


    return <View style={styles.membershipCard}>
        <View style={[styles.status]}>
            <Text style={[textTheme.bodySmall, {color: statusBorderColorMapper()}]}>{props.status}</Text>

        </View>
        <View style={styles.innerContainer}>
            <Image
                source={props.imagePath} style={[styles.membershipAvatar, {width: props.size, height: props.size}]}
            />
            <Text style={[textTheme.titleSmall]}>{props.name}</Text>
        </View>
        <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
            Length of Membership: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{props.length} days</Text>
        </Text>
        <View style={{flexDirection: 'row', columnGap: 16}}>
            <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
                Start date: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{props.startDate}</Text>
            </Text>

            <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
                Expiry date: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{props.expiryDate}</Text>
            </Text>
        </View>

        <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
            Valid for: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{props.isAllServices ? "All Services" : props.serviceCount}</Text>
        </Text>

    </View>
}

