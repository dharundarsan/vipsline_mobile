import React, { createContext, useContext, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
    PanResponder,
    Dimensions,
    Easing,
} from 'react-native';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({ visible: false, content: null });

    const screenHeight = Dimensions.get('window').height;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;

    const showModal = (content) => {
        setModal({ visible: true, content });

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic), // Smoother easing
            }),
        ]).start();
    };

    const hideModal = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.out(Easing.cubic), // Smoother easing
            }),
        ]).start(() => {
            setModal({ visible: false, content: null });
        });
    };

    // Swipe-to-close gesture
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0, // Only respond to downward swipes
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    // Apply a damping effect as the modal approaches the threshold (200 pixels)
                    const threshold = 200;
                    const dragDistance = gestureState.dy;
                    const dampingFactor = Math.max(0, 1 - dragDistance / threshold); // Damping factor (0 to 1)
                    const offset = dragDistance * dampingFactor; // Apply damping to the offset

                    console.log(dragDistance)
                    console.log(dampingFactor)
                    console.log(offset)
                    // Ensure the modal only moves downward
                    slideAnim.setValue(Math.min(offset, threshold)); // Cap the offset at the threshold
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 200 || gestureState.vy > 0.5) {
                    // If pulled far enough (200 pixels) or swiped quickly, close the modal
                    hideModal();
                } else {
                    // Otherwise, snap back to the original position
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 10, // Add a slight bounce effect
                    }).start();
                }
            },
        })
    ).current;

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modal.visible && (
                <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                    <Animated.View
                        style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}
                        {...panResponder.panHandlers} // Enable swipe-to-close gesture
                    >
                        <View style={styles.dragIndicator} />
                        {modal.content}
                        <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
        height: '95%', // Full height but leaves some space at the top
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    dragIndicator: {
        width: 50,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
});