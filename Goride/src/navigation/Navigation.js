import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import screens from src/screens/
import OnboardingScreen1 from '../screens/Customer/OnboardingScreen1';  
import OnboardingScreen2 from '../screens/Customer/OnboardingScreen2';  
import OnboardingScreen3 from '../screens/Customer/OnboardingScreen3';  
import LoginScreen from '../screens/Customer/LoginScreen';  
import OtpScreen from '../screens/Customer/OtpScreen';  
import RegisterScreen from '../screens/Customer/RegisterScreen';  
import LandingPageScreen from '../screens/Customer/LandingPageScreen';  
import ProfileScreen from '../screens/Customer/ProfileScreen';  
import HistoryScreen from '../screens/Customer/HistoryScreen';  
import AddressScreen from '../screens/Customer/AddressScreen';  
import Map from '../components/Map';  
import RideScreen from '../screens/Customer/RideScreen';  
import BookingScreen from '../screens/Customer/BookingScreen';  
import SearchPlaceScreen from '../screens/Customer/SearchPlaceScreen';  
import FeedScreen from '../screens/Customer/FeedScreen';  
import FavScreen from '../screens/Customer/FavScreen';  
import EditScreen from '../screens/Customer/EditScreen';  
import LandingPageRider from '../rider/screens/LandingPageRider';  
  
const Stack = createStackNavigator();

const Navigation = () => {
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
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        <Stack.Screen name="AddressScreen" component={AddressScreen} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="RideScreen" component={RideScreen} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="SearchPlaceScreen" component={SearchPlaceScreen} />
        <Stack.Screen name="FeedScreen" component={FeedScreen} />
        <Stack.Screen name="FavScreen" component={FavScreen} />
        <Stack.Screen name="EditScreen" component={EditScreen} />
        <Stack.Screen name="LandingPageRider" component={LandingPageRider} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
