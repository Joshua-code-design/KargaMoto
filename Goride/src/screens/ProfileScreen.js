import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ModernButton from '../components/ModernButton';
import PopupModal from '../components/PopupModal';


export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");

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
      // Add logout logic
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
        <Text style={styles.value}>Firstname Lastname</Text>

        <Text style={styles.label}>Sex</Text>
        <Text style={styles.value}>Not Specified</Text>

        <Text style={styles.label}>Weight</Text>
        <Text style={styles.value}>Not Specified</Text>
      </View>

      {/* Contact Information Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Contact Information</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <Text style={styles.value}>+639622137451</Text>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  coverContainer: {
    width: "100%",
    height: 100,
    backgroundColor: "#000",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileIconContainer: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 15,
    elevation: 3,
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  accountSetting: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
});