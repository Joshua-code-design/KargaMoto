import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import PopupModal from '../components/PopupModal';
import { logoutUser } from '../services/Loginapi';

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

// Color palette
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
          setUserDetails({
            userName: parsedDetails.full_name || "Not provided",
            gender: parsedDetails.gender || "Not provided",
            mobileNumber: parsedDetails.phone_number || "Not provided",
            userType: parsedDetails.user_type || "Standard User"
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
            <View style={styles.coverGradient} />
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
              <TouchableOpacity style={styles.editButton}>
                <Icon name="pencil-outline" size={normalize(18)} color="#26A69A" />
              </TouchableOpacity>
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
              <TouchableOpacity style={styles.editButton}>
                <Icon name="pencil-outline" size={normalize(18)} color="#26A69A" />
              </TouchableOpacity>
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
                { icon: "account-edit-outline", label: "Edit Profile", screen: "EditProfile" },
                { icon: "history", label: "History", screen: "History" },
                { icon: "alert-circle-outline", label: "Report", screen: "Report" },
                { icon: "thumb-up-outline", label: "Feedback", screen: "Feedback" }
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
      <View style={[
        styles.bottomNav,
        {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        }
      ]}>
        {[
          { name: 'home', label: 'Home', screen: 'LandingPageScreen', active: false },
          { name: 'heart-outline', label: 'Favorites', screen: 'FavScreen', active: false },
          { name: 'person-outline', label: 'Profile', screen: 'ProfilesettingScreen', active: true },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigateTo(item.screen)}
            activeOpacity={0.7}
          >
            {item.active && (
              <View style={[
                styles.activeIndicator, 
                { backgroundColor: COLORS.secondary }
              ]} />
            )}
            <Ionicons
              name={item.name}
              size={isTablet ? 24 : 22}
              color={item.active ? COLORS.secondary : COLORS.darkGray}
            />
            <Text
              style={[
                styles.navText,
                { 
                  fontSize: fontSize.small, 
                  color: item.active ? COLORS.secondary : COLORS.darkGray,
                  fontWeight: item.active ? '600' : '400'
                }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  coverContainer: {
    height: normalize(50),
    backgroundColor: "black",
    position: "relative",
  },
  coverGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: normalize(60),
    backgroundColor: "#F5F5F5",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -normalize(50),
    paddingHorizontal: normalize(20),
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: normalize(10),
  },
  profileImagePlaceholder: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#26A69A",
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  userName: {
    fontSize: normalize(22),
    fontWeight: "600",
    color: "#26A69A",
    marginBottom: normalize(5),
  },
  userType: {
    fontSize: normalize(14),
    color: "#26A69A",
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: normalize(12),
    padding: normalize(16),
    marginHorizontal: normalize(16),
    marginBottom: normalize(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#26A69A",
    marginBottom: normalize(8),
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#26A69A",
    marginBottom: normalize(16),
  },
  editButton: {
    padding: normalize(5),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: normalize(14),
  },
  infoLabel: {
    fontSize: normalize(14),
    color: "#26A69A",
    flex: 1,
  },
  infoValue: {
    fontSize: normalize(14),
    color: "#26A69A",
    fontWeight: "500",
    textAlign: "right",
    flex: 2,
  },
  arrowContainer:{
    marginLeft: hp(3),
  },
  line: {
    width: 50,
    height: 2,
    backgroundColor: '#26A69A',
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: normalize(14),
    color: "#26A69A",
    marginRight: normalize(5),
  },
  buttonContainer: {
    marginTop: normalize(8),
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: "#26A69A",
  },
  settingsButtonText: {
    fontSize: normalize(15),
    color: "#26A69A",
    flex: 1,
    marginLeft: normalize(15),
  },
  actionButtonsContainer: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(30),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: normalize(14),
    borderRadius: normalize(8),
    marginBottom: normalize(12),
  },
  logoutButton: {
    backgroundColor: "#26A69A",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: normalize(15),
    marginLeft: normalize(8),
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(2),
    marginBottom: hp(2),
    marginHorizontal: hp(5),
    borderRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: '#fff',
    
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 16,
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  navText: {
    marginTop: 4,
  }

}); 