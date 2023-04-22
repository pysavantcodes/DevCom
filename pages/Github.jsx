import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { Image } from "react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Snackbar } from "@react-native-material/core";
import { ActivityIndicator } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { database } from "../firebase-config";
import { useGithub } from "../contexts/GithubContext";
import LoadingUserPage from "../components/LoadingUserPage";
import Feather from "react-native-vector-icons/Feather";
import RepoContentModal from "../components/RepoContentModal";

const Github = () => {
  const { userInfo } = useAuth();
  const [accName, setAccName] = useState("");
  const [snackBarData, setSnackBarData] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [creating, setCreating] = useState(false);
  const [repo, setRepo] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  
  const {
    githubUserDetails,
    fetchingUserDetails,
    getGithubUserDetails,
    repos,
    getAllRepos,
  } = useGithub();

  const connectAccount = async () => {
    setCreating(true);
    const res = await fetch(`https://api.github.com/users/${accName}`);
    const status = await res.status;
    if (status === 404) {
      setShowSnackBar(true);
      setSnackBarData("User not found on github");
      setCreating(false);
    } else if (status === 200) {
      setCreating(false);
      await updateDoc(doc(database, "users", userInfo?.email), {
        githubAcc: accName,
      });
    }
  };

  

  useEffect(() => {
    if (showSnackBar === true) {
      setTimeout(() => {
        setShowSnackBar(false);
      }, 1000);
    }
  }, [showSnackBar]);

  return (
    <ScrollView
      horizontal={false}
      overScrollMode="never"
      contentContainerStyle={{
        flex: 1,
        backgroundColor: !userInfo?.githubAcc ? "white" : "black",
        alignItems: !userInfo?.githubAcc ? "center" : "flex-start",
        justifyContent: !userInfo?.githubAcc ? "center" : "flex-start",
      }}
    >
      {!userInfo?.githubAcc ? (
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            padding: 30,
            height: "60%",
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              alignSelf: "center",
              marginBottom: 30,
            }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
            }}
          />
          <TextInput
            value={accName}
            onChangeText={(text) => setAccName(text)}
            selectionColor={"rgba(0,0,0,0.7)"}
            style={[styles.input]}
            placeholder={"Enter your github username"}
          />
          <TouchableOpacity
            onPress={() => connectAccount()}
            disabled={accName === "" || creating ? true : false}
            style={[
              styles.button,
              { opacity: accName === "" || creating ? 0.6 : 1 },
            ]}
          >
            {creating ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text
                style={{
                  fontFamily: "regular",
                  color: "white",
                  textAlign: "center",
                }}
              >
                Connect Account
              </Text>
            )}
          </TouchableOpacity>
          <Text
            style={{
              opacity: 0.6,
              fontFamily: "regular",
              fontSize: 12,
              textAlign: "center",
              paddingTop: 10,
            }}
          >
            *View and Share your works with communities
          </Text>
        </View>
      ) : !fetchingUserDetails && userInfo?.githubAcc ? (
        <View style={{ flex: 1, width: "100%" }}>
          {modalOpen && <RepoContentModal
            isOpen={modalOpen}
            repoOwner={userInfo?.githubAcc}
            repoName={repo}
            onClose={() => setModalOpen(false)}
          />}
          <View
            style={{
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              columnGap: 15,
            }}
          >
            <Image
              style={{ width: 80, height: 80, borderRadius: 10, resizeMode:"cover" }}
              source={{ uri: githubUserDetails?.avatar_url }}
            />
            <View>
              <Text
                style={{ color: "white", fontFamily: "bold", fontSize: 23 }}
              >
                {githubUserDetails?.name ? githubUserDetails?.name : "---"}
              </Text>
              <Text
                style={{ color: "white", fontFamily: "regular", opacity: 0.7 }}
              >
                @{githubUserDetails?.login}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 15,
            }}
          >
            <ScrollView
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={githubUserDetails ? false : true}
                  onRefresh={() => {
                    getGithubUserDetails();
                    getAllRepos();
                  }}
                />
              }
              horizontal={false}
            >
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: 18,
                  paddingBottom: 15,
                  paddingTop: 20,
                }}
              >
                Your Repositories
              </Text>
              {repos.length > 0 ? (
                repos.map((repo) => {
                  return (
                    <View
                      key={repo.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 15,
                        columnGap: 14,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          borderBottomColor: "rgba(0,0,0,0.07)",
                          borderBottomWidth: 1,
                          padding: 13,
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            columnGap: 10,
                            width: "70%",
                            alignItems: "center",
                          }}
                        >
                          <Feather name="git-pull-request" size={15} />
                          <Text
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            style={{
                              fontFamily: "medium",
                              fontSize: 15,
                              maxWidth: "70%",
                            }}
                          >
                            {repo?.name}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setRepo(repo?.name);
                          setModalOpen(true);
                        }}
                        style={{
                          backgroundColor: "rgba(0,0,0,0.9)",
                          padding: 10,
                          borderRadius: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Feather
                          color={"white"}
                          name="chevron-right"
                          size={18}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 20,
                  }}
                >
                  <Text style={{ fontFamily: "regular" }}>
                    No repositories found
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      ) : (
        <LoadingUserPage style={{paddingBottom: 110,}} />
      )}
      {showSnackBar && (
        <Snackbar
          message={snackBarData}
          style={{ position: "absolute", start: 16, end: 16, bottom: 80 }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  input: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderColor: "rgba(0,0,0,0.4)",
    borderWidth: 0.7,
    borderRadius: 6,
    fontFamily: "regular",
    marginBottom: 10,
  },
});

export default Github;
