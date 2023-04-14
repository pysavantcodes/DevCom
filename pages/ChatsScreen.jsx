import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Ant from "react-native-vector-icons/AntDesign";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import { useCommunity } from "../contexts/CommunityContext";
import { database } from "../firebase-config";
import {
  FieldValue,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { FlatList } from "react-native";

const ChatsScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [community, setCommunity] = useState({});
  const [message, setMessage] = useState("");
  const [matchingDocs, setMatchingDocs] = useState(null);
  const q = query(collection(database, "communities"), where("id", "==", id));
  const { userInfo } = useAuth();
  const listRef = useRef();
  const { allUsers } = useCommunity();

  useEffect(() => {
    const getCommunity = async () => {
      const querySnapshot = await getDocs(q);
      setMatchingDocs(querySnapshot.docs);
      onSnapshot(q, (snapShot) => {
        snapShot.forEach((data) => {
          setCommunity(data.data());
        });
      });
    };
    getCommunity();
  }, []);

  useEffect(() => {
    const readMessage = async () => {
      if (community?.messages) {
        const updatedMessages = community?.messages?.map((message) => {
          const readBy = message?.readBy || [];
          if (!readBy.includes(userInfo?.email)) {
            readBy.push(userInfo?.email);
          }
          return {
            ...message,
            readBy,
          };
        });
        await updateDoc(doc(database, "communities", id), {
          messages: updatedMessages,
        });
      }
    };
    readMessage();
  }, [community]);

  const sendMessage = async () => {
    const newMessage = {
      message: message.trim(),
      sender: userInfo.email,
      time: Date.now(),
      readBy: [userInfo?.email],
    };
    setMessage("");

    if (community?.messages?.length === 0) {
      await updateDoc(matchingDocs[0].ref, {
        messages: [newMessage],
      });
    } else {
      await updateDoc(matchingDocs[0].ref, {
        messages: [...community?.messages, newMessage],
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.head}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Chats")}
          style={{
            width: 40,
            height: 40,
            backgroundColor: "rgba(255,255,255,0.08)",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 40,
          }}
        >
          <Ant name="arrowleft" size={20} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            columnGap: 8,
            alignItems: "center",
            flex: 1,
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              resizeMode: "cover",
              borderRadius: 40,
              borderColor: "rgba(255,255,255,0.1)",
              borderWidth: 1,
            }}
            source={{ uri: community.profileImage }}
          />
          <View style={{ flex: 1 }}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                fontSize: 15,
                fontFamily: "medium",
                maxWidth: "87%",
                color: "white",
              }}
            >
              {community.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "regular",
                opacity: 0.5,
                color: "white",
              }}
            >
              {community?.members?.length === 2
                ? `You and 1 other`
                : `You and ${community?.members?.length - 1} others`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <ScrollView
          ref={listRef}
          overScrollMode="never"
          contentContainerStyle={{ padding: 10, paddingBottom: 70 }}
          horizontal={false}
          onContentSizeChange={() =>
            listRef.current.scrollToEnd({ animated: true })
          }
        >
          {community?.messages &&
            community?.messages?.map((item) => {
              const user = allUsers.filter(
                (user) => user.email === item.sender
              );
              return (
                <View
                  key={item?.time}
                  style={{
                    flexDirection: "row",
                    marginBottom: 10,
                    justifyContent:
                      user[0].email === userInfo.email
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  {user[0].email !== userInfo.email && (
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 30,
                        resizeMode: "cover",
                        marginRight: 10,
                      }}
                      source={{ uri: user[0].profileImage }}
                    />
                  )}

                  <View
                    style={{
                      maxWidth: "70%",
                      backgroundColor:
                        user[0].email !== userInfo.email
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(0,0,0,1)",
                      padding: 10,
                      paddingHorizontal: 15,
                      borderRadius: 20,
                    }}
                  >
                    {user[0].email !== userInfo.email && (
                      <Text
                        style={{
                          fontFamily: "medium",
                          fontSize: 12.5,
                        }}
                      >
                        {user[0].userName}
                      </Text>
                    )}
                    <Text
                      style={{
                        fontFamily: "regular",
                        color:
                          user[0].email === userInfo.email ? "white" : "black",
                      }}
                    >
                      {item.message}
                    </Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderColor: "rgba(0,0,0,0.5)",
            borderWidth: 0.4,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
          }}
        >
          <Ant color={"black"} name="plus" size={23} />
        </TouchableOpacity>
        <TextInput
          multiline
          style={{
            color: "black",
            fontSize: 15,
            fontFamily: "regular",
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.05)",
            padding: 5,
            paddingHorizontal: 10,
            paddingLeft: 15,
            borderRadius: 20,
            borderColor: "rgba(0,0,0,0.1)",
            borderWidth: 0.8,
          }}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Message"
          selectionColor="rgba(0,0,0,0.4)"
          cursorColor={"black"}
          placeholderTextColor="rgba(0,0,0,0.4)"
          maxHeight={100}
        />
        <TouchableOpacity
          onPress={() => sendMessage()}
          disabled={
            message.length < 1 || message.trim().length === 0 ? true : false
          }
          style={{
            width: 40,
            height: 40,
            backgroundColor: "black",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 30,
            opacity:
              message.length < 1 || message.trim().length === 0 ? 0.7 : 1,
          }}
        >
          <Ionicons color={"white"} name="send" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatsScreen;

const styles = StyleSheet.create({
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flexDirection: "row",
    width: "100%",
    columnGap: 10,
    padding: 10,
    borderTopColor: "rgba(0,0,0,0.1)",
    borderTopWidth: 0.8,
    backgroundColor: "#f9fafb",
    zIndex: 9,
  },
  head: {
    flexDirection: "row",
    padding: 15,
    columnGap: 14,
    borderBottomColor: "rgba(0,0,0,0.1)",
    borderBottomWidth: 0.8,
    paddingVertical: 12,
  },
});
