import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

// import CIcon from '@coreui/icons-react'
// import VarolLogo from "../../icons/VarolLogo.png"
// import VarolLogoText from "../../icons/VarolLogoText.png"

// sidebar nav config
import { bayi_nav, satisdestek_nav, satisdestekchef_nav } from './_nav'

import "./sidebar.css"

const TheSidebar = () => {
  const role = useSelector(state => state.reducer.loggedInUserInfo.loggedInRole)
  const [nav, setNav] = useState([]);
  useEffect(() => {
    switch (role) {
      case "dealer":
        setNav(bayi_nav)
        break;
      case "sales_assistant":
        setNav(satisdestek_nav)
        break;
      case "sales_assistant_chef":
        setNav(satisdestekchef_nav)
        break;
      default:
        break;
    }
  }, [role])

  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarState.sidebarShow)

  return (
    <CSidebar
      className = "sidebar"
      show={show}
      onShowChange={(val) => {
        dispatch({type: 'set', sidebarShow: val })
        }}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={nav}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
