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
import customFetch from '../../custom-fetch';

const Register = () => {
  const missingInfo = "Lütfen tüm alanları doldurunuz"
  const unmatchedPassword = "Şifreniz uyuşmuyor, lütfen şifrelerinizi kontrol edin"
  const invalidEmail = "Lütfen girilen E-Mail adresini kontrol edin"
  // const userAlreadyExists = "Bu kullanıcı adı alınmıştır. Lütfen farklı bir kullanıcı adı seçiniz"
  const modalErrorObj = {
    header: "HATA",
    body: "Bilgileriniz kaydedilmedi, lütfen daha sonra tekrar deneyin",
    color: "danger"
  }
  const modalEmailExistsObj = {
    header: "HATA",
    body: "Bu kullanıcı mevcuttur. Lütfen yeni hesap oluşturun",
    color: "warning"
  }
  const modalSuccessObj = {
    header: "BAŞARILI",
    body: "Hesabınız oluşturuldu. Lütfen giriş sayfasından giriş yapın",
    color: "success"
  }
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [dealerName, setDealerName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [modal, setModal] = useState({
    header: "",
    body: "",
    color: ""
  })
  const [modalOn, setModalOn] = useState(false)
  const [toasters, addToaster] = useState([])
  // const reset = () => {
  //   setUsername("")
  //   setDealerName("")
  //   setPassword("")
  //   setConfirmPassword("")
  // }

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

  const verifyInput = () => {
    if (username === "" || password === "" || confirmPassword === "" || dealerName === "" || email === "") {
      addToaster([
        ...toasters,
        {body: missingInfo}
      ])
      return false
    }
    return true
  }
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

  const onSubmit = async () => {
    if (verifyInput() && verifyEmail() && verifyPassword()) {
      const res = await customFetch("/register" , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email,
          dealerName
        })
      })
      setModalOn(true)
      if (res.status === 200) {
        setModalOn(true)
        setModal(modalSuccessObj)
      } else if (res.status === 406) {
        setModalOn(true)
        setModal(modalEmailExistsObj)
      } else {
        setModalOn(true)
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
        <Modal header = {modal.header} body = {modal.body} color = {modal.color} modalOn = {modalOn} setModal = {setModalOn} onClose={() => {
          if (modal.body === modalSuccessObj.body) {
            window.location.href = "/login"
          }
        }} />
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <div className = "container">
                      <div className = "row align-items-center justify-content-between">
                        <div className = "col">
                          <h1>Kayıt olun</h1>
                          <p className="text-muted">Hesabınızı oluşturun</p>
                        </div>
                        {/* <div className = "col">
                          <Link to = "/login" ><p>Giriş sayfasına git</p></Link>
                        </div> */}
                      </div>
                    </div>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <i className="far fa-user"></i>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Kullanıcı isminiz" autoComplete="username" value = {username}
                      onChange = {(e) => setUsername(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <i className="far fa-envelope"></i>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="e-mail adresiniz" autoComplete="email" value = {email}
                      onChange = {(e) => setEmail(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <i className="fas fa-store-alt"></i>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Bayi ismi ÖRN: İstanbul İletişim" autoComplete="dealer-name" value = {dealerName}
                      onChange = {(e) => {
                        setDealerName(e.target.value)
                        }} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <i className="fas fa-lock"></i>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Şifreniz" autoComplete="new-password" value = {password}
                      onChange = {(e) => setPassword(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <i className="fas fa-lock"></i>
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Şifrenizi tekrar giriniz" autoComplete="new-password" value = {confirmPassword}
                      onChange = {(e) => setConfirmPassword(e.target.value)} />
                    </CInputGroup>
                    <CButton color="success" block onClick = {() => onSubmit()} >Hesabınızı oluşturun</CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
    </div>
  )
}

export default Register
