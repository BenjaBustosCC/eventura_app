import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  backButton: {
    backgroundColor: '#b71c1c',
    padding: 10,
    borderRadius: 50,
    width: 42,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  imageBox: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  form: {
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    marginBottom: 15,
    paddingVertical: 8,
  },
  descriptionInput: {
    height: 60,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  publishButton: {
    backgroundColor: '#1c1c1c',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  publishText: {
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  imagePreview: {
  width: '100%',
  height: 200,
  borderRadius: 10,
},
locationBox: {
  marginTop: 10,
  padding: 10,
  backgroundColor: '#f0f0f0',
  borderRadius: 8,
},
modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff7f50',
    alignItems: 'center',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});