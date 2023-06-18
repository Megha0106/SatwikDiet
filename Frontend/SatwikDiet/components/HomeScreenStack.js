import {Button} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import HomeScreen from "./HomeScreen";
import ResultScreen from "./ResultScreen";
import LoginScreen from './LoginScreen'
import LoginScreenStack from "./LoginScreenStack";

export default function HomeScreenStack() {
  const HomeStack = createNativeStackNavigator();
 
  
  return (
   
    <HomeStack.Navigator independent={true}
    screenOptions={{
      headerTitle:"SatwikDiet",
      headerBackVisible:false,
    
      
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Result" component={ResultScreen} />
      <HomeStack.Screen name="LoginScreen" component={LoginScreenStack} />
    </HomeStack.Navigator>
    
  );
}
