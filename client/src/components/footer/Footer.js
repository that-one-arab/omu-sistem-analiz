import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <span className="ml-1">Created by </span>
        <a href="https://muhammed-aldulaimi.com" target="_blank" rel="noopener noreferrer">Muhammed Aldulaimi</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
