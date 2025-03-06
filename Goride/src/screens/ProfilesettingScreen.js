import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StatusBar,
  Text,
  View,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from '../styles/profilesettingScreen.js';

const SettingsOption = ({ icon, title, toggleSwitch, isSwitch }) => {
  return (
    <View style={styles.settingsOption}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={20} color="black" />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch onValueChange={toggleSwitch} value={true} />
      ) : (
        <Ionicons name="chevron-forward-outline" size={20} color="gray" />
      )}
    </View>
  );
};

export default function ProfileSettings({ navigation }) {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails !== null) {
          const parsedDetails = JSON.parse(userDetails);
          setUserName(parsedDetails.full_name);
        }
      } catch (error) {
        console.error("Failed to load user details:", error);
      }
    };

    fetchUserDetails();
  }, []);   

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        {/* Icon Buttons */}
        <View style={styles.iconButtonsContainer}>
          <TouchableOpacity onPress={() => alert("Notifications pressed")}>
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle" size={50} color="black" />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
              <Text style={styles.viewProfile}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => navigation.navigate("HistoryScreen")}
          >
            <Ionicons name="create-outline" size={24} color="black" />
            <Text style={styles.bigButtonText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => navigation.navigate("AddressScreen")}
          >
            <Ionicons name="location-outline" size={24} color="black" />
            <Text style={styles.bigButtonText}>Addresses</Text>
          </TouchableOpacity>
        </View>

        {/* General Section */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>General</Text>
          <SettingsOption icon="contrast" title="Theme" isSwitch />
          <SettingsOption icon="card-outline" title="Payment Method" />
        </View>

        {/* Support Section */}
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Support</Text>
          <SettingsOption icon="chatbubble-outline" title="Share Feedback" />
          <SettingsOption icon="alert-circle-outline" title="Report an Issue" />
        </View>

        <StatusBar style="auto" />
      </View>
    </View>
  );
}
