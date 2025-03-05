import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
      // console.log("userDetails:",userDetails);
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
          <TouchableOpacity onPress={() => alert("Logout pressed")}>
            <Ionicons name="log-out" size={24} color="black" />
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
            onPress={() => alert("History pressed")}
          >
            <Ionicons name="create-outline" size={24} color="black" />
            <Text style={styles.bigButtonText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bigButton}
            onPress={() => alert("Addresses pressed")}
          >
            <Ionicons name="location-outline" size={24} color="black" />
            <Text style={styles.bigButtonText}>Addresses</Text>
          </TouchableOpacity>
        </View>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  iconButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  viewProfile: {
    fontSize: 14,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    gap: 16,
  },
  bigButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 16,
    flex: 1,
  },
  bigButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: "black",
  },
  settingsContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "gray",
  },
  settingsOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "black",
  },
});