import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import Post from './Post'

const Search = () => {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: '',
    results: [],
    show: 'neither',
    requestCount: 0,
  })

  useEffect(() => {
    document.addEventListener('keyup', searchKeyPressHandler)

    return () => {
      document.removeEventListener('keyup', searchKeyPressHandler)
    }
  }, [])

  useEffect(() => {
    if (state.searchTerm.trim()) {
      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++
          draft.show = 'loading'
        })
      }, 1000)
      return () => clearTimeout(delay)
    } else {
      setState((draft) => {
        draft.show = 'neither'
      })
    }
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount && state.searchTerm.length) {
      const ourRequest = Axios.CancelToken.source()
      const fetchResults = async () => {
        try {
          const response = await Axios.post('/search', { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
          setState((draft) => {
            draft.results = response.data
            draft.show = 'results'
          })
        } catch (error) {
          console.error(error)
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.requestCount])

  const searchKeyPressHandler = (e) => {
    if (e.keyCode == 27) {
      closeSearch()
    }
  }

  const closeSearch = () => {
    appDispatch({ type: 'closeSearch' })
  }

  const handleInput = (e) => {
    const value = e.target.value
    setState((draft) => {
      draft.searchTerm = value
    })
  }

  return (
    <>
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
          <span onClick={closeSearch} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className="live-search-results live-search-results--visible">
            <div className="list-group shadow-sm">
              <div className={'dots-loading ' + (state.show == 'loading' ? '' : 'hide')}>
                <div></div>
              </div>

              <div className={state.show == 'results' ? '' : 'hide'}>
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.results.length}
                  {state.results.length == 1 ? ' item ' : ' items '} found)
                </div>
                {state.results.map((post) => {
                  return <Post post={post} key={post._id} click={closeSearch} />
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
