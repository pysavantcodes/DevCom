import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { auth, database } from "../firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const AuthContext = React.createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [isOffline, setOfflineStatus] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        setLoadingUser(false);
        setUser(JSON.parse(storedUser));
      }else{
        setLoadingUser(false);
      }
      
    };

    getUser();
  }, []);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoadingUserInfo(true);
      try {
        await onSnapshot(doc(database, "users", user.email), (doc) => {
          setUserInfo(doc.data());
        });
        setLoadingUserInfo(false);
      } catch (err) {
        setLoadingUserInfo(false);
      }
    };
    fetchUserInfo();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        setUser,
        setLoading,
        loading,
        userInfo,
        loadingUserInfo,
        showSheet,
        setShowSheet,
        isOffline,
        setOfflineStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
