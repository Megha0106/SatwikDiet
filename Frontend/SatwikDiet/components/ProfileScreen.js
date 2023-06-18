import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput,Pressable } from "react-native";
import { Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function ProfileScreen({navigation}) {
  const [userData, setUserData] = useState({
    name: "Megha Sonavane",
    age: "21",
    gender: "Female",
    weight: "50",
    height: "4.7",
    pulseRate: "70",
    bloodPressure: "120/80",
  });
  const [edit, setEdit] = useState(false);

  const logout =async ()=>{
    await AsyncStorage.removeItem("token");
    navigation.navigate("LoginScreen")
  }
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#6560D7", "#6987F0"]} style={styles.topScreen}>
        <Image
          source={require("../assets/ProjectImages/profilePhoto.png")}
          style={styles.imgStyle}
        />
      </LinearGradient>
      <View style={styles.bottomScreen}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Megha Sonavane
          </Text>
          <Button
            icon="account-edit"
            style={{ width: 50, height: 100 }}
          ></Button>
        </View>

        <View style={styles.cardViewStyle}>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text style={styles.labelStyle}>Gender</Text>
              <TextInput
                value={userData.gender}
                editabel={edit}
                style={styles.valueStyle}
              />
            </Card.Content>
          </Card>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text style={styles.labelStyle}>Age</Text>
              <TextInput value={userData.age} style={styles.valueStyle} />
            </Card.Content>
          </Card>
        </View>
        <View style={styles.cardViewStyle}>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text style={styles.labelStyle}>Weight</Text>
              <TextInput value={userData.weight} style={styles.valueStyle} />
            </Card.Content>
          </Card>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text style={styles.labelStyle}>Height</Text>
              <TextInput value={userData.height} style={styles.valueStyle} />
            </Card.Content>
          </Card>
        </View>
        <View style={styles.cardViewStyle}>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text style={styles.labelStyle}>Pulse Rate</Text>
              <TextInput value={userData.pulseRate} style={styles.valueStyle} />
            </Card.Content>
          </Card>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text style={styles.labelStyle}>BP</Text>
              <TextInput
                value={userData.bloodPressure}
                style={styles.valueStyle}
              />
            </Card.Content>
          </Card>
        </View>
      </View>
      <Pressable
              onPress={() => logout()}
            >
              <Text style={styles.textStyle}>Logout</Text>
            </Pressable>
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  topScreen: {
    flex: 1,
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  imgStyle: {
    width: 125,
    height: 125,
    borderWidth: 5,
    borderRadius: 75,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  bottomScreen: {
    backgroundColor: "#fff",
    flex: 2,
    marginTop: 20,
  },
  cardViewStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardStyle: {
    backgroundColor: "#fff",
    width: 180,
    marginVertical: 10,
  },
  labelStyle: {
    color: "#00f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  valueStyle: {
    fontSize: 15,
  },
});
