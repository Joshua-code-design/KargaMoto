import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styles from '../styles/footer.js'; 



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
            fill={activeTab === 'home' ? "gray" : "black"}
          />
        </Svg>
      </TouchableOpacity> 
      
      {/* Center Logo (Rider icon) */}
<TouchableOpacity
  style={styles.centerLogoContainer}
  onPress={() => onTabPress('rides')}
>
  <Image
    source={  
      activeTab === 'rides' 
        ? require('../../assets/services.png') 
        : require('../../assets/services.png')
    }
    style={{ width: 100, height: 39, }}
    resizeMode="contain"
  />
</TouchableOpacity>
      
      {/* Profile Icon (right) */}
      <TouchableOpacity 
        style={styles.iconContainer}
        onPress={() => onTabPress('profile')}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
            fill={activeTab === 'profile' ? "gray" : "black"}
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

export default FooterBar; 