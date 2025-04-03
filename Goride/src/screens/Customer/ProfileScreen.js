import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import PopupModal from '../../components/PopupModal';
import { logoutUser } from '../../services/Loginapi';
import ButtonBar from '../../components/buttonbarProf';
import styles from '../../styles/pofiles'; 

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get('window');

// Determine if the device is a tablet
const isTablet = width >= 600; // A common breakpoint for tablets

// Define fontSize based on device type
const fontSize = {
  small: isTablet ? 14 : 12,
  medium: isTablet ? 16 : 14,
  large: isTablet ? 18 : 16
};

const COLORS = {
  primary: '#1A2B4D',       // Deep Navy Blue
  secondary: '#2E7D32',     // Forest Green
  tertiary: '#26A69A',      // Soft Teal
  accent: '#D4AF37',        // Muted Gold
  background: '#F5F5F5',    // Light Gray
  white: '#FFFFFF',         // White
  lightGray: '#E0E0E0',     // Very Light Gray
  darkGray: '#333333',      // Charcoal Gray
  error: '#E53935',         // Bright Red
};

// Calculate responsive sizes
const scale = Math.min(width, height) / 375; // Base scale on 375px width (iPhone X)
const normalize = (size) => Math.round(scale * size);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [userDetails, setUserDetails] = useState({
    userName: "Loading...",
    gender: "Loading...",
    mobileNumber: "Loading...",
    userType: "Standard User"
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedUserDetails = await AsyncStorage.getItem('userDetails');
        if (storedUserDetails !== null) {
          const parsedDetails = JSON.parse(storedUserDetails);
          
          // Access properties through the 'user' object
          setUserDetails({
            userName: parsedDetails?.full_name || "Not provided",  // direct access
            gender: parsedDetails?.gender || "Not provided",
            mobileNumber: parsedDetails?.phone_number || "Not provided",
            userType: parsedDetails?.user_type || "Standard User"
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
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

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity 
        style={styles.arrowContainer} 
        onPress={() => navigation.navigate('LandingPageScreen')}
      >
        <Icon name="arrow-left" size={30} color="#26A69A" />
      </TouchableOpacity>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Cover Photo */}
          <View style={styles.coverContainer}>
          </View>

          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <View style={styles.profileImageWrapper}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Icon name="account" size={normalize(60)} color="#26A69A" />
                </View>
              )}
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{userDetails.userName}</Text>
              <Text style={styles.userType}>{userDetails.userType}</Text>
            </View>
          </View>
          
          {/* Personal Information Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userDetails.userName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{userDetails.gender}</Text>
            </View>
          </View>

          {/* Contact Information Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Contact Information</Text>
            </View>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>{userDetails.mobileNumber}</Text>
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Settings</Text>
            <View style={styles.cardDivider} />
            
            <View style={styles.buttonContainer}>
              {[
                { icon: "account-edit-outline", label: "Edit Profile", screen: "EditScreen" },
                { icon: "history", label: "History", screen: "HistoryScreen" },
                { icon: "alert-circle-outline", label: "Report", screen: "Report" },
                { icon: "thumb-up-outline", label: "Feedback", screen: "FeedScreen" }
              ].map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.settingsButton}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <Icon name={item.icon} size={normalize(20)} color="#26A69A" />
                  <Text style={styles.settingsButtonText}>{item.label}</Text>
                  <Icon name="chevron-right" size={normalize(20)} color="#26A69A" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Account Actions */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.logoutButton]}
              onPress={() => handleShowModal("logout")}
            >
              <Icon name="logout" size={normalize(18)} color="#ffffff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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

      {/* Bottom Navigation */}
      <ButtonBar isTablet={isTablet} />
    </SafeAreaView>
  );
}

