import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import Modal from '../../components/modals/Modal';
import { mapRoleToTurkish } from "../../components"
import HocLoader from "../hocloader/HocLoader"
import { useDispatch } from "react-redux"
import customFetch from '../../custom-fetch';

const patchPassword = async (password) => {
    const res = await customFetch('/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${document.cookie.slice(8)} `
        },
        body: JSON.stringify({password})
      })
    if (res.status === 200)
      return true
    else
      return false
}

const patchName = async (name) => {
    const res = await customFetch('/user/name', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${document.cookie.slice(8)} `
        },
        body: JSON.stringify({name})
      })
    if (res.status === 200)
      return true
    else
      return false
}

const determineUserFieldChange = (username, oldUsername, password, confirmPassword) => {
    if (username !== oldUsername && password !== "" && password === confirmPassword)
        return "BOTH"
    else if (username !== oldUsername)
        return "USERNAME"
    else if (password === confirmPassword)
        return "PASSWORD"
}

const parseDateToString = (date) => {
    const d = new Date(date)
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}

const modalSuccessObj = {
    color: "success",
    header: "Başarılı",
    body: "Bilgileriniz başarıyla değiştirilmiştir"
}

const modalErrorObj = {
    color: "danger",
    header: "Hata",
    body: "Bir sorun oldu, lütfen daha sonra tekrar deneyin"
}

const Hesap = () => {
    const dispatch = useDispatch()

    const [userDetails, setUserDetails] = useState({name: "", role: "", balance: "", registerDate: "", email: ""})
    const [userName, setUserName] = useState("")
    const [userPassword, setUserPassword] = useState("password")
    const [userConfirmPassword, setUserConfirmPassword] = useState("confirmpassword")
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [modalOn, setModalOn] = useState(false)
    const [modalFields, setModalFields] = useState({})

    const fetchData = async () => {
        const res = await customFetch('/user', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(8)} `
              }
            })
        const data = await res.json()
        setUserDetails(data[0])
        setUserName(data[0].name)
        dispatch({type: "FILL_USER_INFO", payload: data[0]})
    }

    const onSubmit = async () => {
        const determineChange = determineUserFieldChange(userName, userDetails.name, userPassword, userConfirmPassword)
        let res, resName, resPassword
        setLoading(true)
        switch (determineChange) {
            case "PASSWORD":
                res = await patchPassword(userPassword)
                if (res) {
                    setModalOn(true)
                    setModalFields(modalSuccessObj)
                } else {
                    setModalOn(true)
                    setModalFields(modalErrorObj)
                }
                break
            case "USERNAME":
                res = await patchName(userName)
                if (res) {
                    setModalOn(true)
                    setModalFields(modalSuccessObj)
                } else {
                    setModalOn(true)
                    setModalFields(modalErrorObj)
                }
                break
            case "BOTH":
                resPassword = await patchPassword(userPassword)
                resName = await patchName(userName)
                if (resPassword && resName) {
                    setModalOn(true)
                    setModalFields(modalSuccessObj)
                } else {
                    setModalOn(true)
                    setModalFields(modalErrorObj)
                }
                break
            default:
                break;
        }
        await fetchData()
        setLoading(false)

    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line
    }, [])

    // decides footer submit button disabled or enabled state
    useEffect(() => {
    if (userPassword === "" || userConfirmPassword === "") {
        if (userName !== userDetails.name)
            setSubmitButtonDisabled(false)
        else
            setSubmitButtonDisabled(true)
    }
    else if (userPassword === userConfirmPassword) {
        setSubmitButtonDisabled(false)
    }
    else if (userName !== userDetails.name) {
        setSubmitButtonDisabled(false)
    }
    else {
        setSubmitButtonDisabled(true)
    }
    }, [userName, userPassword, userConfirmPassword, userDetails])

    return (
        <CRow className = "d-flex justify-content-center">
            <Modal modalOn = {modalOn} setModal = {setModalOn} header = {modalFields.header} body = {modalFields.body} color = {modalFields.color} />
            <CCol xs="12" md="8">
            <HocLoader relative = {true} isLoading = {loading} >
            <CCard>
                <CCardHeader className = "basvuruFormHeader">
                Hesap bilgileriniz
                </CCardHeader>
                <CCardBody>
                <CForm className="form-horizontal">
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel >İsminiz</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput defaultValue = {userDetails.name} onChange = {(e) => setUserName(e.target.value)}/>
                        </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="disabled-input">Mail hesabınız</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput value = {userDetails.email} readOnly/>
                        </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="disabled-input">Rölünüz</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput value = {mapRoleToTurkish(userDetails.role)} readOnly/>
                        </CCol>
                    </CFormGroup>

                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="disabled-input">Kayıt tarihi</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput value = {parseDateToString(userDetails.register_date)} readOnly/>
                        </CCol>
                    </CFormGroup>

                    <h5 style = {{marginTop: "50px", marginBottom: "20px"}}> Şifreinizi değiştirmek istiyorsanız alttaki alanları doldurunuz</h5>
                    
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel >Yeni şifreniz</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput type = "password" placeholder = "Yeni şifrenizi giriniz" onChange = {(e) => setUserPassword(e.target.value)} />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="3">
                            <CLabel >Yeni şifreniz</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CInput type = "password" placeholder = "Yeni şifrenizi bir kez daha giriniz " onChange = {(e) => setUserConfirmPassword(e.target.value)}/>
                        </CCol>
                    </CFormGroup>

                </CForm>
                </CCardBody>
                <CCardFooter>
                <CButton type="submit" size="sm" color="primary" disabled = {submitButtonDisabled} onClick = {onSubmit} ><CIcon name="cil-scrubber"/> Kaydet</CButton>
                </CCardFooter>
            </CCard>
            </HocLoader>
            </CCol>
        </CRow>
    )
}

export default Hesap