import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  lottieContainer: {
    width: '130%',
    marginTop: 150,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    margin: 4,
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 8,
    borderRadius: 4,
    transform: [{ scale: 1 }],
  },
  ctaButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: 'white',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    backgroundColor: '#000000',
    padding: 20,
    transform: [{ perspective: 1000 }],
  },
  ctaText: {
    color: 'rgba(250, 250, 250, 0.8)',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#2c3e50',
  },
});
