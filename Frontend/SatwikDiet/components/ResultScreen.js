import { useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  Button,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  ScrollView
} from "react-native";
import { Card, Text, DataTable, Checkbox } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FS from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import { FlatGrid } from "react-native-super-grid";
import {  dbURL, modelURL } from "../server/keys";

export default function ResultScreen({ route, navigation }) {
  const [foodItem, setFoodItem] = useState();
  const [predictions, setPredictions] = useState();
  const [foodNutrients, setFoodNutrients] = useState();
  const [isError, setIsError] = useState(true);
  const [visible, setVisible] = useState(false);
  const [addDiet, setAddDiet] = useState(false);
  const [userId,setUserId] = useState()
  var nutritions = [];
  var item;

  const { base64, type, image, singleMultiple,user } = route.params;

  useEffect(() => {
    classify({
      type: type,
      base64: base64,
      uri: image,
    });
  }, [image]);
  useEffect(() => {
    if (singleMultiple == "single") {
      if (foodItem == "Sorry, we can't recognize image") {
        setIsError(true);
      } else {
        setIsError(false);
        calculateSingleNutritions();
      }
    } else {
      setIsError(false);
      calculateMultipleNutritions();
    }
  }, [foodItem]);

  useEffect(() => {
    if (predictions) {
      if (singleMultiple == "single") {
        nutritions.push({
          foodItem: foodItem,
          calories: predictions[0],
          carbs: predictions[1],
          fats: predictions[2],
          proteins: predictions[3],
        });
       
      } else {
        for (let i = 0; i < predictions.length; i++) {
          nutritions.push({
            foodItem: predictions[i][0],
            calories: predictions[i][1],
            carbs: predictions[i][2],
            fats: predictions[i][3],
            proteins: predictions[i][4],
          });
        }
      }
      setFoodNutrients(nutritions);
    }
  }, [predictions]);

  const classify = async (mediaFile) => {
    console.log("received:", singleMultiple);
    let type = mediaFile.type;
    let schema = "http://";
    let host = "192.168.38.80";
    let route =
      singleMultiple == "single"
        ? "/classify_singleItem"
        : "/classify_multipleItems";
    let port = "5000";
    let url = "";
    let content_type = "image/jpeg";
    url = modelURL+ route;
    let response = await FS.uploadAsync(url, mediaFile.uri, {
      headers: {
        "content-type": content_type,
      },
      httpMethod: "POST",
      uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    });

    if (response) {
      console.log("response:", response.body);
      setFoodItem(response.body);
    }
  };

  const calculateSingleNutritions = async () => {
    let schema = "http://";
    let host = "192.168.38.80";
    let route = "/predictSingle";
    let port = "5000";
    let url = "";
    url = modelURL + route;

    const formData = new FormData();
    formData.append("foodItem", foodItem);
    await fetch(url, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((predictions) => {
        setPredictions(predictions);
        console.log("prediction:", predictions);
      });
  };
  const calculateMultipleNutritions = async () => {
    let schema = "http://";
    let host = "192.168.38.80";
    let route = "/predictMultiple";
    let port = "5000";
    let url = "";
    url = modelURL+ route;

    if (foodItem) {
      const formData = new FormData();
      formData.append("foodItem", foodItem);
      await fetch(url, {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((predictions) => {
          setPredictions(predictions);
          console.log("prediction:", predictions);
        });
    }
  };

  const addNutrients = ()=>{
    fetch(dbURL+"/addDiet/"+user._id,{
      method:"PUT",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(foodNutrients)
    }).then(res=>(res.json()))
    .then(async(data)=>navigation.navigate("HomeScreen"))
    .catch(err=>Alert.alert("Error!!"));
  }
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#6560D7", "#6987F0"]} style={styles.topScreen}>
        <Image source={{ uri: image }} style={styles.imgStyle} />
      </LinearGradient>
      <View style={styles.bottomScreen}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}
      >
      <View style={styles.modalView}>
      <Text style={{fontWeight:"bold",fontSize:18}}>Confirmation</Text>
      <Text>Are you sure to add food to today's diet?</Text>
        
        <View style={{display:"flex",flexDirection:"row",alignSelf:"flex-end",marginTop:10}}>
        <Text style={{fontWeight:"bold"}} onPress={()=>{setAddDiet(false);
        setVisible(false)}}>Cancel</Text>
        <Text style={{marginLeft:20,marginRight:20,fontWeight:"bold"}} onPress={()=>{setAddDiet(true)
        setVisible(false)
        addNutrients()}
        }>Yes</Text>
        </View>
        
       
      </View>
      </Modal>
      
        {foodNutrients && !isError ? (
          <ScrollView>
            <Card style={styles.cardStyle}>
              <Card.Title
                title="Nutrition Facts"
                titleStyle={styles.predTitleStyle}
              />
              <Card.Content>
                <Text style={styles.predTextStyle}>{foodItem}</Text>
                <DataTable>
                  <DataTable.Header
                    style={{ backgroundColor: "#6560D7", marginTop: 10 }}
                  >
                    <DataTable.Title style={{ flex: 2 }}>
                      <Text style={styles.tableTitleStyle}>Food Name</Text>
                    </DataTable.Title>
                    <DataTable.Title>
                      <Text style={styles.tableTitleStyle}>Cal</Text>
                    </DataTable.Title>
                    <DataTable.Title>
                      <Text style={styles.tableTitleStyle}>Carbs</Text>
                    </DataTable.Title>
                    <DataTable.Title>
                      <Text style={styles.tableTitleStyle}>Fats</Text>
                    </DataTable.Title>
                    <DataTable.Title style={{ flex: 2 }}>
                      <Text style={styles.tableTitleStyle}>proteins</Text>
                    </DataTable.Title>
                  </DataTable.Header>
                  {foodNutrients.map((nutrition, key) => (
                    <DataTable.Row>
                      <DataTable.Cell style={{ flex: 2 }}>
                        {nutrition.foodItem}
                      </DataTable.Cell>
                      <DataTable.Cell>{nutrition.calories}</DataTable.Cell>
                      <DataTable.Cell>{nutrition.carbs}</DataTable.Cell>
                      <DataTable.Cell>{nutrition.fats}</DataTable.Cell>
                      <DataTable.Cell>{nutrition.proteins}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </Card.Content>
            </Card>
            <View style={{display:"flex",flexDirection:"row",alignItems:"center",alignSelf:'center'}}>
            <Checkbox
              status={visible ? "checked" : "unchecked"}
             disabled={addDiet}
              onPress={() => {
                setVisible(!visible);
              }}
            />
            <Text>Add to my today's diet</Text>
            </View>
           
          </ScrollView>
        ) : !isError ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator size="large" />
            <Text>Wait while processing your request</Text>
          </View>
        ) : (
          <Text style = {{color:"red",fontWeight:"bold",marginLeft:20,fontSize:20}}>Sorry, we couldn't recognize the image..</Text>
        )}
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
    alignItems: "center",
  },
  imgStyle: {
    width: "100%",
    height: "100%",
  },
  foodItemStyle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  bottomScreen: {
    backgroundColor: "#fff",
    marginTop: 20,
    flex: 2,
  },
  btnStyle: {
    padding: 5,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  btnTextStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    padding: 7,
  },
  cardStyle: {
    margin: 5,
    borderColor: "#6560D7",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  predTitleStyle: {
    fontSize: 18,
  },
  tableTitleStyle: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 15,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: "flex-end",
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  modalView: {
    marginTop: 300,
    marginLeft:20,
    marginRight:20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
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
