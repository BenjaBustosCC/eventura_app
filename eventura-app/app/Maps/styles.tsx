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
});
