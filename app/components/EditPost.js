import React, { useEffect, useState } from 'react'
import { useImmerReducer, useImmer } from 'use-immer'
import Page from './Page'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'

const ViewSinglePost = () => {
  const initialState = {
    title: {
      value: '',
      hasErrors: false,
      message: '',
    },
    body: {
      value: '',
      hasErrors: false,
      message: '',
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  }

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  // const { id } = useParams()
  // const [isLoading, setIsLoading] = useState(true)
  // const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`)
        dispatch({ type: 'fetchComplete', value: response.data })
        // setPost(response.data)
        // setIsLoading(false)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  return (
    <Page title="Edit Post">
      <form>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus value={state.title.value} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={state.body.value} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
        </div>

        <button className="btn btn-primary">Save</button>
      </form>
    </Page>
  )
}

export default ViewSinglePost
