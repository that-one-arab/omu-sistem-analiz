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
import { Link } from "react-router-dom"
import CIcon from '@coreui/icons-react'
import Modal from '../../components/modals/Modal'
import Toaster from '../../components/toaster/Toaster'
import customFetch from '../../custom-fetch';

const Test = () => {

  const onImageSelect =  (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log("event.target.files", event.target.files)
      let img = event.target.files[0];
      console.log("img before using createobjecturl", img)
      // console.log("img before using createobjecturl", URL.createObjectURL(img))
      setImage(img)
    }
  };
  
  const onImageUpload = async () => {
    const formData = new FormData()
    formData.append("myFile", image)
    // const plainFormData = Object.fromEntries(formData.entries());
    // const formDataJsonString = JSON.stringify(plainFormData);
    try {
      const res = await customFetch("/upload", {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      console.log("data from fetch", data)
    } catch (error) {
      console.log(error)
    }
  }
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState(null)
  const [modal, setModal] = useState({
    header: "",
    body: "",
    color: ""
  })
  const [modalOn, setModalOn] = useState(false)
  const [toasters, addToaster] = useState([])

  const somethingdeletemelater = () => {
    setModal({})
    addToaster()
  }
  if (username)
    console.log(somethingdeletemelater)

    

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
        {
          toasters.map((element, i) => {
            return <Toaster key = {i} body = {element.body} show = {true} color = {"danger"} />
          })
        }
        <Modal header = {modal.header} body = {modal.body} color = {modal.color} modalOn = {modalOn} setModal = {setModalOn}/>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm>
                    <div className = "container">
                      <div className = "row">
                        <div className = "col">
                          <h1>Kayıt olun</h1>
                          <p className="text-muted">Hesabınızı oluşturun</p>
                        </div>
                        <div>
                          <Link to = "/login" ><p>Giriş sayfasına git</p></Link>
                        </div>
                      </div>
                    </div>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Kullanıcı isminiz" autoComplete="username" value = {username}
                      onChange = {(e) => setUsername(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Şifreniz" autoComplete="new-password" value = {password}
                      onChange = {(e) => setPassword(e.target.value)} />
                    </CInputGroup>
                    <CInputGroup>
                      <input type = "file" onChange={(e) => onImageSelect(e)} />
                    </CInputGroup>
                    <CButton color="success" block 
                    onClick = {() => console.log(image)}>test value</CButton>
                    <CButton color="success" block 
                    onClick = {() => onImageUpload()}>Submit</CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
    </div>
  )
}

export default Test
