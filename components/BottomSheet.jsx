import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import FthIcon from "react-native-vector-icons/Feather";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { database, storage } from "../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import getCurrentDateTime from "./getCurrentDateTime";
import { Keyboard } from "react-native";
import * as FileSystem from 'expo-file-system'
import { Alert } from "react-native";
const { height, width } = Dimensions.get("screen");

const BSheet = ({ navigation }) => {
  const { setLoading, userInfo } = useAuth();
  const [image, setImage] = useState(null);
  const [communityName, setCommunityName] = useState(null);
  const [communityMode, setCommunityMode] = useState("public");
  const [imageError, setImageError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const getFileInfo = async (fileURI) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI)
    return fileInfo
 }

  useEffect(() => {
    if (imageError) {
      setTimeout(() => {
        setImageError(false);
      }, 3000);
    } else if (nameError) {
      setTimeout(() => {
        setNameError(false);
      }, 3000);
    }
  }, [imageError, nameError]);

  const pickFiles = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        
      });
      

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        console.log(result.assets[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createCommunity = async () => {
    if (!communityName || !description) {
      setNameError(true);
    } else if (image) {
      const fileInfo = await getFileInfo(image)
      if(fileInfo.size / 1024 / 1024 < 3){
        try {
          setLoading(true);
          const response = await fetch(image);
          const blob = await response.blob();
          const imageRef = ref(storage, "images/" + Date.now());
  
          const uploadTask = uploadBytesResumable(imageRef, blob);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
  
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  const newId = Date.now()
                  await setDoc(doc(database, "communities", newId), {
                    name: communityName,
                    description,
                    visibility: communityMode,
                    profileImage: downloadURL,
                    createdAt: getCurrentDateTime(),
                    id: newId,
                    members: [userInfo.email],
                    messages:[]
                  }).then(() => {
                    setLoading(false);
                    navigation.navigate("Chats");
                    setDescription(null);
                    setCommunityName(null);
                    setImage(null);
                  });
                }
              );
            }
          );
        } catch (error) {
          
        }
      }else{
        Alert.alert(
          'Error',
          'Image Size too large',
          [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ],
          {
            cancelable: true,

          },
        );
      }
    } else {
      setLoading(true);
      const newId = new Date().getTime().toString()
      await setDoc(doc(database, "communities", newId), {
        name: communityName,
        description,
        visibility: communityMode,
        profileImage:
          "https://cdn.raceroster.com/assets/images/team-placeholder.png",
        createdAt: getCurrentDateTime(),
        id: newId,
        members: [userInfo.email],
        messages:[]
      }).then(() => {
        setLoading(false);
        navigation.navigate("Chats");
        setDescription(null);
        setCommunityName(null);
        setImage(null);
      });
    }
  };

  return (
    <ScrollView
      bounces={false}
      overScrollMode={"never"}
      contentContainerStyle={[
        styles.container,
        { paddingBottom: keyboardHeight === 0 ? 74 : 0 },
      ]}
    >
      <View
          style={{
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontFamily: "bold", color:"white" }}>
            Create a Community
          </Text>
        </View>
      <Animated.View style={[styles.sheet]}>
        
        <ScrollView
          bounces
          showsVerticalScrollIndicator={false}
          scrollEnabled
          overScrollMode={"never"}
          contentContainerStyle={{
            paddingBottom: 0,
            padding: 20,
            paddingTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: "medium",
              paddingTop: 7,
              opacity: 0.7,
            }}
          >
            Enter Community Name
          </Text>
          <TextInput
            placeholder="e.g: JS Devs..."
            selectionColor="rgba(0,0,0,0.4)"
            placeholderTextColor="rgba(0,0,0,0.4)"
            cursorColor={"black"}
            value={communityName}
            maxLength={35}
            style={[
              styles.input,
              {
                fontSize: 14,
                fontFamily: "regular",
                ...(!nameError && { marginBottom: 15 }),
              },
            ]}
            onChangeText={(e) => {
              setCommunityName(e);
            }}
          />
          {nameError && (
            <Text
              style={{
                color: "red",
                fontFamily: "regular",
                fontSize: 13,
                marginBottom: 15,
              }}
            >
              This Field Cannot be empty
            </Text>
          )}
          <Text
            style={{
              fontSize: 15,
              fontFamily: "medium",
              paddingTop: 7,
              opacity: 0.7,
            }}
          >
            Description
          </Text>
          <TextInput
            placeholder="Community description"
            selectionColor="rgba(0,0,0,0.4)"
            placeholderTextColor="rgba(0,0,0,0.4)"
            multiline
            cursorColor={"black"}
            numberOfLines={6}
            textAlignVertical="top"
            value={description}
            style={[
              styles.input,
              {
                paddingTop: 14,
                fontSize: 14,
                fontFamily: "regular",
                ...(!nameError && { marginBottom: 15 }),
              },
            ]}
            onChangeText={(e) => {
              setDescription(e);
            }}
          />
          {nameError && (
            <Text
              style={{
                color: "red",
                fontFamily: "regular",
                fontSize: 13,
                marginBottom: 15,
              }}
            >
              This Field Cannot be empty
            </Text>
          )}
          <Text
            style={{
              fontSize: 15,
              fontFamily: "medium",
              paddingBottom: 7,
              opacity: 0.7,
            }}
          >
            Select Profile Image
          </Text>
          <TouchableOpacity
            onPress={() => pickFiles()}
            style={{
              ...(!imageError && { marginBottom: 9 }),
              height: 200,
              overflow: "hidden",
              borderRadius: 10,
              borderWidth:.7,
    borderColor:"rgba(0,0,0,0.3)",
            }}
          >
            <IonIcon
              color={"white"}
              style={{ position: "absolute", top: 0, right: 0 }}
              name="ios-trash-outline"
            />

            <Image
              source={
                image
                  ? { uri: image }
                  : {
                      uri: "https://www.teamworkpartnership.co.uk/admin/blogimages/151_149_blg.jpg",
                    }
              }
              style={{ width: "100%", height: "100%", resizeMode: "cover", opacity:image ? 1:.3 }}
            />
          </TouchableOpacity>
          {imageError && (
            <Text
              style={{
                color: "red",
                fontFamily: "regular",
                fontSize: 13,
                marginBottom: 9,
              }}
            >
              Please Select an Image
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{ marginRight: 10, fontSize: 15, fontFamily: "medium" }}
            >
              Visibility:{" "}
            </Text>
            <Text
              onPress={() => setCommunityMode("public")}
              style={{
                fontSize: 15,
                fontFamily: "regular",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.04)",
                marginRight: 5,
                ...(communityMode === "public" && {
                  backgroundColor: "black",
                  color: "white",
                }),
              }}
            >
              Public
            </Text>
            <Text
              onPress={() => setCommunityMode("private")}
              style={{
                fontSize: 15,
                fontFamily: "regular",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: "rgba(0,0,0,0.07)",
                ...(communityMode === "private" && {
                  backgroundColor: "black",
                  color: "white",
                }),
              }}
            >
              Private
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => createCommunity()}
          >
            <Text style={{ fontFamily: "regular", color: "white" }}>
              Create
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "black",
    
  },
  button: {
    padding: 15,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderRadius: 6,
  },

  sheet: {
    width: "100%",
    flex: 1,
    backgroundColor:"white",borderTopLeftRadius:20, borderTopRightRadius:20
  },
  closeButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 50,
  },
  input: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginVertical: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
    borderWidth:.5,
    borderColor:"rgba(0,0,0,0.3)"
  },
});

export default BSheet;
