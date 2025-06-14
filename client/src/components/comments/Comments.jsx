import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import { makeRequest } from "../../axios";
const Comments = ({postId}) => {

  const [desc, setDesc] = useState("")
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery({
    queryKey: ['comments'],
    queryFn: () =>
      makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data),
  });

  const queryClient = useQueryClient()
 
  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]); 
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    }


  });
  const handleClick = async e => {
    e.preventDefault()
    mutation.mutate({desc, postId})
    setDesc("")
  
  }
  
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input 
        type="text" 
        placeholder="write a comment"
        value={desc}
        onChange={(e)=> setDesc(e.target.value)} 
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? "Loading" : data.map((comment) => (
        <div key={comment.id} className="comment">
          <img src={comment.profilePic} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
