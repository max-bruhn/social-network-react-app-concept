import React, { useEffect, useState, useContext } from 'react'
import { useImmerReducer, useImmer } from 'use-immer'
import Page from './Page'
import { useParams, Link, withRouter } from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'
import NotFound from './NotFound'

const EditPost = (props) => {
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
    notFound: false,
  }

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case 'changedTitle':
        draft.title.hasErrors = false
        draft.title.value = action.value
        return
      case 'changedBody':
        draft.body.hasErrors = false
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
      case 'bodyRules':
        if (!action.value.trim()) {
          draft.body.hasErrors = true
          draft.body.message = 'no body provided'
        }
        return
      case 'notFound':
        draft.notFound = true
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
        if (response.data) {
          dispatch({ type: 'fetchComplete', value: response.data })
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: 'flashMessage', value: 'access forbidden' })
            props.history.push('/')
          }
        } else {
          dispatch({ type: 'notFound' })
        }
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

  if (state.notFound) {
    return <NotFound />
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: 'titleRules', value: state.title.value })
    dispatch({ type: 'bodyRules', value: state.body.value })
    dispatch({ type: 'submitRequest' })
  }

  return (
    <Page title="Edit Post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to posts
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
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
            onBlur={(e) => {
              dispatch({ type: 'bodyRules', value: e.target.value })
            }}
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
          {state.body.hasErrors && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving} type="submit">
          {state.isSaving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
