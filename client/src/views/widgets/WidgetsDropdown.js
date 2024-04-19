import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { useSelector } from 'react-redux'
import {
  CWidgetDropdown,
  CRow,
  CCol
} from '@coreui/react'
import { crntYear, crntMonth } from "."
import customFetch from '../../custom-fetch';

const Widget = ({color, fetchFrom, pushToLink, text}) => {
  const history = useHistory()
  const [state, setState] = useState("0")

  const fetchAndSetState = async () => {
      const res = await customFetch(fetchFrom, {
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      });
      if (res.status === 200) {
        const data = await res.json();
        setState(data.count)
      }
  };

  useEffect(() => {
    fetchAndSetState()
    //eslint-disable-next-line
  }, [])
  return (
    <CWidgetDropdown
      onClick = {() => history.push(`${pushToLink}`)}
      style = {{height: "130px", cursor: "pointer"}}
      color={color} 
      header={state}
      text={text}
    >
    </CWidgetDropdown>
  )
}

const currentMonth = crntMonth()
const currentYear = crntYear()
const currentDay = new Date().getDate()

const WidgetsDropdown = () => {
  const userInfo = useSelector(state => state.reducer.loggedInUserInfo)
  const userRole = userInfo.loggedInRole

  return (
    <CRow>
      <CCol sm="6" lg="3">
        <Widget 
          color = "gradient-primary"
          fetchFrom = {`/applications/count?status=approved&day=${currentDay}&month=${currentMonth}&year=${currentYear}`}
          pushToLink = {`/bayi/islemler/rapor?q=&status=approved&day=${currentDay}&month=${currentMonth}&year=${currentYear}`}
          text = "Bugünkü Onaylanan Satışlarınız"
        />
      </CCol>

      <CCol sm="6" lg="3">
        <Widget 
          color = "gradient-info"
          fetchFrom = {`/applications/count?status=rejected&day=${currentDay}&month=${currentMonth}&year=${currentYear}`}
          pushToLink = {`/bayi/islemler/rapor?q=&status=rejected&day=${currentDay}&month=${currentMonth}&year=${currentYear}`}
          text = "Bugünku Sıkıntılı Satışlarınız"
        />
      </CCol>

      <CCol sm="6" lg="3">
        <Widget 
          color = "gradient-warning"
          fetchFrom = {`/applications/count?status=approved&month=${currentMonth}&year=${currentYear}`}
          pushToLink = {`/bayi/islemler/rapor?q=&status=approved&month=${currentMonth}&year=${currentYear}`}
          text = "Bu Ayki Genel Satışlar"
        />
      </CCol>

      <CCol sm="6" lg="3">
      {
        userRole === "dealer"?
        <Widget 
          color = "gradient-danger"
          fetchFrom = "/report/transactions/count"
          pushToLink = "/bayi/rapor/kazanc"
          text = "Bu Ayki Kazancınız"
        />
        :
        <Widget 
          color = "gradient-danger"
          fetchFrom = {`/applications/count?status=approved&year=${currentYear}`}
          pushToLink = {`/bayi/islemler/rapor?q=&status=approved&year=${currentYear}`}
          text = "Bu Seneki Genel Satışlar"
        />
      }
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown;