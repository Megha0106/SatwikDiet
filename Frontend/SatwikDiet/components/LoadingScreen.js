import {
    View,
    ActivityIndicator,
    StyleSheet
  } from "react-native";
  import { LinearGradient } from "expo-linear-gradient";
  import { TextInput, Button } from "react-native-paper";
  export default function LoadingScreen() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"}/>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "#fff",
    },
   
  });
  