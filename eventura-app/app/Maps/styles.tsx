import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  map: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.75,
    borderRadius: 10,
    flex: 1,
  },
  brujulaIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    alignItems: 'center',
  },
  referenciaTexto: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '500',
    zIndex: 1,
  },

  markerWrapper: {
  alignItems: 'center',
},

markerText: {
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: '#fff',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 6,
  fontSize: 12,
  marginBottom: 4,
  maxWidth: 100,
  textAlign: 'center',
},
});
