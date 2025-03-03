import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen1 from './screens/OnboardingScreen1';
import OnboardingScreen2 from './screens/OnboardingScreen2';
import OnboardingScreen3 from './screens/OnboardingScreen3';
import loginScreen from './screens/loginScreen';
import OtpScreen from './screens/OtpScreen';
import registerScreen from './screens/registerScreen';
import LandingPageScreen from './screens/LandingPageScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
        <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        <Stack.Screen name="loginScreen" component={loginScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="registerScreen" component={registerScreen} />
        <Stack.Screen name="LandingPageScreen" component={LandingPageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}