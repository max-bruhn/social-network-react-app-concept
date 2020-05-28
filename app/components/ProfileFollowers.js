import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import LoadingDotsIcon from './LoadingDotsIcon'

const ProfileFollowers = () => {
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    const fetchPosts = async () => {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token })
        setPosts(response.data)
        setIsLoading(false)
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [username, posts])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {posts.length >= 1 &&
        posts.map((follower, id) => {
          return (
            <Link key={id} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={follower.avatar} />
              {follower.username}
            </Link>
          )
        })}
      {posts.length == 0 && (
        <div className="list-group">
          <p>No followers. </p>
        </div>
      )}
    </div>
  )
}

export default ProfileFollowers
