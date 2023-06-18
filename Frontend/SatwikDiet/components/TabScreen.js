import {View} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import Entypo from '@expo/vector-icons/Entypo';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome' 
import HomeScreen from './HomeScreen';
import HomeScreenStack from './HomeScreenStack';
import ProfileScreen from './ProfileScreen';
import LoginScreen from './LoginScreen';

export default function TabScreen({navigation}){
  const Tab = createBottomTabNavigator()
    return(
        <View
        style={{ flex: 1 }}
      >
     <StatusBar style="dark" backgroundColor="#6560D7" />
       
        <Tab.Navigator independent={true}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'Home') {
                iconName = 'home'
              } else if (route.name === 'Profile') {
                iconName = 'user';
              }
              return <FontAwesome name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: 'gray',
            tabBarActiveBackgroundColor:"#6560D7",
            headerShown:false
          })}>
          <Tab.Screen name="Home" component={HomeScreenStack} />
        {/*   <Tab.Screen name="Profile" component={ProfileScreen} /> */}
        </Tab.Navigator>
     
      </View>
    )
}