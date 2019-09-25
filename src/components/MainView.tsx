import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { ProvidersFactory } from '../providers/Provider';

import { Scooters } from './Scooters';
import { getDistanceBetweenCoordinates } from './helpers';
import { ScooterOverview } from './ScooterOverview';

interface MainViewProps {
  location: {
    longitude: number,
    latitude: number
  }
};

function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
export const MainView = (props: MainViewProps) => {
  console.log('Main');
  const { longitude, latitude } = props.location;
  const mapRef = useRef(null);

  const [providers, setProviders] = useState([]);
  const [visibleProviders, setVisibleProviders] = useState(['voi', 'tier', 'circ', 'lime']);

  const [selectedScooter, setSelectedScooter] = useState({});
  const [scooterIsSelected, setScooterIsSelected] = useState(false);

  const latitudeDelta = 0.0035;
  const longitudeDelta = 0.0040;

  const getBoundingBox = () => ([
    longitude - longitudeDelta / 2, // westLng - min lng
    latitude - latitudeDelta / 2, // southLat - min lat
    longitude + longitudeDelta / 2, // eastLng - max lng
    latitude + latitudeDelta / 2 // northLat - max lat
  ]);

  const fetchScooters = (long: number = longitude, lat: number = latitude) => {
    console.log('fetch scooters');
    const boundaries = getBoundingBox();
    ProvidersFactory.getAll(long, lat, boundaries)
      .then(result => {
        console.log('got new scooters');
        console.log({ result });
        const providers = result.reduce((acc, current) => {
          acc.push(current);
          return acc;
        }, []);

        setProviders(providers);

      })
      .catch(err => {
        console.log({ err })
      })
  };

  useEffect(() => {
    console.log('useffect');
    fetchScooters();
  }, []);

  useInterval(async () => {
    console.log('------------')
    console.log('tick');


    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation
    });

    // const distance = getDistanceBetweenCoordinates(latitude, longitude, location.coords.latitude, location.coords.longitude);

    //fetchScooters(location.coords.longitude, location.coords.latitude);
    // console.log({ distance });

  }, 10000);

  //if (!providers) return null;
  if (providers.length === 0) return null;

  const handleScooterSelect = (scooter) => {
    const distance = getDistanceBetweenCoordinates(latitude, longitude, scooter.lat, scooter.lng);

    const selectedScooter = {
      ...scooter,
      distance
    }

    setSelectedScooter(selectedScooter);
    setScooterIsSelected(true);
  }

  const handleCloseOverview = () => {
    setScooterIsSelected(false);
  }

  return (
    <MapView
      ref={mapRef}
      style={styles.mapView}
      showsTraffic={false}
      showsPointsOfInterest={false}
      showsUserLocation={true}
      showsMyLocationButton={true}
      showsBuildings={false}
      showsCompass={false}
      loadingEnabled={true}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.0035,
        longitudeDelta: 0.0040,
      }}
    >
      {providers.map(provider => {

        return (
          <Scooters
            key={provider.provider}
            provider={provider}
            visible={visibleProviders.includes(provider.provider)}
            handleScooterSelect={handleScooterSelect}
          />
        )
      })}

      <ScooterOverview
        isVisible={scooterIsSelected}
        scooter={selectedScooter}
        onBackdropPress={handleCloseOverview}
      />
    </MapView>
  )
}

const styles = StyleSheet.create({
  mapView: {
    flex: 1
  }
})