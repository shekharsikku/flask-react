/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'react-toastify';
import { useEffect, useContext, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaUsers } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import UserCard from "./card/UserCard";
import UserModal from './modal/UserModal';
import Loader from './loader/Loader';

const User = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { sessionUser, fetchAllUsers, setAllUsers, allUsers, addPost } = useContext(UserContext);

  const fetchUsers = async () => {
    setIsLoading(true);
    const response = await fetchAllUsers();
    if (sessionUser && response.success) {
      await setAllUsers(response.data);
    } else if (!response.success) {
      navigate("/");
      console.clear();
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  /** Handler state and function for change form */

  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  /** Handler state and function for add post */

  const initialState = { title: "", description: "", tag: "", location: "" };
  const [details, setDetails] = useState(initialState);
  const { title, description, tag, location } = details;

  const handleDetailsChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();

    startTransition(async () => {
      const response = await addPost(details);

      if (response.success) {
        toast.success(response.message);
        setDetails(initialState);
      } else {
        toast.error(response.message);
        console.clear();
      }
    });
  }

  /** State for open user modal and close modal for search and view user */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUser, setModalUser] = useState(null);
  const [modalType, setModalType] = useState("search");

  const openModal = (userForModal, typeForModal) => {
    setIsModalOpen(true);
    setModalUser(userForModal);
    setModalType(typeForModal);
  }
  const closeModal = () => {
    setIsModalOpen(false);
  }

  const removeStyles = {
    zIndex: 1,
    transition: 'none',
  }

  return (
    <div id="container" className={`container ${isActive ? 'active' : ''}`} >
      {isModalOpen ? (
        <div className="user-modal-container">
          <UserModal
            isOpen={isModalOpen}
            onClose={closeModal}
            modalUser={modalUser}
            modalType={modalType}
          />
        </div>
      ) : (
        <div style={isModalOpen ? removeStyles : null}>
          <div className="form-container register-form">
            <form onSubmit={handleDetailsSubmit}>
              <h1>Add Post</h1>
              <span>Share your thought or ideas?</span>
              <input type="text" placeholder="Title" name="title" autoComplete="off" required
                onChange={handleDetailsChange} value={title || ""} />
              <textarea placeholder="Description" name="description" autoComplete="off" required
                onChange={handleDetailsChange} value={description || ""} rows="3" />
              <input type="text" placeholder="Tag" name="tag" autoComplete="off" required
                onChange={handleDetailsChange} value={tag || ""} />
              <input type="text" placeholder="Location" name="location" autoComplete="off" required
                onChange={handleDetailsChange} value={location || ""} />
              <Link to="/post">Preview All Posts?</Link>
              <button type="submit" disabled={isPending}>Add Post</button>
            </form>
          </div>
          <div className="form-container login-form all-users-form">
            {isLoading ? (
              <Loader />
            ) : (
              <form>
                <h1>All Users</h1>
                <span>All available users detail!</span>
                <div className="all-users-container">
                  {allUsers && allUsers ? allUsers.map(user => (
                    <UserCard user={user} key={user.id} openModal={openModal} />
                  )) : (
                    <div className="not-available">
                      No any user available!
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Welcome, Back!</h1>
                <p>Preview all available users details and info across the site for interaction!</p>
                <button className="hidden" id="all-user" onClick={handleLoginClick}>
                  User <FaUsers size={13} /></button>
                <p>Preview your personal detail and info across the site feature!</p>
                <button className="hidden" id="details-preview" onClick={() => navigate("/detail")}>Detail</button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Welcome, User!</h1>
                <p>Share your personal thought or ideas so user can interact with your ideas!</p>
                <button className="hidden" id="add-post" onClick={handleRegisterClick}>Add Post</button>
                <p>Search user by their username if you want to interact with them!</p>
                <button className="hidden" id="search-user-button" onClick={() => { openModal(null, "search") }}>
                  Search <CiSearch size={12} /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}

export default User;