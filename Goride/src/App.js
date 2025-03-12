import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen1 from './screens/OnboardingScreen1';
import OnboardingScreen2 from './screens/OnboardingScreen2';
import OnboardingScreen3 from './screens/OnboardingScreen3';
import LoginScreen from './screens/LoginScreen';
import OtpScreen from './screens/OtpScreen';
import RegisterScreen from './screens/RegisterScreen';
import LandingPageScreen from './screens/LandingPageScreen';
import ProfilesettingScreen from './screens/ProfilesettingScreen';
import ProfileScreen from './screens/ProfileScreen';
import HistoryScreen from './screens/HistoryScreen';
import AddressScreen from './screens/AddressScreen';
import Map from './components/Map';
import RideScreen from './screens/RideScreen';
import DeliveryScreen from './screens/DeliveryScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
        <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="LandingPageScreen" component={LandingPageScreen} />
        <Stack.Screen name="ProfilesettingScreen" component={ProfilesettingScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen name="AddressScreen" component={AddressScreen} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="RideScreen" component={RideScreen} />
        <Stack.Screen name="DeliveryScreen" component={DeliveryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// To do

//fix bug after backing on Maps Component cant click anything