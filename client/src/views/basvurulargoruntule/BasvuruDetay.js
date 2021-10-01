import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormGroup, CLabel, CInput, CTextarea, CButton } from '@coreui/react'
import "./basvurudetay.css"
import { useHistory } from 'react-router-dom'
import Modal from "../../components/modals/Modal"
import { mapDataToTurkish } from '../../components/index'

const BasvuruDetay = ({match}) => {
  const applicationID = match.params.id

  const fetchData = async (setUserDetails) => {
    const res = await fetch(`/applications/${applicationID}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    if (res.status === 200) {
      const data = await res.json()
      const mappedData = mapDataToTurkish(data)
      setUserDetails(mappedData[0])
    }
  }

  const renderBasvuruDetayFooter = (details) => {
    // if the application is on Hold (first status change)
    if (details.submitProcessNum === 2) {
      return (
        <div id = "basvuruDetay-footerButtons">
          {/* Here "true" in updateApp refers to sp optional parameter, if true it modifies the urlString in fetch */}
          <CButton onClick = {() => updateApp("rejected", true)} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
          <CButton onClick = {()=> updateApp("approved", true)} size="md" color="success" className = "">
          <i className="fas fa-check-circle"></i> ONAYLA</CButton>
        </div>
      )
    }
    // if the applications has been approved or denied (second status change)
    else if (details.submitProcessNum === 3) {
      return null
    // else return first process submission
    } else {
      return (
        <div id = "basvuruDetay-footerButtons">
          <CButton onClick = {() => updateApp("rejected")} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
          <CButton onClick = {()=> updateApp("processing")} size="md" color="warning" className = "basvuru-detay-submit-buttons-submit" >
          <i className="fas fa-arrow-circle-up"></i> İŞLE</CButton>
        </div>
      )
    }
  }
  const renderTextArea = (details) => {
    if (details.submitProcessNum === 2) {
      return (
          <CFormGroup row>
            <CCol>
              <CLabel>Bayi Açıklaması</CLabel>
              <CTextarea 
                rows="8"
                placeholder={userDetails.Açıklama}
                readOnly
              />
            </CCol>
            <CCol>
              <CLabel>Önceki Notlarınız</CLabel>
              <CTextarea
                rows="8"
                placeholder={userDetails.salesRepDetails}
                readOnly
              />
            </CCol>
          </CFormGroup>
      )
    }
    else if (details.submitProcessNum === 3) {
      return (
        <CFormGroup>
          <CLabel>Bayi Açıklaması</CLabel>
          <CTextarea 
            rows="4"
            placeholder={userDetails.Açıklama}
            readOnly
          />
      </CFormGroup>
      )
    } else {
      return (
        <CFormGroup>
          <CLabel>Bayi Açıklaması</CLabel>
          <CTextarea 
            rows="4"
            placeholder={userDetails.Açıklama}
            readOnly
          />
        </CFormGroup>
      )
    }
  }

  // UPDATE APPLICATION FETCH REQUEST
  const updateApp = async (statusChange, sp = false) => {
    let urlString
    if (sp)
      urlString= `/basvurular/${match.params.id}/sp`
    else urlString= `/basvurular/${match.params.id}`
    const res = await fetch(urlString, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)}`
      },
      body: JSON.stringify({
            salesRepDetails: sdDetay,
            statusChange: statusChange
            })
    })
    if (res.status === 200) {
      await fetchData(setUserDetails)
      setModalDetails(modalSuccess)
      setModal(true)
    } else {
      setModalDetails(modalFailure)
      setModal(true)
    }
  }
  const setHeaderColor = (details) => {
    switch (details.Statü) {
      case "İşleniyor":
        return "rgb(214, 160, 11)"
      case "İptal":
        return "rgb(212, 69, 13)"
      case "Onaylandı":
        return "rgb(55, 150, 55)"
      default:
        return "rgb(120, 138, 151)"
    }
  }
  const [sdDetay, setSdDetay] = useState("")
  const modalSuccess = {
    header: "BAŞARILI",
    body: "Başvurunuz başarıyla güncellenmiştir",
    color: "success"
  }
  const modalFailure = {
    header: "HATA",
    body: "Bir hata olmuştur, lütfen sayfayı yenileyerek tekrar deneyin",
    color: "danger"
  }
  const [modal, setModal] = useState(false)
  const [modalDetails, setModalDetails] = useState({})
  const [userDetails, setUserDetails] = useState({})
  const history = useHistory()
  useEffect(() => {
    fetchData(setUserDetails)
    // eslint-disable-next-line
  }, [])
  return (
    <CRow className = "justify-content-center align-items-center">
      <Modal modalOn= {modal} setModal = {setModal} color = {modalDetails.color} header = {modalDetails.header} body = {modalDetails.body} />
      <CCol xs="12" sm="8">
        <CCard>
          <CCardHeader className = "basvuru-detay-header" style = {{backgroundColor: setHeaderColor(userDetails)}}>
            <h4>Başvuru Detay</h4>
            <CCol sm = "2" className = "basvuru-detay-header-buttonCol">
              <CButton active block color="secondary" aria-pressed="true" onClick = {() => {
                history.push("/basvurular/goruntule")
              }}>Geri</CButton>
            </CCol>
          </CCardHeader>
          <CCardBody className = "basvuru-detay" >
            <CFormGroup row className="my-0">
              <CCol xs = "12" lg="2">
                <CFormGroup>
                  <CLabel>ID</CLabel>
                  <CInput placeholder= {userDetails.ID} readOnly />
                </CFormGroup>
              </CCol>
              <CCol xs = "12" lg="10">
                <CFormGroup>
                  <CLabel>İsim</CLabel>
                  <CInput placeholder={userDetails.İsim} readOnly />
                </CFormGroup>
              </CCol>
            </CFormGroup>
            <CFormGroup row className="my-0">
              <CCol xs = "12" lg="2">
                <CFormGroup>
                  <CLabel>Statü</CLabel>
                  <CInput placeholder= {userDetails.Statü} readOnly />
                </CFormGroup>
              </CCol>
              <CCol xs = "12" lg="2">
                <CFormGroup>
                  <CLabel>Tarih</CLabel>
                  <CInput placeholder= {userDetails.Tarih} readOnly />
                </CFormGroup>
              </CCol>
              <CCol xs = "12" lg="2">
                <CFormGroup>
                  <CLabel>Hizmet</CLabel>
                  <CInput placeholder={userDetails.Tip} readOnly />
                </CFormGroup>
              </CCol>
              <CCol xs = "12" lg="6">
                <CFormGroup>
                  <CLabel>Kampanya</CLabel>
                  <CInput placeholder={userDetails.Kampanya} readOnly />
                </CFormGroup>
              </CCol>
            </CFormGroup>
            {renderTextArea(userDetails)}
            {
              userDetails.submitProcessNum === 3 ?
              <CFormGroup>
                <CLabel>Son notlarınız</CLabel>
                  <CTextarea 
                    rows="6"
                    placeholder={userDetails.finalSalesRepDetails}
                    readOnly
                  />
              </CFormGroup>
              :
              <CFormGroup>
                <CLabel>Notlarınız</CLabel>
                  <CTextarea 
                    rows="6"
                    placeholder="işlemle alakalı notlarınız..."
                    onChange = {(e) => setSdDetay(e.target.value)}
                  />
              </CFormGroup>
            }
            <CFormGroup row className = "justify-content-center">
              <CLabel>Başvuru resimler: </CLabel>
            {
                userDetails.imageURLS && userDetails.imageURLS.map ((elm, i) => {
                  return (
                    <CCol md="3" key = {i}>
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
            <CFormGroup row className = "basvuru-detay-submit-buttons my-0" >
              <CCol lg = "4">
                {renderBasvuruDetayFooter(userDetails)}
              </CCol>
            </CFormGroup>
          </CCardBody>
        </CCard>
      </CCol>
  </CRow>
  )
}

export default BasvuruDetay