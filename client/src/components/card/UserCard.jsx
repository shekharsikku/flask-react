/* eslint-disable react/prop-types */
import "./UserCard.css";
import { toast } from "react-toastify";
import { IoMdCopy } from "react-icons/io";
import { CiCircleMore } from "react-icons/ci";

const UserCard = ({ user, openModal }) => {

  const copyToClipboard = (dataToCopy) => {
    try {
      const stringifiedData = JSON.stringify(dataToCopy, null, 2);
      navigator.clipboard.writeText(stringifiedData);
      toast.success("User details copied!");
    } catch (error) {
      toast.error("Failed to copy details!");
    }
  };

  return (
    <div id="user-card">
      <div className="user-card-title">
        <h2 className="user-card-name">{user.fullname}</h2>
        <p className="user-card-id">{user.id}</p>
      </div>
      <div className="user-card-details">
        <p className="user-card-username">
          <span>Username: </span> {user.username}
        </p>
        <p className="user-card-email">
          <span>Email: </span> {user.email}
        </p>
        <p className="user-card-date">
          <span>Registered On: </span>
          {new Date(user.date).toLocaleDateString()}
        </p>
      </div>
      <div className="action-buttons">
        <span onClick={() => { openModal(user, "view") }} className="view-button">View <CiCircleMore /></span>
        <span onClick={() => { copyToClipboard(user) }} className="edit-button">Copy <IoMdCopy /></span>
      </div>
    </div>
  );
};

export default UserCard;