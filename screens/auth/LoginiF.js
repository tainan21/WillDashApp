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
  import Logo from "../../assets/logo/logoSvg.svg";
  
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
          <ScrollView style={{ flex: 1, width: "100%" }}>
            <ProgressDialog visible={isloading} label={"Login ..."} />
            <StatusBar></StatusBar>
            <View style={styles.ViewLogo}>
              <Image
                style={styles.logo}
                source={require("../../assets/logo/logoDog.png")}
              />
            </View>
            <View style={styles.welconeContainer}>
              <View>
                <Text style={styles.welcomeText}>Bem vindo</Text>
                <Text style={styles.welcomeParagraph}>
                  Falta pouco para começar a
                </Text>
                <Text style={styles.welcomeParagraph}>
                  presentear seu amiguinho!
                </Text>
              </View>
              <View></View>
            </View>
            <View style={styles.screenNameContainer}>
              <Text style={styles.screenNameText}>Fazer Login</Text>
            </View>
            <View style={styles.formContainer}>
              <CustomAlert message={error} type={"error"} />
              <CustomInput
                value={email}
                setValue={setEmail}
                placeholder={"Usuário"}
                placeholderTextColor={colors.muted}
                radius={40}
              />
              <CustomInput
                value={password}
                setValue={setPassword}
                secureTextEntry={true}
                placeholder={"Senha"}
                placeholderTextColor={colors.muted}
                radius={40}
              />
              <View style={styles.forgetPasswordContainer}>
                <Text
                  onPress={() => navigation.navigate("forgetpassword")}
                  style={styles.ForgetText}
                >
                  Esqueci a senha
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.buttomContainer}>
            <CustomButton text={"Login"} onPress={loginHandle} />
          </View>
          <View style={styles.bottomContainer}>
            <Text>Não tem uma conta?</Text>
            <Text
              onPress={() => navigation.navigate("signup")}
              style={styles.signupText}
            >
              Criar
            </Text>
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
      backgroundColor: "#040C2C",
      alignItems: "center",
      justifyContent: "center",
      padding: 30,
      flex: 1,
    },
    welconeContainer: {
      width: "100%",
      display: "flex",
      backgroundColor: "#040C2C",

      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      //padding:15
    },
    formContainer: {
      marginTop: -10,

      backgroundColor: "#040C2C",
      flex: 2,
      justifyContent: "flex-start",
      alignItems: "center",
      display: "flex",
      width: "100%",
      flexDirecion: "row",
      padding: 20,
      
    },
    ViewLogo: {
      width: "100%",
      display: "flex",
      backgroundColor: "#040C2C",

      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      marginTop: 80,
    },
  
    logo: {
      resizeMode: "center",
      height: 220,
    },
    welcomeText: {
      color: "#557CD2",
      fontFamily: "Montserrat-semiBold",
      fontSize: 24,
      textAlign: "center",
    },
    welcomeParagraph: {
      color: "black",
      fontFamily: "Montserrat",
      fontSize: 20,
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
      flexDirection: "row",
      justifyContent: "center",
    },
    bottomContainer: {
      marginTop: 10,
      marginBottom: 15,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    signupText: {
      marginLeft: 2,
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
    },
    screenNameContainer: {
      marginBottom: 10,
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: "#040C2C",

      alignItems: "center",
    },
    screenNameText: {
      fontFamily: "Montserrat-semiBold",
      fontSize: 16,
    },
  });
  