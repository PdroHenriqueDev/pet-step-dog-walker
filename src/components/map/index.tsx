import React, {useEffect, useRef, useState} from 'react';
import {View, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Region} from 'react-native-maps';
import styles from './styles';
import {PlataformEnum} from '../../enum/platform.enum';
import {request, PERMISSIONS} from 'react-native-permissions';
import GetLocation from 'react-native-get-location';
import {io} from 'socket.io-client';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import BackgroundTimer from 'react-native-background-timer';

const socket = io('http://192.168.0.13:3000', {
  query: {user_id: '1'},
});

function Map(): React.JSX.Element {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>({
    latitude: -10.1861,
    longitude: -48.31886,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  useEffect(() => {
    socket.on('connection', () => {});
    requestLocationPermission();
    getLocationAndUpdateRegion();
  }, []);

  const requestLocationPermission = async () => {
    const requestResponse = await request(
      Platform.OS === PlataformEnum.IOS
        ? PERMISSIONS.IOS.LOCATION_ALWAYS
        : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    );

    if (requestResponse === 'granted') {
      await getLocationAndUpdateRegion();
      startForegroundService();
      startBackgroundTimer();
    }
  };

  const getLocationAndUpdateRegion = async () => {
    if (isRequestingLocation) {
      return;
    }

    setIsRequestingLocation(true);
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      const {latitude, longitude} = location;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      };
      setRegion(newRegion);
    } catch (error) {
      console.warn(error);
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const sendLocationToServer = async () => {
    if (isRequestingLocation) {
      return;
    }

    setIsRequestingLocation(true);
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 7000,
      });

      const {latitude, longitude} = location;

      socket.emit('location', {latitude, longitude});

      mapRef.current?.animateCamera({
        center: {
          latitude,
          longitude,
        },
      });
    } catch (error) {
      console.warn(error);
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const startForegroundService = () => {
    ReactNativeForegroundService.add_task(
      async () => await sendLocationToServer(),
      {
        delay: 8000,
        onLoop: true,
        taskId: 'location_task',
      },
    );

    ReactNativeForegroundService.start({
      id: 1244,
      title: 'Map',
      message: 'Updating location',
      icon: 'ic_launcher',
      button: false,
      color: '#000000',
    });
  };

  const startBackgroundTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      startForegroundService();
    }, 8000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
      />
    </View>
  );
}

export default Map;
