import { useState, useEffect,useCallback } from "react";
import {
  View
} from "react-native";
import {StatusBar} from 'expo-status-bar'
import Entypo from '@expo/vector-icons/Entypo';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome' 

import HomeScreenStack from "./components/HomeScreenStack";
import ProfileScreen from "./components/ProfileScreen";
import LoginScreen from "./components/LoginScreen"
import LoginScreenStack from "./components/LoginScreenStack";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  return (
    //test
    <View
      style={{ flex: 1 }}
    >
    <StatusBar style="dark" backgroundColor="#6560D7" />
    <LoginScreenStack/>
   
    </View>
  );
}

