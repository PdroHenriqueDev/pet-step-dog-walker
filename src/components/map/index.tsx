import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import  styles  from './styles';
import { Marker } from 'react-native-maps';
import { PlataformEnum } from '../../enum/platform.enum';
import { request, PERMISSIONS } from 'react-native-permissions';
import GetLocation from 'react-native-get-location'


function Map(): React.JSX.Element {
  const [region, setRegion] = useState<Region>({
    latitude: -10.1861,
    longitude: -48.31886,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [markerRegion, setMarkerRegion] = useState<Region>({
    latitude: -10.1861,
    longitude: -48.31886,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const requestLocationPermission = async () => {
    const requestResponse = await request(
      Platform.OS === PlataformEnum.IOS
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

    if (requestResponse === 'granted') {
      await getLocationAndUpdateRegion();

      const intervalId = setInterval(async () => {
        await updateMarkerRegion();
      }, 8000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }

  const getLocationAndUpdateRegion = async () => {
    await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 4000,
    })
    .then(location => {
      const { latitude, longitude } = location;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      }
      setRegion(newRegion);      
    })
    .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
    })
  };

  const updateMarkerRegion = async () => { 
    await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 4000,
    })
    .then(location => {
      const { latitude, longitude } = location;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      }
      setMarkerRegion(newRegion);      
    })
    .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
    })
  }

  useEffect(() => {
    requestLocationPermission();   
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
      >
        <Marker
          coordinate={{ latitude: markerRegion.latitude, longitude: markerRegion.longitude }} />
      </MapView>
    </View>
  );
}

export default Map;
