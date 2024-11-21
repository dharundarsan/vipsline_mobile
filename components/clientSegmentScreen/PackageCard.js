import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import Colors from "../../constants/Colors";
import textTheme from "../../constants/TextTheme";
import {convertDate} from "../../util/Helpers";
import PrimaryButton from "../../ui/PrimaryButton";
import {useState} from "react";
import PackageDetailModal from "./PackageDetailModal";
import {useDispatch} from "react-redux";
import {packageHistoryDetails} from "../../store/clientInfoSlice";


export function PackageCard(props) {

    const styles = StyleSheet.create({
        membershipCard: {
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
        },
        buttonStyle: {
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor:Colors.grey250,

        },
        pressableStyle: {
            paddingVertical: 0,
            paddingHorizontal: 0
        }
    })

    function statusBorderColorMapper() {
        if(props.status === "Active") {
            return Colors.green
        }
        else if(props.status === "Cancelled") {
            return Colors.error
        }
        else if(props.status === "Redeemed") {
            return Colors.grey700
        }
        else {
            return Colors.error
        }

    }

    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();


    return <PrimaryButton
        buttonStyle={styles.buttonStyle}
        pressableStyle={styles.pressableStyle}
        onPress={() => {
            setIsVisible(true);
            dispatch(packageHistoryDetails(props.packageId))
        }}>
        {
            isVisible &&
            <PackageDetailModal
                visible={isVisible}
                closeModal={() => setIsVisible(false)}
            />
        }
    <View style={styles.membershipCard}>
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
            Length of Package: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{props.length} days</Text>
        </Text>
        <View style={{flexDirection: 'row', columnGap: 16}}>
            <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
                Start date: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{convertDate(props.startDate)}</Text>
            </Text>

            <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
                Expiry date: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{convertDate(props.expiryDate)}</Text>
            </Text>
        </View>

        <View style={{flexDirection: 'row', columnGap: 16}}>
            <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
                Total sessions: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{props.totalSessions}</Text>
            </Text>

            <Text style={[textTheme.bodySmall, {color: Colors.grey500}]}>
                Available sessions: <Text style={[textTheme.bodySmall, {color: Colors.black}]}>{props.availableSessions}</Text>
            </Text>

        </View>


    </View>
    </PrimaryButton>
}

