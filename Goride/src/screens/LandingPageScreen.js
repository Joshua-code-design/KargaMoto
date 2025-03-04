import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MapView, { Marker } from 'react-native-maps'; // Importing MapView
import FooterBar from '../components/FooterBar';

const LandingPageScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home'); // Default active tab

  const onTabPress = (tab) => {
    if (tab === 'profile') {
      navigation.navigate('Profile');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <View style={styles.container}>
      {/* Google Map for Bacolod City */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.6761, 
          longitude: 122.9568,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 10.6761, longitude: 122.9568 }}
          title={"Bacolod City"}
          description={"This is Bacolod City"}
        />
      </MapView>

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
    bottom: 0, // Full screen height for the map
  },
  footerBar: {
    backgroundColor: 'black',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    borderRadius: 50,
    margin: 20,
    position: 'absolute',
    bottom: 0,
  },
  iconContainer: {
    paddingHorizontal: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  centerLogoContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }], 
    backgroundColor: 'black',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    top: -20,
  },
 
});

export default LandingPageScreen;