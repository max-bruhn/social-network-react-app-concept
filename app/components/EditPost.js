import React, { useEffect, useState, useContext } from 'react'
import { useImmerReducer, useImmer } from 'use-immer'
import Page from './Page'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

const ViewSinglePost = (props) => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

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
      case 'changedTitle':
        draft.title.value = action.value
        return
      case 'changedBody':
        draft.body.value = action.value
        return
      case 'submitRequest':
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++
        }
        return
      case 'saveRequestStarted':
        draft.isSaving = true
        return
      case 'saveRequestFinished':
        draft.isSaving = false
        return
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasErrors = true
          draft.title.message = 'no title provided'
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    // handles inital load of the post
    const ourRequest = Axios.CancelToken.source()

    const fetchPost = async () => {
      try {
        const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
        dispatch({ type: 'fetchComplete', value: response.data })
      } catch (error) {
        console.error(error)
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  useEffect(() => {
    // handles save updates
    if (state.sendCount) {
      dispatch({ type: 'saveRequestStarted' })
      const ourRequest = Axios.CancelToken.source()

      const fetchPost = async () => {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            { cancelToken: ourRequest.token }
          )
          dispatch({ type: 'saveRequestFinished' })
          appDispatch({ type: 'flashMessage', value: 'Post updated!' })
        } catch (error) {
          console.error(error)
        }
      }
      fetchPost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [state.sendCount])

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'titleRules', value: state.title.value })
    dispatch({ type: 'submitRequest' })
  }

  return (
    <Page title="Edit Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={(e) => {
              dispatch({ type: 'changedTitle', value: e.target.value })
            }}
            onBlur={(e) => {
              dispatch({ type: 'titleRules', value: e.target.value })
            }}
            autoFocus
            value={state.title.value}
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {state.title.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={(e) => {
              dispatch({ type: 'changedBody', value: e.target.value })
            }}
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
        </div>

        <button className="btn btn-primary" disabled={state.isSaving} type="submit">
          {state.isSaving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Page>
  )
}

export default ViewSinglePost
