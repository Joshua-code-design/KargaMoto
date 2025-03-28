import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: width * 0.05,
      paddingVertical: height * 0.025,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
      fontSize: width * 0.065,
      fontWeight: '700',
      color: '#212121',
      letterSpacing: 0.5,
    },
    filterButton: {
      padding: 8,
    },
    listContainer: {
      paddingHorizontal: width * 0.04,
      paddingVertical: height * 0.02,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: width * 0.04,
      marginBottom: height * 0.015,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
    itemLeftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 15,
      backgroundColor: '#F0F0F0',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: width * 0.03,
    },
    contentContainer: {
      flex: 1,
    },
    historyTitle: {
      fontSize: width * 0.047,
      fontWeight: '600',
      color: '#212121',
      marginBottom: 6,
    },
    locationContainer: {
      marginBottom: 6,
    },
    locationText: {
      fontSize: width * 0.036,
      color: '#757575',
      alignItems: 'center',
    },
    historyDate: {
      fontSize: width * 0.035,
      color: '#9E9E9E',
    },
    statusContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    statusIndicator: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },
    historyStatus: {
      fontSize: width * 0.035,
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: height * 0.1,
    },
    emptyText: {
      fontSize: width * 0.045,
      color: '#757575',
      marginTop: 16,
    },
  });

  export default styles;