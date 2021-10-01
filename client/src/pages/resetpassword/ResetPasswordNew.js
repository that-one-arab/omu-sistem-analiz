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

const ResetPasswordNew = () => {
  const unmatchedPassword = "Şifreniz uyuşmuyor, lütfen şifrelerinizi kontrol edin"
  const modalErrorObj = {
    header: "HATA",
    body: "Bilgileriniz kaydedilmedi, lütfen daha sonra tekrar deneyin",
    color: "danger"
  }
  const modalSuccessObj = {
    header: "BAŞARILI",
    body: "Talebiniz başarıyla işlenmiştir! giriş yapabilirsiniz.",
    color: "success"
  }
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [modal, setModal] = useState({})
  const [modalOn, setModalOn] = useState(false)
  const [toasters, addToaster] = useState([])

  const verifyPassword = () => {
    if (password !== confirmPassword) {
      addToaster([
        ...toasters,
        {body: unmatchedPassword}
      ])
      return false
    }
    return true
  }

  const onPasswordSubmit = async () => {
    if (verifyPassword()) {
      const res = await fetch("/register" , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password
        })
      })
      setModalOn(true)
      if (res.status === 200) {
        setModal(modalSuccessObj)
      } else {
        setModalOn(modalErrorObj)
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
                            <h1>Yeni şifrenizi giriniz</h1>
                            <p className="text-muted">Aşağıdaki alanlara şifrenizi giriniz</p>
                            </div>
                        </div>
                        </div>
                        <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                            <CInputGroupText>
                            <i className="far fa-envelope"></i>
                            </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" placeholder="e-mail adresiniz" autoComplete="email"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                            <CInputGroupText>
                            <i className="fas fa-lock"></i>
                            </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" placeholder="e-mail adresiniz" autoComplete="email"
                            value = {confirmPassword}
                            onChange = {(e) => setConfirmPassword(e.target.value)}
                        />
                        </CInputGroup>
                        <CButton color="success" block onClick = {() => onPasswordSubmit()} >Resetle</CButton>
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

export default ResetPasswordNew