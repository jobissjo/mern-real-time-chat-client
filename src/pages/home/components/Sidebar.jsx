import React, { useState } from 'react'
import Search from './search'
import UserList from './UserList'

const Sidebar = () => {
    const [searchKey, setSearchKey] = useState('')
  return (
    <div className="app-sidebar">
        <Search searchKey={searchKey}
          setSearchKey={setSearchKey}
         />
        <UserList searchKey={searchKey} />
    </div>
  )
}

export default Sidebar