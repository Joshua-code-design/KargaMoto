import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import FooterBar from '../components/FooterBar';
import * as Location from 'expo-location';

const LandingPageScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState('');

  const onTabPress = (tab) => {
    if (tab === 'profile') {
      navigation.navigate('ProfilesettingScreen');
    } else {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    let locationSubscription;

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Location Permission', 'Permission to access location was denied.');
          setLoading(false);
          return;
        }

        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 1,
          },
          (newLocation) => {
            setLocation(newLocation.coords);
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Unable to fetch location. Please try again.');
        setLoading(false);
      }
    };

    getLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });

    try {
      let reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode.length > 0) {
        const { street, city, region, country } = reverseGeocode[0];
        const formattedAddress = [street, city, region, country].filter(Boolean).join(', ');
        setAddress(formattedAddress);
        Alert.alert('Location Selected', `Address: ${formattedAddress}`);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      Alert.alert('Error', 'Unable to fetch address.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      ) : (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={{
            latitude: location ? location.latitude : 10.640739,
            longitude: location ? location.longitude : 122.968956,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} title="Selected Location" description={address} />
          )}
        </MapView>
      )}

      <FooterBar onTabPress={onTabPress} activeTab={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LandingPageScreen;
