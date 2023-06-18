import {useState} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Alert,
  } from "react-native";
  import { LinearGradient } from "expo-linear-gradient";
  import { TextInput, Button } from "react-native-paper";
  import AsyncStorage from '@react-native-async-storage/async-storage'
import { dbURL } from '../server/keys';
  export default function SignUpScreen({navigation}) {
    const [name,setname] = useState("");
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");

    const register = async ()=>{
      fetch(dbURL+"/signup",{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          "userName":userName,
          "password":password

        })
      })
      .then(res=>res.json())
      .then(async(data)=>{
        try{
          await AsyncStorage.setItem('token',data.token)
          navigation.navigate("HomeScreen")
        }
        catch(err){
          Alert.alert("Something went wrong")
        }
            })
    }
  
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#6560D7", "#6987F0"]} style={styles.topScreen}>
          <View style={styles.logoViewStyle}>
            <Image
              source={require("../assets/ProjectImages/logo.png")}
              style={styles.imgStyle}
            />
            <Text style={{ fontSize: 30, color: "#fff", fontStyle: "italic" }}>
              Satwik Diet
            </Text>
            <Text style={{ fontSize: 20, color: "#fff", fontStyle: "italic" }}>
              Learn More about your food!!
            </Text>
          </View>
        </LinearGradient>
  
        <View style={styles.bottomScreen}>
          <View style={styles.loginViewStyle}>
            <Text
              style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}
            >
              Create Account
            </Text>
            <TextInput
              style={styles.textInputStyle}
              label="User Name"
              mode="outlined"
              value={userName}
              onChangeText={(text)=>setUserName(text)}
            />
            <TextInput
              style={styles.textInputStyle}
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={(text)=>setPassword(text)}
            />

            <Button
              style={styles.textInputStyle}
              mode="contained"
              backgroundColor="#6560D7"
              onPress={() =>register()}
            >
              Register
            </Button>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 30,
              alignSelf: "center",
            }}
          >
            Already registerd?
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              alignSelf: "center",
              color:"blue",
              textDecorationLine:"underline"
            }}
            onPress={()=>navigation.navigate("Login")}
          >
           Login here
          </Text>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "#fff",
    },
    topScreen: {
      flex: 2,
      borderBottomLeftRadius: 70,
      borderBottomRightRadius: 70,
    },
    logoViewStyle: {
      justifyContent: "center",
      alignSelf: "center",
      alignItems: "center",
    },
    loginViewStyle: {
      backgroundColor: "#fff",
      padding: 20,
      marginTop: "-70%",
      marginHorizontal: 20,
      borderRadius: 20,
      shadowColor: "black",
      shadowOpacity: 0.26,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 10,
      elevation: 3,
      backgroundColor: "white",
    },
    imgStyle: {
      width: 100,
      height: 100,
      padding: 10,
      borderWidth: 2,
      borderColor: "#fff",
      marginTop: 10,
      borderTopLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: "#fff",
    },
    bottomScreen: {
      backgroundColor: "#fff",
      flex: 1,
      marginTop: 20,
    },
    textViewStyle: {
      marginLeft: 20,
    },
    textInputStyle: {
      margin: 10,
    },
  });
  