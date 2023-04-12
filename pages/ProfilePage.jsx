import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Ic from "react-native-vector-icons/SimpleLineIcons";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { database, storage } from "../firebase-config";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

const ProfilePage = () => {
  const { userInfo, setUser, setLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const logOut = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    setNewName(userInfo?.userName);
  }, []);

  const updateUserName = async () => {
    setLoading(true);
    await updateDoc(doc(database, "users", userInfo?.email), {
      userName: newName,
    })
      .then(() => {
        setIsEditing(false);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const getFileInfo = async (fileURI) => {
    const fileInfo = await FileSystem.getInfoAsync(fileURI);
    return fileInfo;
  };

  const updateProfileImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const fileInfo = await getFileInfo(result.assets[0].uri);
        if (fileInfo.size / 1024 / 1024 < 3) {
          try {
            setLoading(true);
            console.log(result.assets[0].uri);
            const response = await fetch(result.assets[0].uri);
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
                    await updateDoc(doc(database, "users", userInfo?.email), {
                      profileImage: downloadURL
                    }).then(() => {
                      setLoading(false);
                    });
                  }
                );
              }
            );
          } catch (error) {}
        } else {
          Alert.alert(
            "Error",
            "Image Size too large",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
            ],
            {
              cancelable: true,
            }
          );
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          padding: 18,
          backgroundColor: "white",
          zIndex: 9,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "bold",
          }}
        >
          My Profile
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: 15 }}
        overScrollMode="never"
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            rowGap: 5,
          }}
        >
          <TouchableOpacity
            style={{
              width: 90,
              height: 90,
              borderRadius: 90,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: "black",
            }}
            onPress={()=>updateProfileImage()}
          >
            <Image
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
              source={{
                uri: userInfo?.profileImage,
              }}
            />
          </TouchableOpacity>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 5,
                justifyContent: "center",
              }}
            >
              <TextInput
                style={{
                  fontSize: isEditing ? 15 : 19,
                  fontFamily: "medium",
                  textAlign: "center",
                  color: "black",
                  paddingHorizontal: isEditing ? 5 : 0,
                  borderBottomWidth: isEditing ? 1 : 0,
                }}
                selectionColor="rgba(0,0,0,0.7)"
                placeholder={"username"}
                onChangeText={(text) => setNewName(text)}
                value={newName}
                editable={isEditing}
                autoFocus
              />
              {isEditing ? (
                <TouchableOpacity
                  style={{ opacity: newName?.length < 3 ? 0.5 : 1 }}
                  disabled={newName.length < 3}
                  onPress={() => updateUserName()}
                >
                  <Feather name="check" size={19} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Feather name="edit-3" size={19} />
                </TouchableOpacity>
              )}
            </View>
            <Text
              style={{
                fontFamily: "regular",
                opacity: 0.6,
                textAlign: "center",
                fontSize: 13,
              }}
            >
              {userInfo?.email}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => logOut()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            columnGap: 8,
            justifyContent: "center",
            paddingTop: 20,
          }}
        >
          <Ic name="logout" color="red" size={16} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "medium",
              textAlign: "center",
              color: "red",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({});
