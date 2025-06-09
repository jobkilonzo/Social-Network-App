import React, { useState } from 'react'
import "./update.scss"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
const Update = ({ setOpenUpdate, user }) => {
    const [cover, setCover] = useState(null)
    const [profile, setProfile] = useState(null)
    const [texts, setTexts] = useState({
        name: '',
        city: '',
        website: ''
    })
    const queryClient = useQueryClient()

    const upload = async (file) => {
        try {
            const formData = new FormData()
            formData.append("file", file)
            const res = await makeRequest.post("/upload", formData)
            return res.data
        } catch (err) {
            console.log(err)
        }
    }
 
  const mutation = useMutation({
    mutationFn: (user) => makeRequest.put("/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]); 

    },
    onError: (error) => {
      console.error("Error creating post:", error);
    }
  });
  const handleClick = async e => {
    e.preventDefault()
    let coverUrl
    let profileUrl

    coverUrl = cover ? await upload(cover) : user.coverPic
    profileUrl = profile ? await upload(profile) : user.profilePic

    mutation.mutate({...texts, coverPic: coverUrl, profilePic: profileUrl})
    setOpenUpdate(false)
  }
    const handleChange = (e) => {
        setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }))
    }
    return (
        <div className='update'>
            Update
            <form action="">
                <input type="file" onChange={e=>setCover(e.target.files[0])}/>
                <input type="file"  onChange={e=>setProfile(e.target.files[0])}/>
                <input type="text" name='name' onChange={handleChange} />
                <input type="text" name='city' onChange={handleChange} />
                <input type="text" name='website' onChange={handleChange} />
                <button onClick={handleClick}>Update</button>
            </form>
            <button onClick={() => setOpenUpdate(false)}>X</button>
        </div>
    )
}

export default Update
