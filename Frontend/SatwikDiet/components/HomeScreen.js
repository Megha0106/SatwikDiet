import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import {useIsFocused} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import * as ImagePicker from "expo-image-picker";

import * as FS from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dbURL } from "../server/keys";

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [result, setResult] = useState("");
  const [image, setImage] = useState();
  const [type, setType] = useState();
  const [user,setUser] = useState();
  const [foodItems, setFoodItems] = useState("single");
  const [cals,setCals] = useState(0);
  const [fats,setFats] = useState(0);
  const [carbs,setCarbs] = useState(0);
  const [proteins,setproteins] = useState(0);
  const [base64, setBase64] = useState();
  const [isError,setIsError] = useState(false);
  const focus = useIsFocused();
  
  useEffect(() => {
    if (image) {
      navigation.navigate("Result", {
        type: type,
        base64: base64,
        image: image,
        singleMultiple:foodItems,
        user:user
      });
    }
    setImage(null);
  }, [image]);

  useEffect(()=>{
    if(user)
    {
      if(user.nutritions.nutritionArray.length>0){
        setCals(user.avgNutrition.avgCals);
        setCarbs(user.avgNutrition.avgCarbs);
        setFats(user.avgNutrition.avgFats);
        setproteins(user.avgNutrition.avgProteins);
      }
     
    }
  },[user]) 
  

 
  const getUserDetails = async()=>{
    const token = await AsyncStorage.getItem("token");
    let authorization ='Bearer '+token;
    await fetch(dbURL,{
      method:"GET",
      headers:{
        'Authorization':authorization
      }
    }).then(res=>(res.json()))
    .then(async(data)=>{
      console.log("User:",data)
      setUser(data);
      setIsError(false);
    })
    .catch(err=>setIsError(true))
    
  }
  useEffect(() => {
    setIsError(false);
   getUserDetails();
  },[focus]);
  
  useEffect(()=>{
   // getTodaysNutrition();
  },[]);

  const getTodaysNutrition = async()=>{

    await fetch(dbURL+"/updateAvgNutritions/"+user._id,{
      method:"PUT",
    }
    ).then(res=>res.json())
    .then(async(data)=>{
      setUser(data);
    })
    .catch(err=>setIsError(true))
  }
  
  const logout =async ()=>{
    await AsyncStorage.removeItem("token");
    navigation.navigate("Login")
  }

  const pickFile = async (isCamera) => {
    setResult("");
    setModalVisible(false);
    setImage(null);
    let result;
    if (isCamera == 1) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
      });
    }

    if (!result.canceled) {
      setBase64(result.assets[0].base64);
      setType(result.assets[0].type);
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View>
          <View style={styles.modalView}>
            <Text
              style={{
                marginLeft: 10,
                fontWeight: "bold",
                fontSize: 16,
                alignSelf: "center",
              }}
            >
              Scan your food here
            </Text>
            <View>
              <RadioButtonGroup
                containerStyle={{
                  margin: 10,
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "row",
                }}
                selected={foodItems}
                onSelected={(value) => {
                  setFoodItems(value);
                }}
                radioBackground="#6560D7"
              >
                <RadioButtonItem value="single" label="Single food item " />
                <RadioButtonItem value="multipl" label="Multiple food items" />
              </RadioButtonGroup>

              <View style={styles.buttonView}>
                <LinearGradient
                  style={styles.btnStyle}
                  colors={["#6560D7", "#6987F0"]}
                >
                  <Text
                    style={styles.btnTextStyle}
                    onPress={() => {
                      pickFile(1);
                    }}
                  >
                    Camera
                  </Text>
                </LinearGradient>
                <LinearGradient
                  style={styles.btnStyle}
                  colors={["#6560D7", "#6987F0"]}
                >
                  <Text
                    style={styles.btnTextStyle}
                    onPress={() => {
                      pickFile(0);
                    }}
                  >
                    Gallery
                  </Text>
                </LinearGradient>
              </View>
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.topScreen}>
        <ImageBackground
          source={require("../assets/ProjectImages/blurImg2.jpg")}
          style={{
            alignItems: "flex-end",
            justifyContent: "center",
            height: 300,
          }}
        >
          <Text style={styles.quotesTextStyle}>"Your diet is bank </Text>
          <Text style={styles.quotesTextStyle}>account. Good food</Text>
          <Text style={styles.quotesTextStyle}>choices are good</Text>
          <Text style={styles.quotesTextStyle}>investments."</Text>
          <Text>-Bethenny Frankel</Text>
        </ImageBackground>
      </View>

      <View style={styles.bottomScreen}>
        <View>
        {/* {user ? <Text style={styles.quotesTextStyle}>Hello {user.username}</Text>:<></> } */}
       
          <Text style={styles.textStyle}>Your today's nutrition investment</Text>
          {user ?
          <View>
          <PieChart
            data={
              [
            {
              name: "Calories",
              value: cals,
              color: "red",
              legendFontColor: "#000",
              legendFontSize: 15,
            },
            {
              name: "Fats",
              value: fats,
              color: "green",
              legendFontColor: "#000",
              legendFontSize: 15,
            },
            {
              name: "Carbs",
              value: carbs,
              color: "orange",
              legendFontColor: "#000",
              legendFontSize: 15,
            },
            {
              name: "proteins",
              value: proteins,
              color: "blue",
              legendFontColor: "#000",
              legendFontSize: 15,
            },
          ]
            }
            width={Dimensions.get("window").width - 16}
            height={220}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
          /> 
          </View>
          :
          isError?<Text>Sorry, there was error while loading data</Text>:
          <View>
          <ActivityIndicator size="large" />
          </View>
          }
          
        </View>

        <Text style={styles.textStyle}>
          Know nutrition value of your food now!!!
        </Text>
        <LinearGradient style={styles.btnStyle} colors={["#6560D7", "#6987F0"]}>
          <Text
            style={styles.btnTextStyle}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            Upload food photo
          </Text>
        </LinearGradient>
        {/* <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => logout()}
            >
              <Text style={styles.textStyle}>Logout</Text>
            </Pressable> */}
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
    flex: 1,
  },
  bottomScreen: {
    backgroundColor: "#fff",
    flex: 2,
    marginTop: 30,
  },
  quotesTextStyle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    marginRight: 10,
  },
  textStyle: {
    color: "#534FB0",
    fontWeight: "bold",
    paddingLeft: 10,
    fontSize: 20,
    marginTop: 10,
  },
  buttonView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnStyle: {
    padding: 5,
    margin: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  btnTextStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    padding: 7,
  },
  imgStyle: {
    width: 400,
    height: 300,
    alignSelf: "center",
    borderWidth: 5,
    borderColor: "#f00",
  },
  modalView: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
