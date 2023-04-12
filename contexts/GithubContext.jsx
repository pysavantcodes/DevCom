import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { database } from "../firebase-config";
import { useAuth } from "./AuthContext";

const GithubContext = React.createContext();
export const useGithub = () => {
  return useContext(GithubContext);
};

const GithubProvider = ({ children }) => {
  const [githubUserDetails, setGithubUserDetails] = useState(null);
  const [fetchingUserDetails, setFetchingUserDetails] = useState(false)
  const [repos, setRepos] = useState([])
  const { userInfo } = useAuth();

  const getGithubUserDetails = async () => {
    if (userInfo?.githubAcc) {
      setFetchingUserDetails(true)
      const res = await fetch(
        `https://api.github.com/users/${userInfo?.githubAcc}`
      );
      const data = await res.json(); 
      setFetchingUserDetails(false)
      setGithubUserDetails(data)
    }
  };
  const getAllRepos = async () => {
    if (userInfo?.githubAcc) {
      setFetchingUserDetails(true)
      const res = await fetch(
        `https://api.github.com/users/${userInfo?.githubAcc}/repos`
      );
      const data = await res.json(); 
      setFetchingUserDetails(false)
      setRepos(data)
    }
  };
  useEffect(() => {
    getGithubUserDetails();
    getAllRepos()
  }, [userInfo]);

  return (
    <GithubContext.Provider value={{ githubUserDetails, fetchingUserDetails, getGithubUserDetails, getAllRepos, repos }}>
      {children}
    </GithubContext.Provider>
  );
};

export default GithubProvider;
