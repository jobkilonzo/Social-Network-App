import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false)
  const userId = parseInt(useLocation().pathname.split("/")[2])
  const { currentUser } = useContext(AuthContext)
  const { isLoading, error, data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () =>
    makeRequest.get(`/users/find/${userId}`).then((res) => res.data),
});
const { data: relationshipData } = useQuery({
  queryKey: ['relationship', userId],
  queryFn: () =>
    makeRequest.get(`/relationships?followedUserId=${userId}`).then((res) => res.data),
  enabled: !!userId, 
});

const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) {
        return makeRequest.delete("/relationships?userId=" + userId);
      }
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["relationship"]);
    },
    onError: (error) => {
      console.error("Error toggling like:", error);
    }
  });


  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id))
  }


if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error fetching user data</p>;
if (!data) return <p>No user data found</p>;
  return (
    <div className="profile">
      <div className="images">
        <img
          src={"/upload/" +data.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={"/upload/" +data.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {userId ===currentUser.id?  
            (<button onClick={()=>setOpenUpdate(true)}>Update</button>) :
            <button onClick={handleFollow}>
              {relationshipData.includes(currentUser.id)? "Following":"follow"}
              </button>}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts userId={userId}/>
      </div>
      {openUpdate &&<Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  );
};

export default Profile;
