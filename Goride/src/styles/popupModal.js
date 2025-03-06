import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "80%",
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
    },
    message: {
      fontSize: 16,
      textAlign: "center",
      marginVertical: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      marginTop: 10,
      alignItems: "center",
    },
    cancelButton: {
      flex: 1,
      padding: 10,
      backgroundColor: "#ccc",
      borderRadius: 5,
      alignItems: "center",
      marginRight: 5,
    },
    cancelText: {
      color: "#333",
      fontSize: 16,
    },
    confirmButton: {
      flex: 1,
      padding: 10,
      backgroundColor: "red",
      borderRadius: 5,
      alignItems: "center",
      marginLeft: 5,
    },
    confirmText: {
      color: "#fff",
      fontSize: 16,
    },
  });

export default styles;