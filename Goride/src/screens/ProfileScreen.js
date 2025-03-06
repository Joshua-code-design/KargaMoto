import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ModernButton from '../components/ModernButton';
import PopupModal from '../components/PopupModal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../services/Loginapi';
import styles from '../styles/pofilescreen.js';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [userName, setUserName] = useState("Loading...");
  const [gender, setGender] = useState("Loading...");
  const [mobileNumber, setMobileNumber] = useState("Loading...");
  const [userType, setUserType] = useState("Loading...");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (userDetails !== null) {
        const parsedDetails = JSON.parse(userDetails);
        console.log("parsedDetails:", parsedDetails);
        setUserName(parsedDetails.full_name);
        setGender(parsedDetails.gender);
        setMobileNumber(parsedDetails.phone_number);
        setUserType(parsedDetails.user_type);
      }
    };

    fetchUserDetails();
  }, []);

  // Show modal with correct message
  const handleShowModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  // Handle Confirm action
  const handleConfirm = () => {
    setModalVisible(false);
    if (modalType === "delete") {
      console.log("Account Deleted!");
      // Add delete account logic
    } else if (modalType === "logout") {
      console.log("Logged Out!");
      logoutUser(navigation);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cover Photo */}
      <View style={styles.coverContainer} />

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <View style={styles.profileIconContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Icon name="account-circle" size={100} color="#ccc" />
          )}
          <TouchableOpacity style={styles.editProfileIcon}>
            <Icon name="pencil" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.infoContainer}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity>
            <Icon name="pencil" size={20} color="#777" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{userName}</Text>

        <Text style={styles.label}>Sex</Text>
        <Text style={styles.value}>{gender}</Text>
      </View>

      {/* Contact Information Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <Text style={styles.value}>{mobileNumber}</Text>

        <Text style={styles.label}>User Type</Text>
        <Text style={styles.value}>{userType}</Text>

        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.label}>Email Address</Text>
            <Text style={[styles.value, { color: "black" }]}>Add Email</Text>
          </View>
          <TouchableOpacity>
            <Icon name="plus-circle" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.infoContainer}>
        <Text style={styles.accountSetting}>Account Settings</Text>

        <ModernButton
          title="Delete Account"
          onPress={() => handleShowModal("delete")}
          color="red"
        />
        <ModernButton
          title="Logout"
          onPress={() => handleShowModal("logout")}
          color="black"
        />
      </View>

      {/* Popup Modal */}
      <PopupModal
        visible={modalVisible}
        title={modalType === "delete" ? "Delete Account" : "Logout"}
        message={
          modalType === "delete"
            ? "Are you sure you want to delete your account? This action cannot be undone."
            : "Are you sure you want to logout?"
        }
        onCancel={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}
