import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#222',
    },
    closeButton: {
      padding: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#999',
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    addButtonsContainer: {
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    addButtonText: {
      marginLeft: 10,
      fontSize: 15,
      color: '#333',
    },
    divider: {
      height: 1,
      backgroundColor: '#f0f0f0',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '500',
      paddingHorizontal: 16,
      marginBottom: 8,
      color: '#333',
    },
    addressList: {
      paddingHorizontal: 16,
    },
    addressItem: {
      marginBottom: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#f0f0f0',
      overflow: 'hidden',
    },
    addressContent: {
      padding: 12,
    },
    addressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    heartIconContainer: {
      marginRight: 6,
    },
    addressType: {
      fontSize: 15,
      fontWeight: '500',
      color: '#333',
    },
    addressText: {
      fontSize: 14,
      color: '#777',
      lineHeight: 20,
    },
    actionIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      padding: 4,
      marginLeft: 8,
    },
  });

export default styles;