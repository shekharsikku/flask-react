/* eslint-disable react/prop-types */
import "./PostCard.css";
import { CiCircleMore, CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from 'react-toastify';
import { useContext } from "react";
import { UserContext } from '../../context/UserContext';

const PostCard = ({ post, editExistingPost, openModal }) => {
  const { fetchAllPosts, setAllPosts, deletePost } = useContext(UserContext);

  const deletePostById = async (id) => {
    const response = await deletePost(id);
    if (response.success) {
      toast.success(response.message);
      const posts = await fetchAllPosts();
      await setAllPosts(posts.data);
    } else {
      toast.warning(response.message);
      console.clear();
    }
  }

  return (
    <div className="post-card">
      <div className="post-card-title">
        <h2 className="post-card-name">{post.title}</h2>
        <p className="post-card-id">{post.id}</p>
      </div>
      <p className="post-card-tag">
        <span>Tag:</span> {post.tag}
      </p>
      <p className="post-card-location">
        <span>Location:</span> {post.location}
      </p>
      <p className="post-card-date">
        <span>Posted On: </span>
        {new Date(post.date).toLocaleDateString()}
      </p>
      <div className="action-buttons">
        <span onClick={() => { openModal(post) }} className="view-button">View <CiCircleMore /></span>
        {/* {isAllowAction && <> */}
          <span onClick={() => { editExistingPost(post) }} className="edit-button">Edit <CiEdit /></span>
          <span onClick={() => deletePostById(post.id)} className="del-button">Del <AiOutlineDelete /></span>
        {/* </>} */}
      </div>
    </div >
  )
}

export default PostCard;