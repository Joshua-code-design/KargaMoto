import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const FooterBar = ({ onTabPress, activeTab }) => {
  return (
    <View style={styles.footerBar}>
      {/* Home Icon (left) */}
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={() => onTabPress('home')}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M12 2.1L1 12h3v9h7v-6h2v6h7v-9h3L12 2.1z"
            fill={activeTab === 'home' ? "#ff69b4" : "white"}
          />
        </Svg>
      </TouchableOpacity> 
      
      {/* Center Logo (Rider icon) */}
      <TouchableOpacity 
        style={styles.centerLogoContainer}
        onPress={() => onTabPress('rides')}
      >
        <Svg width={30} height={40} viewBox="0 0 24 24">
          {/* Bicycle/Rider Icon */}
          <Path
            d="M5,20.5A3.5,3.5 0 0,1 1.5,17A3.5,3.5 0 0,1 5,13.5A3.5,3.5 0 0,1 8.5,17A3.5,3.5 0 0,1 5,20.5M5,12A5,5 0 0,0 0,17A5,5 0 0,0 5,22A5,5 0 0,0 10,17A5,5 0 0,0 5,12M14.8,10H19V8.2H15.8L13.8,4.8C13.3,4.3 12.6,4 12,4C11.4,4 10.8,4.3 10.4,4.8L8.8,7.2H11.3L12.3,5.7C12.5,5.4 13,5.4 13.2,5.7L14.8,10M19,20.5A3.5,3.5 0 0,1 15.5,17A3.5,3.5 0 0,1 19,13.5A3.5,3.5 0 0,1 22.5,17A3.5,3.5 0 0,1 19,20.5M19,12A5,5 0 0,0 14,17A5,5 0 0,0 19,22A5,5 0 0,0 24,17A5,5 0 0,0 19,12M16,4.8C15,4.8 14.2,4 14.2,3C14.2,2 15,1.2 16,1.2C17,1.2 17.8,2 17.8,3C17.8,4 17,4.8 16,4.8Z"
            fill={activeTab === 'rides' ? "#ff69b4" : "white"}
          />
        </Svg>
      </TouchableOpacity>
      
      {/* Profile Icon (right) */}
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => onTabPress('profile')}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
            fill={activeTab === 'profile' ? "#ff69b4" : "white"}
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default FooterBar; 