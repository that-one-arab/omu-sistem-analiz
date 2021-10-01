import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import Modal from '../../components/modals/Modal'
import Toaster from '../../components/toaster/Toaster'

const ResetPassword = () => {
  const invalidEmail = "Lütfen girilen E-Mail adresini kontrol edin"
  const modalErrorObj = {
    header: "HATA",
    body: "Bilgileriniz kaydedilmedi, lütfen daha sonra tekrar deneyin",
    color: "danger"
  }
  const modalSuccessObj = {
    header: "BAŞARILI",
    body: "Talebiniz başarıyla işlenmiştir! Eğer E-Mail adresiniz doğru isa, sizin E-Mail hesabınıza gelen maili kontrol ediniz",
    color: "success"
  }
  const [email, setEmail] = useState("")
  const [modal, setModal] = useState({})
  const [modalOn, setModalOn] = useState(false)
  const [toasters, addToaster] = useState([])

  const verifyEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email) === false) {
      addToaster([
        ...toasters,
        {body: invalidEmail}
      ])
      return false
    }
    return true
  }

  const onEmailSubmit = async () => {
    if (verifyEmail()) {
      const res = await fetch(`/resetpassword?email=${email}` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setModalOn(true)
      if (res.status === 200) {
        setModal(modalSuccessObj)
      } else {
        setModal(modalErrorObj)
      }
    }
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
            {
                toasters.map((element, i) => {
                    return <Toaster key = {i} body = {element.body} show = {true} color = {"danger"} />
                })
            }
            <CRow className="justify-content-center">
                <CCol md="9" lg="7" xl="6">
                    <CCard className="mx-4">
                        <CCardBody className="p-4">
                        <CForm>
                            <div className = "container">
                            <div className = "row align-items-center justify-content-between">
                                <div className = "col">
                                <h1>Şifrenizi resetleyin</h1>
                                <p className="text-muted">Aşağıdaki alana email adresinizi girerek resetle tuşuna basınız</p>
                                </div>
                            </div>
                            </div>
                            <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                                <CInputGroupText>
                                <i className="far fa-envelope"></i>
                                </CInputGroupText>
                            </CInputGroupPrepend>
                            <CInput type="text" placeholder="e-mail adresiniz" autoComplete="email" value = {email}
                            onChange = {(e) => setEmail(e.target.value)} />
                            </CInputGroup>
                            <CButton color="success" block onClick = {() => onEmailSubmit()} >Resetle</CButton>
                        </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <Modal header = {modal.header} body = {modal.body} color = {modal.color} modalOn = {modalOn} setModal = {setModalOn}/>
        </CContainer>
    </div>
  )
}

export default ResetPassword
