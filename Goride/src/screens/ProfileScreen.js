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
  StatusBar
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ModernButton from '../components/ModernButton';
import PopupModal from '../components/PopupModal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../services/Loginapi';

// Get screen dimensions for responsiveness
const { width, height } = Dimensions.get('window');

// Calculate responsive sizes
const scale = Math.min(width, height) / 375; // Base scale on 375px width (iPhone X)
const normalize = (size) => Math.round(scale * size);

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
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails !== null) {
          const parsedDetails = JSON.parse(userDetails);
          setUserName(parsedDetails.full_name || "Not provided");
          setGender(parsedDetails.gender || "Not provided");
          setMobileNumber(parsedDetails.phone_number || "Not provided");
          setUserType(parsedDetails.user_type || "Standard User");
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Cover Photo */}
          <View style={styles.coverContainer}>
            {/* Optional: Add gradient overlay */}
            <View style={styles.coverGradient} />
          </View>

          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <View style={styles.profileImageWrapper}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Icon name="account" size={normalize(60)} color="#fff" />
                </View>
              )}
              <TouchableOpacity style={styles.editProfileButton}>
                <Icon name="camera" size={normalize(16)} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userType}>{userType}</Text>
            </View>
          </View>
          
          {/* Information Cards */}
          {/* Personal Information Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <TouchableOpacity style={styles.editButton}>
                <Icon name="pencil-outline" size={normalize(18)} color="#4A80F0" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{gender}</Text>
            </View>
          </View>

          {/* Contact Information Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Contact Information</Text>
              <TouchableOpacity style={styles.editButton}>
                <Icon name="pencil-outline" size={normalize(18)} color="#4A80F0" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardDivider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>{mobileNumber}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Email</Text>
                <Icon name="plus-circle-outline" size={normalize(16)} color="#4A80F0" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Settings</Text>
            <View style={styles.cardDivider} />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Icon name="account-edit-outline" size={normalize(20)} color="#4A80F0" />
                <Text style={styles.settingsButtonText}>Edit Profile</Text>
                <Icon name="chevron-right" size={normalize(20)} color="#8E8E93" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => navigation.navigate('PrivacySettings')}
              >
                <Icon name="shield-account-outline" size={normalize(20)} color="#4A80F0" />
                <Text style={styles.settingsButtonText}>Privacy Settings</Text>
                <Icon name="chevron-right" size={normalize(20)} color="#8E8E93" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Icon name="bell-outline" size={normalize(20)} color="#4A80F0" />
                <Text style={styles.settingsButtonText}>Notifications</Text>
                <Icon name="chevron-right" size={normalize(20)} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Account Actions */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.logoutButton]}
              onPress={() => handleShowModal("logout")}
            >
              <Icon name="logout" size={normalize(18)} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleShowModal("delete")}
            >
              <Icon name="delete-outline" size={normalize(18)} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  coverContainer: {
    height: normalize(120),
    backgroundColor: "#4A80F0",
    position: "relative",
  },
  coverGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: normalize(60),
    backgroundColor: "rgba(0,0,0,0.1)",
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
    backgroundColor: "#4A80F0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  editProfileButton: {
    position: "absolute",
    bottom: normalize(5),
    right: normalize(5),
    backgroundColor: "#4A80F0",
    width: normalize(30),
    height: normalize(30),
    borderRadius: normalize(15),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: normalize(20),
  },
  userName: {
    fontSize: normalize(22),
    fontWeight: "600",
    color: "#333",
    marginBottom: normalize(5),
  },
  userType: {
    fontSize: normalize(14),
    color: "#777",
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
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: normalize(8),
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
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
    color: "#777",
    flex: 1,
  },
  infoValue: {
    fontSize: normalize(14),
    color: "#333",
    fontWeight: "500",
    textAlign: "right",
    flex: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: normalize(14),
    color: "#4A80F0",
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
    borderBottomColor: "#EEEEEE",
  },
  settingsButtonText: {
    fontSize: normalize(15),
    color: "#333",
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
    backgroundColor: "#4A80F0",
  },
  deleteButton: {
    backgroundColor: "#FB4E4E",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: normalize(15),
    marginLeft: normalize(8),
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: normalize(15),
    marginLeft: normalize(8),
  }
}); 