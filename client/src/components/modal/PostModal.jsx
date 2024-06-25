/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import "./PostModal.css";
import { useContext, useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import { useDebounce } from "../../hooks/useDebounce";
import Loader from "../loader/Loader";

const PostModal = ({ isOpen, onClose, modalPost }) => {
  const { fetchUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    if (modalPost) {
      const response = await fetchUser(modalPost.uid);
      if (response.success) {
        setUserDetails(response.data);
      } else {
        console.clear();
      }
    }
  }

  const debouncedChangeHandler = useDebounce(async () => {
    fetchUserDetails();
  }, 1000);

  useEffect(() => {
    debouncedChangeHandler();
  }, []);

  if (!isOpen) return null;
  if (!userDetails) return <Loader />

  return (
    <div className="post-modal-overlay">
      <div className="post-modal">
        <div className="post-modal-details">
          <p>
            <span>Posted On: </span>
            {new Date(modalPost.date).toLocaleDateString()},
            <span> At: </span>
            {new Date(modalPost.date).toLocaleTimeString()}
          </p>
          <span className="post-modal-close-button"><MdOutlineClose size={22} onClick={onClose} /></span>
        </div>
        <div className="post-modal-content">
          <h3 className="post-modal-title">{modalPost.title}</h3>
          <p className="post-modal-description">{modalPost.description}</p>
          <h5 className="post-modal-tag">{modalPost.tag}</h5>
        </div>
        <div className="post-modal-details">
          <p><span>Posted By: </span>{userDetails?.fullname}({userDetails?.username})</p>
          <p><span> From: </span>{modalPost.location}</p>
        </div>
      </div>
    </div>
  );
};

export default PostModal;