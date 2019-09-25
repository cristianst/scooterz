import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const renderMarkerIcon = (brand) => {
    switch (brand) {
        case 'voi':
            return (
                <Image
                    style={{ width: 25, height: 25 }}
                    source={require('../../assets/voi.png')}
                />);
        case 'tier':
            return (
                <Image
                    style={{ width: 25, height: 25 }}
                    source={require('../../assets/tier.png')}
                />);
        case 'circ':
            return (
                <Image
                    style={{ width: 25, height: 25 }}
                    source={require('../../assets/circ.png')}
                />);
        case 'lime':
            return (
                <Image
                    style={{ width: 25, height: 25 }}
                    source={require('../../assets/lime.png')}
                />);
        default: return null;
    }
}
export const ScooterMarker = ({
    scooter,
    brand,
    coordinate,
    onSelectScooter,
    visible
}) => {
    return (
        <Marker
            coordinate={coordinate}
            onPress={() => onSelectScooter({ ...scooter, brand })}
        >
            <View style={{
                display: visible ? 'block' : 'none',
                ...styles.scooterMarker
            }}>
                {renderMarkerIcon(brand)}
            </View>
        </Marker>
    )
};

const styles = StyleSheet.create({
    scooterMarker: {
        borderRadius: 5,
        overflow: 'hidden',
    }
});
