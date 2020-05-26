import React, { useEffect, useContext } from 'react'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'

const Search = () => {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: '',
    results: [],
    show: 'neither',
    requestCount: 0,
    isFetching: false,
  })

  useEffect(() => {
    document.addEventListener('keyup', searchKeyPressHandler)

    return () => {
      document.removeEventListener('keyup', searchKeyPressHandler)
    }
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      setState((draft) => {
        draft.requestCount++
      })
    }, 1000)

    return () => clearTimeout(delay)
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount && state.searchTerm.length) {
      // show fetching icons at start of search
      setState((draft) => {
        draft.isFetching = true
      })

      const ourRequest = Axios.CancelToken.source()
      const fetchResults = async () => {
        try {
          const response = await Axios.post('/search', { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
          setState((draft) => {
            draft.results = response.data
            draft.isFetching = false
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

  const SearchResults = () => {
    return (
      <div>
        <div className="list-group-item active">
          <strong>Search Results</strong> (3 items found)
        </div>
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
          <span className="text-muted small">by brad on 2/10/2020 </span>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" /> <strong>Example Post #2</strong>
          <span className="text-muted small">by barksalot on 2/10/2020 </span>
        </a>
        <a href="#" className="list-group-item list-group-item-action">
          <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
          <span className="text-muted small">by brad on 2/10/2020 </span>
        </a>
      </div>
    )
  }

  return (
    <div className="search-overlay">
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
            <div className="list-group shadow-sm">{state.isFetching ? <LoadingDotsIcon /> : <SearchResults />}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
