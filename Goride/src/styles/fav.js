import { Platform, StyleSheet, StatusBar, Dimensions } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom scaling function using device width
const scale = (size) => {
  const { width } = Dimensions.get('window');
  return (width / 375) * size;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#222222',
    flex: 1,
    marginLeft: wp(13),
  },
  backButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  closeButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  subtitle: {
    fontSize: scale(14),
    color: '#666666',
    marginHorizontal: '5%',
    marginTop: scale(12),
    marginBottom: scale(16),
  },
  addButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginBottom: scale(20),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: scale(8),
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  addButtonText: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#333333',
    marginLeft: scale(8),
  },
  divider: {
    height: scale(8),
    backgroundColor: '#F7F7F7',
    width: '100%',
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#222222',
    marginHorizontal: '5%',
    marginVertical: scale(16),
  },
  addressList: {
    paddingHorizontal: '5%',
  },
  addressItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    marginBottom: scale(16),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIconContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#FFEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },
  addressType: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#333333',
  },
  addressText: {
    fontSize: scale(14),
    color: '#666666',
    lineHeight: scale(20),
  },
  defaultBadge: {
    backgroundColor: '#E9F7FF',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    alignSelf: 'flex-start',
    marginTop: scale(8),
  },
  defaultText: {
    fontSize: scale(12),
    color: '#0088CC',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  emptyStateText: {
    fontSize: scale(15),
    color: '#777777',
    textAlign: 'center',
    marginTop: scale(12),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: scale(20),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#222222',
    marginBottom: scale(16),
  },
  modalOption: {
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(2),
    marginBottom: hp(2),
    marginHorizontal: hp(4),
    borderRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
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
  },
  deleteButton: {
    padding: scale(8),
  },
  modalDeleteText: {
    fontSize: scale(14),
    color: '#666666',
    textAlign: 'center',
    marginBottom: scale(20),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    marginHorizontal: scale(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  deleteConfirmButton: {
    backgroundColor: '#E53935',
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: scale(14),
    fontWeight: '500',
  },
  deleteConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontWeight: '500',
  },
});

export default styles;