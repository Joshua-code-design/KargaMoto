import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation} from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = React.useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const animateTouchable = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.light);
  };

  const navigateTo = (screen) => {
    animateTouchable();  // Optional haptic feedback
    navigation.navigate(screen);
  };

  // Toggle theme function
  const toggleTheme = () => {
    animateTouchable(); // Add haptic feedback for theme toggle
    setDarkMode(!darkMode);
  };

  // Create theme-based styles
  const theme = {
    backgroundColor: darkMode ? '#121212' : '#FFFFFF',
    textColor: darkMode ? '#FFFFFF' : '#000000',
    cardBackground: darkMode ? '#1e1e1e' : '#F0F0F0',
    iconBackground: darkMode ? '#333333' : '#E0E0E0',
    borderColor: darkMode ? '#2a2a2a' : '#E0E0E0',
    secondaryText: darkMode ? '#888888' : '#666666',
    headerBackground: darkMode ? '#121212' : '#FFFFFF',
    statusBarStyle: darkMode ? "light-content" : "dark-content",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar barStyle={theme.statusBarStyle} backgroundColor={theme.headerBackground} />
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Profile</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellIcon}>
              <Ionicons name="notifications-outline" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://media.npr.org/assets/img/2015/09/23/ap_836720500193-13f1674f764e5180cf9f3349cfef258d181f2b32-s1100-c50.jpg' }}
            style={styles.profileImage}
          />
          <Text style={[styles.profileName, { color: theme.textColor }]}>Joshulla Lamis</Text>
          <TouchableOpacity onPress={() => navigateTo('ProfileScreen')} style={styles.viewProfileButton}>
            <Text style={[styles.viewProfileText, { color: theme.secondaryText }]}>View Profile</Text>
          </TouchableOpacity> 
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity onPress={() => navigateTo('HistoryScreen')} style={[styles.quickAction, { backgroundColor: theme.cardBackground }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBackground }]}>
              <Ionicons name="document-text-outline" size={22} color={theme.textColor} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.textColor }]}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigateTo('AddressScreen')} style={[styles.quickAction, { backgroundColor: theme.cardBackground }]}>
            <View style={[styles.iconContainer, { backgroundColor: theme.iconBackground }]}>
              <Ionicons name="location-outline" size={22} color={theme.textColor} />
            </View>
            <Text style={[styles.quickActionText, { color: theme.textColor }]}>Addresses</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>General</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="contrast-outline" size={22} color={theme.textColor} />
              <Text style={[styles.settingText, { color: theme.textColor }]}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#3e3e3e', true: '#333333' }}
              thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          {/* <View style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={22} color={theme.textColor} />
              <Text style={[styles.settingText, { color: theme.textColor }]}>Notification</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#3e3e3e', true: '#333333' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View> */}
        </View>

        {/* Support Section */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>Support</Text>
          
          <TouchableOpacity onPress={() => navigateTo('FeedScreen')} style={[styles.supportItem, { borderBottomColor: theme.borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.textColor} />
              <Text style={[styles.settingText, { color: theme.textColor }]}>Share Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigateTo('ReportScreen')} style={[styles.supportItem, { borderBottomColor: theme.borderColor }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="alert-circle-outline" size={22} color={theme.textColor} />
              <Text style={[styles.settingText, { color: theme.textColor }]}>Report an Issue</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
          </TouchableOpacity>
        </View>


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    padding: 4,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  viewProfileButton: {
    marginTop: 4,
  },
  viewProfileText: {
    fontSize: 14,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  quickAction: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
  },
  settingsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  supportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    marginLeft: 12,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  }
});

export default ProfileScreen;