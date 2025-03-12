import { StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#111',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  mapPreview: {
    height: height * 0.25,
    width: '100%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '120%',
    opacity: 0.8, // Reduced opacity for black and white theme
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', // Darker overlay for contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#fff',
    marginTop:'25%',
    fontSize: width * 0.05,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: height * 0.03,
  },
  locationIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 20,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111',
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50', // Changed to green
  },
  inputsWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: height * 0.018,
    borderRadius: 10,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    borderColor: '#222',
  },
  inputLabel: {
    fontSize: width * 0.03,
    color: '#777',
    marginBottom: 4,
    fontWeight: '500',
    letterSpacing: 1,
  },
  inputText: {
    color: '#111',
    fontSize: width * 0.04,
    fontWeight: '500',
    marginRight: 20,
  },
  dropdownContainer: {
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#222',
    borderTopWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 20,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  dropdownItemText: {
    color: '#111',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  dropdownItemSubtext: {
    color: '#777',
    fontSize: width * 0.03,
    marginTop: 2,
  },
  recentLocations: {
    marginTop: height * 0.01,
  },
  recentTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#111',
    marginBottom: height * 0.015,
    letterSpacing: 0.5,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  recentItemText: {
    color: '#111',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  recentItemSubtext: {
    color: '#777',
    fontSize: width * 0.03,
    marginTop: 2,
  },
  footer: {
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: height * 0.018,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: width * 0.04,
    fontWeight: '500',
    color: '#111',
  }
});
export default styles;