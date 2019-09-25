import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import { MainView } from './src/components/MainView';


interface AppState {
  errorMessage: string,
  location: object,
  loading: boolean
};

export default class App extends React.Component<{}, AppState> {
  state = {
    errorMessage: '',
    location: {},
    loading: true
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.getLocationAsync();
    }
  }

  async getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied.',
      });
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation
    });

    const { latitude, longitude } = location.coords;

    this.setState({
      location: {
        latitude,
        longitude
      },
      loading: false
    });
  }

  render() {
    console.log('entry');
    const { loading, location } = this.state;
    if (loading) return null;
    return (
      <MainView location={location} />
    )
  }
}
