import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CButton, CSelect } from '@coreui/react'
import { useSelector, useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom'
import HocLoader from '../hocloader/HocLoader'
import "./style.css"
import { mapUsersData } from '.'
import customFetch from '../../custom-fetch';

const fetchUserLoginDate = async (id) => {
  const res = await customFetch(`/user/${id}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'authorization' :`Bearer ${document.cookie.slice(8)} `
    }
  })
  if (res.status === 200) {
    const data = await res.json()
    return data
  }
}

const fetchSalesData = async (id, service, status, month, year) => {
  try {
    const res = await customFetch(`/applications/count/?service=${service}&status=${status}&userID=${id}&month=${month}&year=${year}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    if (res.status === 200) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
  }
}

const mapYears = () => {
  let dateArr = []
  for (let i = new Date().getFullYear(); i >= 2000; i--) {
    dateArr.push(i)
  }
  return dateArr
}

const mapMonths = () => {
  const firstMonth = 1
  let dateArr = ["HEPSI"]
  for (let i = 12; i >= firstMonth; i--) {
    dateArr.push(i)
  }
  return dateArr
}

const years = mapYears()
const months = mapMonths()

const SdcKullanici = ({match}) => {
  const { id } = match.params
  const history = useHistory()
  const [userLoginDataLoading, setUserLoginDataLoading] = useState(true)
  const [userLoginData, setUserLoginData] = useState({id: 0, username:"", role:""})
  const [salesdata, setSalesData] = useState([])
  const [salesReportLoading, setSalesReportLoading] = useState(false)

  const month = useSelector(state => state.reducer.sdc.actions.selectedMonth)
  const year = useSelector(state => state.reducer.sdc.actions.selectedYear)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userDataFetch = await fetchUserLoginDate(id)
        const mappedUserData = mapUsersData(userDataFetch)
        setUserLoginData(mappedUserData[0])
        setUserLoginDataLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllData()
  }, [id])
  useEffect(() => {
    const fetchData = async () => {
      const allData = await fetchSalesData(id, "MAP", "ALL", month, year)
      console.log('allData ', allData)
      setSalesData(allData)
      setSalesReportLoading(false)
    }
    setSalesReportLoading(true)
    fetchData()
  }, [id, month, year])
  if (userLoginData !== undefined)
  return (
      <CRow className = "justify-content-center align-items-center">
        <CCol xs="12" sm="8">
      <HocLoader isLoading = {salesReportLoading} absolute >
            <CCard>
              <CCardHeader>
                <CRow>
                  <CCol>
                    <h5>Kullanıcı Detay</h5>
                  </CCol>
                  <CCol sm = "2">
                    <CButton active block color="secondary" aria-pressed="true" id = "sdcKullanici-backButton" onClick = {() => {
                      history.push("/sdc/kullanicilar")
                    }}>Geri</CButton>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody className = "basvuru-detay" >
                <HocLoader isLoading = {userLoginDataLoading} absolute = {true}>
                  <CFormGroup row className="my-0">
                    <CCol lg="12" xl = "3" >
                      <CFormGroup>
                        <CLabel>ID</CLabel>
                        <CInput placeholder= {userLoginData.ID} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol lg="12" xl = "3">
                      <CFormGroup>
                        <CLabel>İsim</CLabel>
                        <CInput placeholder={userLoginData.Kullanıcı} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol lg="12" xl = "3">
                      <CFormGroup>
                        <CLabel>Röl</CLabel>
                        <CInput placeholder={userLoginData.Röl} readOnly />
                      </CFormGroup>
                    </CCol>
                    <CCol lg="12" xl = "3">
                      <CFormGroup>
                        <CLabel>Kayıt tarihi</CLabel>
                        <CInput placeholder={userLoginData.Kayıt_tarihi} readOnly />
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                </HocLoader>
                <div className = "sdcKullainici-divider" style = {{marginBottom: "20px"}}></div>
                <CFormGroup className="my-0 p-2 justify-content-center align-items-center" row >
                  <CCol lg = "6">
                    <h5>İşlem Raporu</h5>
                  </CCol>
                  <CCol>
                    <h5> Tarih aralığı seçiniz</h5>
                  </CCol>
                  <CCol>
                    <CRow>
                      <CCol>
                        <CLabel>Ay</CLabel>
                        <CSelect onChange = {(e) => dispatch({type: "SDC_ACTION_SET_MONTH", payload: e.target.value})} >
                          {
                            months && months.map(month => (
                              <option value = {month === "HEPSI" ? 0 : month} key = {month}> {month} </option>
                            ))
                          }
                        </CSelect>
                      </CCol>
                      <CCol>
                        <CLabel>Sene</CLabel>
                        <CSelect onChange = {(e) => dispatch({type: "SDC_ACTION_SET_YEAR", payload: e.target.value})} >
                          {
                            years && years.map(year => (
                              <option value = {year} key = {year}> {year} </option>
                            ))
                          }
                        </CSelect>
                      </CCol>
                    </CRow>
                  </CCol>
                </CFormGroup>
                <div className = "sdcKullainici-divider"></div>
                {
                  salesdata.map((obj, i) => {
                    return (
                      <div key = {i+10}>
                      <CFormGroup row>
                        <CCol>
                          <CLabel><strong>{obj.service}</strong></CLabel>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row className="justify-content-center">
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel> Toplam</CLabel>
                            <CInput placeholder= {Number(obj.approvedCount) + Number(obj.rejectedCount) + Number(obj.sentCount) + Number(obj.processingCount)} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>Onaylanan</CLabel>
                            <CInput placeholder={obj.approvedCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>Gönderilen</CLabel>
                            <CInput placeholder={obj.sentCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>İşlenen</CLabel>
                            <CInput placeholder={obj.processingCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2">
                          <CFormGroup>
                            <CLabel>İptal edilen</CLabel>
                            <CInput placeholder={obj.rejectedCount} readOnly />
                          </CFormGroup>
                        </CCol>
                        <CCol sm = "6" lg="2" >
                          <CFormGroup>
                            <CLabel col></CLabel>
                            <CButton onClick = {() => history.push(`/sdc/islemler?service=${obj.service_id}&id=${userLoginData.ID}&month=${month}&year=${year}`)} color = "success" ><i className="fas fa-arrow-right"></i></CButton>
                          </CFormGroup>
                        </CCol>
                        <div className = "sdcKullainici-divider"></div>

                      </CFormGroup>
                      </div>
                    )
                  })
                }
              </CCardBody>
            </CCard>
        </HocLoader>
        </CCol>
      </CRow>
  )
    else
    return(
    <CRow className = "justify-content-center align-items-center">
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol>
                <h4>HATA</h4>
              </CCol>
              <CCol sm = "2" className = "basvuru-detay-header-buttonCol">
                <CButton active block color="secondary" aria-pressed="true" onClick = {() => {
                  history.push("/sdc/kullanicilar")
                }}>Geri</CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody style = {{textAlign: "center"}} >
            <h1>Böyle bir kullanıcı yok</h1>
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  )
}

export default SdcKullanici