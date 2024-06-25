/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'react-toastify';
import { useEffect, useContext, useState, useTransition, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import PostCard from './card/PostCard';
import PostModal from './modal/PostModal';
import Loader from './loader/Loader';

const Post = () => {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const { sessionUser, fetchAllPosts, setAllPosts, allPosts, editPost, } = useContext(UserContext);

  /** For fetch all posts that are shared by all users */

  const fetchPosts = async () => {
    setIsLoading(true);
    const response = await fetchAllPosts();
    if (sessionUser && response.success) {
      await setAllPosts(response.data);
    } else if (!response.success) {
      navigate("/");
      console.clear();
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  /** Handler state and function for change form */

  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = async () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  /** Get existing post through onclick reference for edit post */

  const ref = useRef(null);
  const [existingPost, setExistingPost] = useState(null);

  const editExistingPost = (currentPost) => {
    setExistingPost(currentPost);
    if (currentPost.uid === sessionUser.id) {
      ref.current.click();
    } else {
      toast.warn("You can't edit this post!");
      setExistingPost(null);
      console.clear();
    }
  }

  /** Handler state and function for update post details */

  const initialPostState = { title: "", description: "", tag: "", location: "" };
  const [postDetails, setPostDetails] = useState(initialPostState);
  const { title, description, tag, location } = postDetails;

  const handlePostEditChange = (e) => {
    const { name, value } = e.target;
    setPostDetails({ ...postDetails, [name]: value });
  };

  const handlePostEditSubmit = async (e) => {
    e.preventDefault();

    const updatePostObject = {
      title: title === "" ? existingPost.title : title,
      description: description === "" ? existingPost.description : description,
      tag: tag === "" ? existingPost.tag : tag,
      location: location === "" ? existingPost.location : location,
    }

    startTransition(async () => {
      const response = await editPost(existingPost.id, updatePostObject);

      if (response.success) {
        toast.success(response.message);
        setExistingPost(null);
        setPostDetails(initialPostState);
        await fetchPosts();
      } else {
        toast.error(response.message);
        setExistingPost(null);
        setPostDetails(initialPostState);
        console.clear();
      }
    });
  }

  /** State for open modal and close modal for view post */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPost, setModalPost] = useState(null);

  const openModal = (postForModal) => {
    setIsModalOpen(true);
    setModalPost(postForModal);
  }
  const closeModal = () => {
    setIsModalOpen(false);
    setModalPost(null);
  }

  const removeStyles = {
    zIndex: 1,
    transition: 'none',
  }

  const isAllowAction = sessionUser && sessionUser.id === existingPost?.uid;

  return (
    <div id="container" className={`container ${isActive ? 'active' : ''}`}>
      {isModalOpen ? (
        <div className="post-modal-container">
          <PostModal
            isOpen={isModalOpen}
            onClose={closeModal}
            modalPost={modalPost}
          />
        </div>
      ) : (
        <div style={isModalOpen ? removeStyles : null}>
          <div className="form-container register-form">
            <form onSubmit={handlePostEditSubmit}>
              <h1>Edit Post</h1>
              <span>{existingPost ? existingPost?.id : "Please, select post to edit!"}</span>
              <input type="text" placeholder="Title" name="title" autoComplete="off" required
                onChange={handlePostEditChange} value={title || existingPost?.title || ""} disabled={!isAllowAction} />
              <textarea placeholder="Description" name="description" autoComplete="off" required
                onChange={handlePostEditChange} value={description || existingPost?.description || ""} rows="3"
                disabled={!isAllowAction} />
              <input type="text" placeholder="Tag" name="tag" autoComplete="off" required
                onChange={handlePostEditChange} value={tag || existingPost?.tag || ""} disabled={!isAllowAction} />
              <input type="text" placeholder="Location" name="location" autoComplete="off" required
                onChange={handlePostEditChange} value={location || existingPost?.location || ""}
                disabled={!isAllowAction} />
              <Link to="/user">Add More Posts?</Link>
              <button type="submit" disabled={isPending || !isAllowAction}>Update Post</button>
            </form>
          </div>
          <div className="form-container login-form all-posts-form">
            {isLoading ? (
              <Loader />
            ) : (
              <form>
                <h1>All Posts</h1>
                <span>All features posts!</span>
                <div className="all-posts-container">
                  {allPosts ? allPosts.map(post => (
                    <PostCard post={post} key={post.id} editExistingPost={editExistingPost} openModal={openModal} />
                  )) : (
                    <div className="not-available">
                      No any post available!
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
                <p>Preview all available users shared thoughts and posts for interaction with them!</p>
                <button className="hidden" id="all-post" onClick={handleLoginClick}>All Post</button>
                <p>Preview your personal detail and info across the site feature!</p>
                <button className="hidden" id="preview-details" onClick={() => navigate("/detail")}>Preview</button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Welcome, User!</h1>
                <p>Edit your shared thought or ideas if you made some mistakes in it!</p>
                <button className="hidden" id="edit-post" onClick={handleRegisterClick} ref={ref}>Edit Post</button>
                <p>Share your personal thought or ideas so user can interact with your ideas!</p>
                <button className="hidden" id="add-post" onClick={() => navigate("/user")}>Add Post</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}

export default Post;