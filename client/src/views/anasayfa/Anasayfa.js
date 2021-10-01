import React, { lazy } from 'react'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardBody
} from '@coreui/react'

// import MainChartExample from '../charts/MainChartExample'
const SdcKullanicilar = lazy(() => import ("../sdckullanicilar/SdcKullanicilar"))
const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const BasvuruTakibi = lazy(() => import("../basvurutakibi/BasvuruTakibi"))
const HedefProgress = lazy(() => import("../hedefprogress/HedefProgress"))

const Anasayfa = () => {

  const userInfo = useSelector(state => state.reducer.loggedInUserInfo)
  if (userInfo.loggedInRole === "sales_assistant_chef")
    return (
    <>
      {/* The 4 data widgets */}
      <WidgetsDropdown />
      <CCard>
        <CCardBody>
          <SdcKullanicilar />
        </CCardBody>
      </CCard>
    </>
    )
  else
    return (
      <>
        <WidgetsDropdown />
        <HedefProgress />
        <BasvuruTakibi />
      </>
    )
  
}

export default Anasayfa