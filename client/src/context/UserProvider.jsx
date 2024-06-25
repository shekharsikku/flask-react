/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
  /** User Auth Provider */

  const [sessionUser, setSessionUser] = useState(null);

  const registerLoginUser = async (url, data) => {
    try {
      const response = await axios.post(url, data);
      return response.data
    } catch (error) {
      return error.response.data;
    }
  }

  const logoutCurrentUser = async () => {
    try {
      const response = await axios.delete("/api/user/logout");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const currentSessionUser = async () => {
    try {
      const response = await axios.get("/api/user/session");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const updateUserDetails = async (url, data) => {
    try {
      const response = await axios.patch(url, data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const deleteUserDetails = async (id, data) => {
    try {
      const response = await axios.post(`/api/user/delete/user/${id}`, data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  /** User Detail Provider */

  const [allUsers, setAllUsers] = useState(null);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("/api/user/fetch");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const fetchUser = async (id) => {
    try {
      const response = await axios.get(`/api/user/fetch/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const findUserByUsername = async (username) => {
    try {
      const response = await axios.get(`/api/user/fetch/user?username=${username}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  /** Post Provider */

  const addPost = async (data) => {
    try {
      const response = await axios.post("/api/post/add", data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const [allPosts, setAllPosts] = useState(null);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("/api/post/fetch");
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const fetchPost = async (id) => {
    try {
      const response = await axios.get(`/api/post/fetch/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const deletePost = async (id) => {
    try {
      const response = await axios.delete(`/api/post/delete/post/${id}`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  const editPost = async (id, data) => {
    try {
      const response = await axios.patch(`/api/post/edit/post/${id}`, data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }

  return (
    <UserContext.Provider value={{
      /** User Auth Provider */
      registerLoginUser,
      logoutCurrentUser,
      currentSessionUser,
      sessionUser,
      setSessionUser,
      updateUserDetails,
      deleteUserDetails,
      /** User Detail Provider */
      fetchAllUsers,
      allUsers,
      setAllUsers,
      fetchUser,
      findUserByUsername,
      /** Post Provider */
      addPost,
      fetchAllPosts,
      allPosts,
      setAllPosts,
      fetchPost,
      deletePost,
      editPost,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserProvider };