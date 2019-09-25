import React from 'react';

import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';

import Modal from 'react-native-modal';
import { FontAwesome5 } from '@expo/vector-icons';

import { PROVIDERS } from '../providers/constants.js';
interface ScooterOverviewProps {
    isVisible: boolean,
    scooter: object,
    onBackdropPress: Function
}
export const ScooterOverview = (props: ScooterOverviewProps) => {
    const { isVisible, scooter, onBackdropPress } = props;

    const getAppURL = () => {
        const brand = scooter.brand.toUpperCase();
        return PROVIDERS[brand].appURL;
    };

    const getAppColor = () => {
        if (scooter.brand) {
            const brand = scooter.brand.toUpperCase();
            return PROVIDERS[brand].color;
        }
    }

    const distanceInMeters = scooter.distance;
    const walkingTimeInMinutes = Math.ceil(distanceInMeters / 100);

    return (
        <View>
            <Modal
                isVisible={isVisible}
                onBackdropPress={onBackdropPress}
                style={{ justifyContent: 'flex-end', margin: 0, height: 300 }}
                backdropTransitionOutTiming={0}
            >
                <View style={styles.bottomNavigationView}>
                    <View style={styles.bottomContent}>

                        <View style={styles.header}>
                            <View>
                                <Text>Scooter Code: {scooter.short || scooter.code} - <Text style={styles.companyName}>{scooter.brand}</Text></Text>
                            </View>
                        </View>

                        <View style={styles.scooterInfo}>
                            <View style={styles.scooterDetail}>
                                <FontAwesome5 name="battery-quarter" size={20} color="black" />
                                <Text style={styles.scooterDetailText}>{`${scooter.battery || scooter.batteryLevel}%`}</Text>
                            </View>
                            <View style={styles.scooterDetail}>
                                <FontAwesome5 name="walking" size={20} color="black" />
                                <Text style={styles.scooterDetailText}>{`${distanceInMeters} meters ~ ${walkingTimeInMinutes} ${walkingTimeInMinutes > 1 ? 'minutes.' : 'minute.'}`}</Text>
                            </View>
                        </View>

                        <View style={styles.actionables}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: getAppColor(),
                                    ...styles.linkToApp
                                }}
                                onPress={() => {
                                    const appURL = getAppURL();
                                    Linking.openURL(appURL);
                                }}
                            >
                                <Text style={styles.linkToAppText}>Open {scooter.brand}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNavigationView: {
        borderTopEndRadius: 15,
        borderTopStartRadius: 15,
        backgroundColor: '#fff',
        width: '100%',
        padding: 20,
        height: 300,
    },

    bottomContent: {
        flex: 1,
        fontSize: 18,
    },
    header: {
        alignSelf: 'flex-end'
    },
    companyName: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    content: {
        flex: 2,
        marginVertical: 10,
    },
    actionables: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkToApp: {
        //borderWidth: 1,
        padding: 15,
        borderRadius: 5,
    },
    linkToAppText: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'white'
    },
    scooterInfo: {
        borderColor: 'blue',
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row'
    },
    scooterDetail: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    scooterDetailText: {
        fontSize: 16,
        marginLeft: 15
    }
});