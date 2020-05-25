import React, { useEffect, useState, useContext } from 'react'
import Page from './Page'
import { useParams, Link, withRouter } from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import ReactMarkdown from 'react-markdown'
import ReactTooltip from 'react-tooltip'
import NotFound from './NotFound'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

const ViewSinglePost = (props) => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${id}`)
        setPost(response.data)
        setIsLoading(false)
        console.log('response.data')
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username
    }
    return false
  }

  const deleteHandler = async () => {
    const areYouSure = window.confirm('sure?')
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: {
            token: appState.user.token,
          },
        })
        if (response.data == 'Success') {
          appDispatch({ type: 'flashMessage', value: 'Post deleted!' })
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" classNane="custom-tooltip" />{' '}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger" title="Delete">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" classNane="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={['paragraph', 'strong', 'emphasis', 'text', 'heading', 'list']} />
      </div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
