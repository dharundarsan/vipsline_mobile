import {View, StyleSheet, Text, Pressable, Platform} from "react-native";
import Colors from "../../constants/Colors"
import Divider from "../../ui/Divider";
import textTheme from "../../constants/TextTheme";
import * as Haptics from "expo-haptics";
import {checkNullUndefined} from "../../util/Helpers";


/**
 * ClientCard Component
 *
 * Displays a card with client information, including a profile avatar (initial), name, phone number,
 * and email address. The card is pressable and can trigger an action when pressed. Optionally, a divider
 * can be added below the card. The component is highly customizable through props.
 *
 * Props:
 * @param {string} [props.name] - The client's name. Displays the first letter as an avatar if provided.
 * @param {string} [props.phone] - The client's phone number.
 * @param {string} [props.email] - The client's email address.
 * @param {object} [props.card] - Additional styles for the card.
 * @param {object} [props.cardInnerContainer] - Additional styles for the inner container.
 * @param {object} [props.clientProfile] - Additional styles for the profile container.
 * @param {object} [props.clientDetailsContainer] - Additional styles for the details container.
 * @param {object} [props.avatarText] - Additional styles for the avatar text.
 * @param {object} [props.nameText] - Additional styles for the name text.
 * @param {object} [props.phoneText] - Additional styles for the phone number text.
 * @param {object} [props.emailText] - Additional styles for the email text.
 * @param {string} [props.rippleColor] - The color of the ripple effect when the card is pressed.
 * @param {Function} props.onPress - Function to call when the card is pressed. Receives the clientId as a parameter.
 * @param {boolean} [props.divider] - Whether to show a divider below the card.
 * @param {string} props.clientId - The unique identifier for the client.
 *
 * @component
 * @example
 * return (
 *   <ClientCard
 *     name="John Doe"
 *     phone="123-456-7890"
 *     email="john.doe@example.com"
 *     onPress={(id) => console.log("Client ID:", id)}
 *     clientId="1"
 *   />
 * );
 *
 * @returns {JSX.Element} The rendered client card component.
 */

const radius = 38;

export default function ClientCard(props) {
    const name = props.name;

    const styles = StyleSheet.create({
        card: {
            width: '100%',
            paddingVertical: 20,
            paddingHorizontal: 10,
            justifyContent: 'center',
        },
        clientProfile: {
            borderRadius: radius,
            width: radius,
            height: radius,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.lightGreen
        },
        text: {
            fontWeight: '600',
            color: Colors.highlight
        },
        innerContainer: {
            marginLeft: 16,
            flexDirection: 'row',
            alignItems: "center",
        },
        clientDetailsContainer: {
            marginLeft: 16,
            flexDirection: 'column',
        },
        name: {
            width:"80%",
        },
        phone: {
            color: Colors.grey650
        },
        email: {
            width:"80%",
            color: Colors.grey650,
        },
        opacity: {
            opacity: Platform.OS === 'ios' ? 0.5 : 1,
        }
    })


    return (<>
            <Pressable
                style={({pressed}) => pressed ? [styles.card, props.card, styles.opacity] : [styles.card, props.card]}
                android_ripple={{color: props.rippleColor ? props.rippleColor : Colors.ripple}}
                onPress={() => {
                    // Haptics.selectionAsync()
                    props.onPress(props.clientId)
                }}
            >
                <View style={[styles.innerContainer, props.cardInnerContainer]}>
                    <View style={[styles.clientProfile, props.clientProfile]}>
                        <Text
                            style={[styles.text, props.avatarText]}>
                            {checkNullUndefined(props.name) ? props.name.at(0).toUpperCase() : "Z"}
                        </Text>
                    </View>

                    <View style={[styles.clientDetailsContainer, props.clientDetailsContainer]}>
                        {
                            checkNullUndefined(props.name) ? <Text style={[textTheme.titleSmall, props.nameText]} ellipsizeMode="tail"
                            numberOfLines={1}>{props.name}</Text> : <Text>hello</Text>
                        }
                        {
                            checkNullUndefined(props.phone) ?
                                <Text style={[textTheme.bodyMedium, styles.phone, props.phoneText]}>{props.phone}</Text> : null
                        }
                        {
                            props.email !== undefined && props.email !== null && props.email.trim().length !== 0 ?
                                <Text style={[textTheme.bodyMedium, styles.email]} ellipsizeMode="tail"
                                numberOfLines={1}>{props.email.trim()}</Text> : null
                        }
                    </View>
                </View>
            </Pressable>
            {
                props.divider ?
                    <Divider /> :
                    null
            }

        </>
    );
}

