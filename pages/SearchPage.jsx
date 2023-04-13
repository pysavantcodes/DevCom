import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useCommunity } from "../contexts/CommunityContext";
import { useAuth } from "../contexts/AuthContext";
import {doc, updateDoc } from "firebase/firestore";
import { database } from "../firebase-config";
import { ActivityIndicator } from "react-native";

const SearchPage = ({ navigation }) => {
  const { communities } = useCommunity();
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const { userInfo } = useAuth();
  const [joining, setJoining] = useState(false)

  const join = async(e)=>{
      try {
        setJoining(true)
        if(e?.visibility == "public"){
          await updateDoc(doc(database, "communities", e.id),{
            members: [...e.members, userInfo?.email]
          }).then(()=>{
            setJoining(false)
          })
        }else{
          
        }
        
      } catch (err) {
        
      }
  }

  useEffect(() => {
    if (searchVal !== "") {
      setFilteredCommunities(
        communities?.filter((data) =>
          data?.name?.toLowerCase()?.includes(searchVal.toLowerCase())
        )
      );
    } else {
      setFilteredCommunities([]);
    }
  }, [searchVal, communities]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ padding: 20, paddingBottom: 15 }}>
        <Text style={{ fontFamily: "bold", fontSize: 20, color: "white" }}>
          Search
        </Text>
        <TextInput
          style={[styles.input]}
          selectionColor="rgba(255,255,255,0.4)"
          placeholderTextColor="rgba(255,255,255,0.4)"
          cursorColor={"white"}
          placeholder="Search for a community"
          onChangeText={(text) => setSearchVal(text)}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          paddingTop:10
        }}
      >
        <ScrollView contentContainerStyle={{paddingBottom:80}}>
          {filteredCommunities.length > 0 ?
            filteredCommunities?.map((data) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ChatScreen", { id: data?.id })
                  }
                  key={data?.id}
                  disabled={
                    data?.members?.includes(userInfo?.email) ? false : true
                  }
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomColor: "rgba(0,0,0,0.07)",
                          borderBottomWidth: 1,
                          paddingVertical:13
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      columnGap: 10,
                      width: "82%",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: "cover",
                        borderRadius: 40,
                      }}
                      source={{
                        uri: data?.profileImage,
                      }}
                    />
                    <View style={{ width: "100%" }}>
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={{
                          fontFamily: "medium",
                          fontSize: 15,
                          width: "75%",
                        }}
                      >
                        {data?.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "regular",
                          opacity: 0.7,
                        }}
                      >
                        {data?.visibility}
                      </Text>
                    </View>
                  </View>

                  {!data?.members?.includes(userInfo?.email) && (
                    <TouchableOpacity
                    disabled={joining}
                    onPress={()=>join(data)}
                      style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingHorizontal: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        width: "18%",
                      }}
                    >
                      {joining ? <ActivityIndicator color={"black"}/> :<Text style={{ fontSize: 15, fontFamily: "regular" }}>
                        {data?.visibility == "public" ? "Join" : "Request"}
                      </Text>}
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            }) : <Text>Search for a community</Text>}
        </ScrollView>
      </View>
    </View>
  );
};

export default SearchPage;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    marginVertical: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 6,
    color: "white",
  },
});
