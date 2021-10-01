import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput } from '@coreui/react'
import { setHeaderColor, renderMiddleTextArea, forRoleSetFormLabel, renderFooterTextArea } from '.'
import { useSelector } from "react-redux"
import "./AppDataForm.css"
// import { useHistory } from 'react-router'
import React from 'react'

const AppDataForm = ({isEditable, userDetails, setSdDetay}) => {
    const userRole = useSelector(state => state.reducer.loggedInUserInfo.loggedInRole)
    const forRoleSetFields = forRoleSetFormLabel(userRole)
    // const [clientAppImageURLS, setClientAppImageURLS] = React.useState([])
    // const history = useHistory()
    // React.useEffect(() => {
    //   if (userDetails.imageURLS)
    //     setClientAppImageURLS(userDetails.imageURLS)
    // }, [])
    return(
    <CRow className = "justify-content-center align-items-center">
        <CCol xs="12" sm="12">
          <CCard>
            <CCardHeader className = "basvuru-detay-header" style = {{backgroundColor: setHeaderColor(userDetails)}}>
              <h4>Başvuru Detay</h4>
              {/* <CCol sm = "2" className = "basvuru-detay-header-buttonCol">
                <CButton active block color="secondary" aria-pressed="true" onClick = {() => history.goBack()}>
                    Geri
                 </CButton>
              </CCol> */}
            </CCardHeader>
            <CCardBody className = "basvuru-detay" >
              <CFormGroup row className="my-0">
                <CCol xs="2">
                  <CFormGroup>
                    <CLabel>ID</CLabel>
                    <CInput placeholder= {userDetails.ID} readOnly />
                  </CFormGroup>
                </CCol>
                <CCol xs="10">
                  <CFormGroup>
                    <CLabel>İsim</CLabel>
                    <CInput placeholder={userDetails.İsim} readOnly />
                  </CFormGroup>
                </CCol>
              </CFormGroup>
              <CFormGroup row className="my-0">
                <CCol xs="2">
                  <CFormGroup>
                    <CLabel>Tarih</CLabel>
                    <CInput placeholder= {userDetails.Tarih} readOnly />
                  </CFormGroup>
                </CCol>
                <CCol xs="3">
                  <CFormGroup>
                    <CLabel>Hizmet</CLabel>
                    <CInput placeholder={userDetails.Hizmet} readOnly />
                  </CFormGroup>
                </CCol>
                <CCol xs="7">
                  <CFormGroup>
                    <CLabel>Kampanya</CLabel>
                    <CInput placeholder={userDetails.Kampanya} readOnly />
                  </CFormGroup>
                </CCol>
              </CFormGroup>
              {renderMiddleTextArea(userDetails)}
              {renderFooterTextArea(setSdDetay, userRole, userDetails, forRoleSetFields)}
              <CFormGroup row>
              {
                userDetails.imageURLS && userDetails.imageURLS.map ((elm, i) => {
                  return (
                    <CCol md="4" key = {i}>
                      <a href = {elm} target = "_blank" rel = "noreferrer" >
                        <img alt = "" style = {{maxWidth: "200px", maxHeight: "200px", cursor: "pointer"}}
                        src = {elm} 
                        />
                      </a>
                    </CCol>
                  )
                })
              }
              </CFormGroup>
            </CCardBody>
          </CCard>
        </CCol>
    </CRow>
    )
}

export default AppDataForm