import React from 'react'
import Sidebar from "../sidebar/Sidebar"
import Header from "../header/Header.jsx"
import Footer from '../footer/Footer'
import Content from "../content/Content"
const Layout = () => {
  return (
    <div className="c-app c-default-layout">
      <Sidebar/>
      <div className="c-wrapper">
        <Header/>
        <div className="c-body">
          <Content/>
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default Layout