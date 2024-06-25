/* eslint-disable react/prop-types */
import "./UserModal.css";
import { toast } from "react-toastify";
import { useContext, useState } from 'react';
import { MdOutlineClose } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import { useDebounce } from "../../hooks/useDebounce";
import Loader from "../loader/Loader";

const UserModal = ({ isOpen, onClose, modalUser, modalType }) => {
  const { findUserByUsername } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const [displayValue, setDisplayValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedChangeHandler = useDebounce(async (value) => {
    setIsLoading(true);
    const response = await findUserByUsername(value);
    setDisplayValue(response);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
      console.clear();
    }
    setIsLoading(false);
  }, 1500);

  const handleChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length > 3) {
      debouncedChangeHandler(value);
    }
  };

  if (!isOpen) return null;
  if (isLoading) return <Loader />;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <div className="user-modal-heading">
          {!modalUser && modalType === "search" ? (
            <>
              <div className="user-modal-title">
                <h2>Search user by username?</h2>
                <MdOutlineClose size={22} onClick={onClose} className="user-modal-close-button" />
              </div>
              <input type="search" id="user-modal-search-input" value={inputValue} onChange={handleChange}
                placeholder="Enter username?" autoComplete="off" autoFocus />
            </>
          ) : (
            <div className="user-modal-title">
              <h2>Viewing {modalUser?.fullname} details!</h2>
              <MdOutlineClose size={22} onClick={onClose} className="user-modal-close-button" />
            </div>
          )}
        </div>
        <div className="user-modal-content">
          {displayValue?.success || modalUser ? (
            <>
              <h1 className="user-modal-fullname">{displayValue?.data?.fullname || modalUser?.fullname}</h1>
              <p className="user-modal-id">{displayValue?.data?.id || modalUser?.id}</p>
              <h3 className="user-modal-username">{displayValue?.data?.username || modalUser?.username}</h3>
              <h4 className="user-modal-email">{displayValue?.data?.email || modalUser?.email}</h4>
              <p className="user-modal-date">{displayValue?.data?.date || modalUser?.date}</p>
            </>
          ) : (
            <h2 className="user-modal-not-found">{displayValue?.message}</h2>
          )}
        </div>
        {displayValue && <div className="user-modal-details">
          <p><span>Date: </span>{new Date(displayValue?.timestamp).toDateString()}</p>
          <p><span>Time: </span>{new Date(displayValue?.timestamp).toTimeString()}</p>
        </div>}
      </div>
    </div>
  )
}

export default UserModal;