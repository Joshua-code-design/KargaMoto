import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import FooterBar from '../components/FooterBar';

const LandingPageScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');

  const onTabPress = (tab) => {
    if (tab === 'profile') {
      navigation.navigate('ProfilesettingScreen');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the Dashboard</Text>
      <Text style={styles.info}>User: John Doe</Text>
      <Text style={styles.info}>Email: johndoe@example.com</Text>
      <Button title="Go to Profile" onPress={() => navigation.navigate('ProfilesettingScreen')} />
      <FooterBar onTabPress={onTabPress} activeTab={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LandingPageScreen;
