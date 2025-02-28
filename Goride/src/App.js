import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen1 from './screens/OnboardingScreen1';
import OnboardingScreen2 from './screens/OnboardingScreen2';
import OnboardingScreen3 from './screens/OnboardingScreen3';
import OnboardingScreen4 from './screens/OnboardingScreen4';
import OnboardingScreen5 from './screens/OnboardingScreen5';
import OnboardingScreen6 from './screens/OnboardingScreen6';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
        <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
        <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        <Stack.Screen name="Onboarding4" component={OnboardingScreen4} />
        <Stack.Screen name="Onboarding5" component={OnboardingScreen5} />
        <Stack.Screen name="Onboarding6" component={OnboardingScreen6} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}