import { useEffect, useState } from "react";
import {} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import LoadingScreen from "./LoadingScreen";
import HomeScreenStack from "./HomeScreenStack";
import TabScreen from "./TabScreen";
import HomeScreen from './HomeScreen';
import ResultScreen from './ResultScreen'
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreenStack() {
  const LoginStack = createNativeStackNavigator();
  const [isLoggedIn, setLoggedIn] = useState();
  useEffect(async () => {
    const token = await AsyncStorage.getItem("token");
    
    if (token) {
      setLoggedIn(true);
      console.log("Token:",token)
    } else {
      setLoggedIn(false);
    }
  },[]);
  return (
    <NavigationContainer independent={true}>
      <LoginStack.Navigator
        initialRouteName="SignUp"
        screenOptions={{
          headerBackVisible: false,
          title: "Satwik Diet",
         
        }}
      >
        {isLoggedIn == null ? (
          <LoginStack.Screen name="Loading" component={LoadingScreen} />
        ) : isLoggedIn == true ? (
          <>
          <LoginStack.Screen name="Login" component={LoginScreen} />
          <LoginStack.Screen name="SignUp" component={SignUpScreen} />
          <LoginStack.Screen name="HomeScreen" component={HomeScreen} />
          <LoginStack.Screen name="Result" component={ResultScreen}/>
          </>
        ) : (
          <>
            <LoginStack.Screen name="Login" component={LoginScreen} />
            <LoginStack.Screen name="SignUp" component={SignUpScreen} />
            <LoginStack.Screen name="HomeScreen" component={HomeScreen} />
            <LoginStack.Screen name="Result" component={ResultScreen}/>
          </>
        )}
      </LoginStack.Navigator>
    </NavigationContainer>
  );
}
