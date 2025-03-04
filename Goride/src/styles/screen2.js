import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    top: '62%',
    paddingHorizontal: width * 0.06,
    width: '100%',
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  description: {
    fontSize: width * 0.04,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: width * 0.06,
    paddingHorizontal: width * 0.05,
  },
  radioContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.02,
  },
  radioButton: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: '#666666',
    margin: width * 0.01,
  },
  radioButtonActive: {
    backgroundColor: 'black',
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: width * 0.0125,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: width * 0.06,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.06,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: width * 0.3,
  },
  nextButton: {
    backgroundColor: '#141010',
  },
  nextButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
