import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import  styles  from './styles';
import { Marker } from 'react-native-maps';


const region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
}
   
function Map(): React.JSX.Element {
   

  return (
    <View style={styles.container}>
        <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={region}
        >
            <Marker
                coordinate={{latitude: region.latitude, longitude: region.longitude}}
                
            />
        </MapView>
    </View>
  );
}

export default Map;
