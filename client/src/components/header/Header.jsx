import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CButton,
} from '@coreui/react'
import { Link } from "react-router-dom"
import TheHeaderDropdown from "./TheHeaderDropdown"
import "./theheader.css"

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarState.sidebarShow)
  const userInfo = useSelector(state => state.reducer.loggedInUserInfo)
  const { loggedInName, loggedInRole, loggedInBalance } = userInfo

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/anasayfa">Ana Sayfa</CHeaderNavLink>
        </CHeaderNavItem>
        {
          loggedInRole === "dealer" ?
          <CHeaderNavItem className="px-3">
            <Link to = "/basvuru/yeni" ><CButton block variant="outline" color="primary">Yeni Başvuru</CButton></Link>
          </CHeaderNavItem>
          :
          null
        }
      </CHeaderNav>
      <CHeaderNav className="px-3">
        <div className="headerNavLinkFontFlex">
          <p className = "headerNavLinkFontWelcome">Bakiyeniz</p>
          <h6 className = "headerNavLinkFontUser">{Number(loggedInBalance).toFixed(2)}</h6>
        </div>
      </CHeaderNav>
      <CHeaderNav className="px-3">
        <div className="headerNavLinkFontFlex">
          <p className = "headerNavLinkFontWelcome">Hoş Geldiniz</p>
          <h6 className = "headerNavLinkFontUser">{loggedInName}</h6>
        </div>
        <TheHeaderDropdown/>
      </CHeaderNav>
    </CHeader>
  )
}

export default TheHeader;