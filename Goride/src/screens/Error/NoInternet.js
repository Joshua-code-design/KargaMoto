import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';

export default function NoInternetScreen() {
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    console.log('NoInternetScreen mounted!');
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png',
        }}
        style={[styles.image, { width: width * 0.5, height: height * 0.25 }]}
        resizeMode="contain"
      />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your connection and try again.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
