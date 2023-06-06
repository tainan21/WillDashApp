import {
  StyleSheet,
  Image,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import header_logo from "../../assets/logo/logo.png";

import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import InternetConnectionAlert from "react-native-internet-connection-alert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../../assets/logo/marombaWill.svg";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isloading, setIsloading] = useState(false);

  //method to store the authUser to aync storage
  _storeData = async (user) => {
    try {
      AsyncStorage.setItem("authUser", JSON.stringify(user));
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
    password: password,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  //method to validate the user credentials and navigate to Home Screen / Dashboard
  const loginHandle = () => {
    setIsloading(true);
    //[check validation] -- Start
    // if email does not contain @ sign
    if (email == "") {
      setIsloading(false);
      return setError("Please enter your email");
    }
    if (password == "") {
      setIsloading(false);
      return setError("Please enter your password");
    }
    if (!email.includes("@")) {
      setIsloading(false);
      return setError("Email is not valid");
    }
    // length of email must be greater than 5 characters
    if (email.length < 6) {
      setIsloading(false);
      return setError("Email is too short");
    }
    // length of password must be greater than 5 characters
    if (password.length < 6) {
      setIsloading(false);
      return setError("Password must be 6 characters long");
    }
    //[check validation] -- End

    fetch(network.serverip + "/login", requestOptions) // API call
      .then((response) => response.json())
      .then((result) => {
        if (
          result.status == 200 ||
          (result.status == 1 && result.success != false)
        ) {
          if (result?.data?.userType == "ADMIN") {
            //check the user type if the type is ADMIN then navigate to Dashboard else navigate to User Home
            _storeData(result.data);
            setIsloading(false);
            navigation.replace("dashboard", { authUser: result.data }); // naviagte to Admin Dashboard
          } else {
            _storeData(result.data);
            setIsloading(false);
            navigation.replace("tab", { user: result.data }); // naviagte to User Dashboard
          }
        } else {
          setIsloading(false);
          return setError(result.message);
        }
      })
      .catch((error) => {
        setIsloading(false);
        console.log("error", setError(error.message));
      });
  };

  return (
    <InternetConnectionAlert onChange={(connectionState) => {}}>
    {/*  <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={styles.container}
      >  */}
        <ScrollView style={{ flex: 1, width: "100%",backgroundColor: "#040C2C" }}>
          <ProgressDialog visible={isloading} label={"Login ..."} />
          <StatusBar></StatusBar>
          <View style={styles.ViewlogoLow}>
            <Image
              style={styles.logoLow}
              source={require("../../assets/logo/willDashLogo.png")}
            />
          </View>
          <View style={styles.ViewLogo}>
            <Image
              style={styles.logo}
              source={require("../../assets/logo/marombaWill.png")}
            />
          </View>
          <View style={styles.welconeContainer}>
            <View>
              <Text style={styles.welcomeText}>Bem-vind@ á Willdash</Text>
              <Text style={styles.welcomeParagraph}>
                Aqui você transforma 
              </Text>
              <Text style={styles.welcomeParagraph}>
                energia em moedinhas
              </Text>
            </View>
            <View></View>
          </View>
          <View style={styles.screenNameContainer}>
            <Text style={styles.screenNameText}>Fazer Login</Text>
          </View>
         
        </ScrollView>
        <View style={styles.buttomContainer}>
          <CustomButton style={styles.bottaoContainerWhite} text={"Login"}onPress={() => navigation.navigate("loginIf")} />
          <CustomButton style={styles.signupText} text={"Cadastre-se"}onPress={() => navigation.navigate("signup")} />
        </View>
    {/*   </KeyboardAvoidingView>   */}
    </InternetConnectionAlert>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  welconeContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    margin: 0,
    //padding:15
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    
  },
  ViewLogo: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
   
    alignItems: "center",
    padding: 10,
    marginTop: 80,
  },

  ViewlogoLow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  logo: {
    resizeMode: "center",
    width: "100%",
    height: 320,
  },
  logoLow:{
    resizeMode: "center",
    width: "100%",
    height: 80,
  },
  welcomeText: {
    color: "#fff",
    fontFamily: "Montserrat-semiBold",
       fontSize: 22,
    textAlign: "center",
  },
  welcomeParagraph: {
  color: "white",
    fontFamily: "Montserrat",
    fontSize: 16,
    textAlign: "center",

    marginTop: 0,
  },
  forgetPasswordContainer: {
    marginTop: 0,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  ForgetText: {
    fontSize: 14,
    fontFamily: "Montserrat",
  },

  buttomContainer: {
    display: "flex",
    padding: 50,
    backgroundColor: "#040C2C",
    justifyContent: "center",
  },
  bottomContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#040C2C",
    color: "#FFF",
    justifyContent: "center",
  },
  signupText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  screenNameContainer: {
    marginBottom: 10,
    width: "100%",
    display: "flex",
       flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    
  },
  screenNameText: {
    fontFamily: "Montserrat-semiBold",
    fontSize: 16,
  },
});
