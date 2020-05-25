import React from 'react'
import Page from './Page'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Can not find that page</h2>
        <p className="lead text-muted">
          Go back to <Link to="/">Homepage</Link>
        </p>
      </div>
    </Page>
  )
}

export default NotFound
