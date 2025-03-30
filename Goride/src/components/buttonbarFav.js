import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// You might want to import the styles from your existing styles file
import styles from '../styles/landingpage';

// Color palette (consider moving this to a separate constants file)
const COLORS = {
  primary: '#1A2B4D',       // Deep Navy Blue
  tertiary: '#26A69A',      // Soft Teal
  white: '#FFFFFF',         // White
};

export default function BottomNavigation({ isTablet }) {
  const navigation = useNavigation();

  // Navigation with transition
  const navigateTo = (screen, params = {}) => {
    navigation.navigate(screen, params);
  };

  // Navigation items configuration
  const navItems = [
    { name: 'home', label: 'Home', screen: 'LandingPageScreen', active: false },
    { name: 'heart-outline', label: 'Favorites', screen: 'FavScreen', active: true },
    { name: 'person-outline', label: 'Profile', screen: 'ProfileScreen', active: false },
  ];

  return (
    <View 
      style={[
        styles.bottomNav,
        {
          backgroundColor: COLORS.white,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        }
      ]}
    >
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => navigateTo(item.screen)}
          activeOpacity={0.7}
        >
          {item.active && (
            <View 
              style={[
                styles.activeIndicator, 
                { backgroundColor: COLORS.tertiary }
              ]} 
            />
          )}
          <Ionicons
            name={item.name}
            size={isTablet ? 24 : 22}
            color={item.active ? COLORS.tertiary : COLORS.primary}
          />
          <Text
            style={[
              styles.navText,
              { 
                fontSize: isTablet ? 14 : 12, 
                color: item.active ? COLORS.tertiary : COLORS.primary,
                fontWeight: item.active ? '600' : '400'
              }
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}