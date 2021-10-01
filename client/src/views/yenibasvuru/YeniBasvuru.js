import React, { useState, useEffect, useReducer } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormGroup,
  CFormText,
  CTextarea,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CInputFile
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import Modal from "../../components/modals/Modal"
import HocLoader from "../hocloader/HocLoader"
import { initialState, reducer } from "."

const ApplicationImages = ({dispatch, applicationImages}) => {
    return (
        <>
        <CFormGroup row>
            <CCol md="3">
                <CLabel>Başvuru dosyaları</CLabel>
            </CCol>
            <CCol xs="12" md="9">
                <CInputFile
                    id="file-multiple-input"
                    name="file-multiple-input"
                    multiple
                    custom
                    onChange={(e) => dispatch({type: "LOAD_IMAGES", payload: e.target.files})}
                />
                <CLabel htmlFor="file-multiple-input" variant="custom-file">
                    Dosyalarını seç
                </CLabel>
            </CCol>
        </CFormGroup>
        {
            applicationImages.length !== 0 ?
            <CFormGroup row>
                <CCol md="4">
                    <img alt = "" style = {{maxWidth: "200px", maxHeight: "200px"}} src = {applicationImages[0]} />
                </CCol>
                <CCol md="4">
                    <img alt = "" style = {{maxWidth: "200px", maxHeight: "200px"}} src = {applicationImages[1]} />
                </CCol>
                <CCol md="4">
                    <img alt = "" style = {{maxWidth: "200px", maxHeight: "200px"}} src = {applicationImages[2]} />
                </CCol>
            </CFormGroup>
            :
            <CFormGroup row>
                <CCol md="4">
                    <img alt="" style={{ maxWidth: "200px", maxHeight: "200px" }} src="https://res.cloudinary.com/papyum/image/upload/v1629721581/iys/placeholder_fb7gch.png" />
                </CCol>
                <CCol md="4">
                    <img alt="" style={{ maxWidth: "200px", maxHeight: "200px" }} src="https://res.cloudinary.com/papyum/image/upload/v1629721581/iys/placeholder_fb7gch.png" />
                </CCol>
                <CCol md="4">
                    <img alt="" style={{ maxWidth: "200px", maxHeight: "200px" }} src="https://res.cloudinary.com/papyum/image/upload/v1629721581/iys/placeholder_fb7gch.png" />
                </CCol>
            </CFormGroup>
        }
        </>
    )
}

const Services = ({selectedService, dispatch}) => {
    const [services, setServices] = useState([])
    const fetchData = async () => {
        const res = await fetch('/services', {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(8)} `
            }
        })
        if (res.status === 200) {
            const fetchData = await res.json()
            setServices(fetchData)
        }
    }

    useEffect(() => {
        fetchData()
        //eslint-disable-next-line
    }, [])

    return (
        <CFormGroup row>
            <CCol md="3">
                <CLabel htmlFor="select">Verilen Hizmet</CLabel>
            </CCol>
            <CCol xs="12" md="9">
                <CSelect value={selectedService} custom name="select" id="select" onChange={(e) => dispatch({type: "SET_SERVICE", payload: e.target.value})} >
                    <option value = {0}></option>
                    {
                        services && services.map(service => {
                            return <option key = {service.service_id} value = {service.service_id} >{service.name}</option>
                        })
                    }
                </CSelect>
                <CFormText>Sağlamak istediğiniz hizmet</CFormText>
            </CCol>
        </CFormGroup>
    )
}

const Offers = ({dispatch, isServiceSelected, selectedServiceID, selectedOffer }) => {
    const [offers, setOffers] = useState([])
    const [fetching, setFetching] = useState(true)
    const handleInputDisabled = () => {
        if(isServiceSelected === false && fetching === false)
            return true
        else if (fetching === true)
            return true
        else
            return false
    }
    const handleServicesWithNoOffers = () => {
        if (isServiceSelected === true && offers.length === 0)
            return <option value = {0}>Bu hizmete kampanya bulunmuyor</option>
        else return <option> </option>
    }
    const fetchData = async () => {
        setFetching(true)
        const res = await fetch(`/service/${selectedServiceID}`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(8)} `
            }
        })
        if (res.status === 200) {
            const fetchData = await res.json()
            setOffers(fetchData)
        } else if (res.status === 406)
            setOffers([])
        setFetching(false)

    }

    useEffect(() => {
        if (isServiceSelected)
            fetchData()
        else
            setOffers([])
        //eslint-disable-next-line
    }, [isServiceSelected, selectedServiceID])

    return (
        <CFormGroup row>
        <CCol md="3">
            <CLabel htmlFor="select" >Kampanya Seçimi</CLabel>
        </CCol>
        <CCol xs="12" md="9">
            <CSelect disabled = {handleInputDisabled()} 
                value={selectedOffer} onChange={(e) => dispatch({type: "SET_OFFER", payload: e.target.value})} >
                {handleServicesWithNoOffers()}
                {
                    offers && offers.map(offer => {
                        return <option key = {offer.offer_id} value = {offer.offer_id} >{offer.name}</option>
                    })
                }
            </CSelect>
            <CFormText>Seçmek istediğiniz kampanya</CFormText>
        </CCol>
        </CFormGroup>
    )
}

const Activator = () => {
    const [activator, setActivator] = useState("")
    const fetchData = async () => {
        const res = await fetch('/activator', {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(8)} `
            }
        })
        if (res.status === 200) {
            const fetchData = await res.json()
            setActivator(fetchData.name)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <CFormGroup row>
            <CCol md="3">
                <CLabel htmlFor="disabled-input">Aktivasyon</CLabel>
            </CCol>
            <CCol xs="12" md="9">
                <CInput id="disabled-input" name="disabled-input" placeholder={activator} disabled />
                <CFormText>Sorumlu aktivasyon kişi</CFormText>
            </CCol>
        </CFormGroup>
    )
}

const YeniBasvuru = () => {

    const [state, dispatch] = useReducer(reducer, initialState)
    // Forms's controlled input fields' values
    const { selectedService, selectedOffer, clientDescription, clientName, applicationImages } = state

    // Form's other values that control the flow of the form itself
    const { isServiceSelected, isOfferSelected, isDescriptionInputted, isClientNameInputted, applicationImagesObjUrls, areImagesInputted, toasters, modalTextObj } = state

    const [inputFieldsNotEmpty, setInputFieldsNotEmpty] = useState(true)
    const [modalOn, setModalOn] = useState(false)
    const [loading, setLoading] = useState(false)

    const resetInput =() => {
        dispatch({type: "RESET_INPUT"})
    }

    const onSubmit = async () => {
        setLoading(true)
        const formData = new FormData()

        formData.append("selectedService", selectedService)
        formData.append("selectedOffer", selectedOffer)
        formData.append("clientDescription", clientDescription)
        formData.append("clientName", clientName)
        for (let i = 0; i < applicationImages.length; i++) {
            formData.append("image", applicationImages[i])
        }
        const res = await fetch("/applications", {
            method: "POST",
            headers: {
                'authorization' :`Bearer ${document.cookie.slice(8)} `
            },
            body: formData
        })
        if (res.status === 200) {
            setModalOn(true)
            resetInput()
            dispatch({type: "SET_MODAL_TEXT_SUCCESS"})
        } else {
            dispatch({type: "SET_MODAL_TEXT_FAILURE"})
            setModalOn(true)
        }
        setLoading(false)
    }

    useEffect(() => {
        const verifyFields = () => {
            const inputFields = [isServiceSelected, isOfferSelected, isDescriptionInputted, isClientNameInputted, areImagesInputted]
            for (let i = 0; i < inputFields.length; i++) {
                if (inputFields[i] === false) {
                    return true
                }
                
            }
            return false
        }
        setInputFieldsNotEmpty(verifyFields())
    }, [isServiceSelected, isOfferSelected, isDescriptionInputted, isClientNameInputted, areImagesInputted])

    return (
        <CRow className="d-flex justify-content-center">
        {/* I'm mapping the toasters from toasters array, each element is an object, object has: element, textObj, and 
            for every element in the array I'm calling the element's "element", which is a function that returns a react
            element, and giving it "textObj" as props, and passing index as second argument. 
        */}
        {toasters && toasters.map((toaster, i) => ( toaster.element(toaster.textObj, i)))}
        <Modal modalOn = {modalOn} setModal = {setModalOn} color = {modalTextObj.color} header = {modalTextObj.header} body = {modalTextObj.body} />
            <CCol xs="12" md="8">
                <HocLoader relative isLoading = {loading}>
                <CCard>
                    <CCardHeader className="basvuruFormHeader">
                        Yeni Başvuru Sayfası
                    </CCardHeader>
                    <CCardBody>
                            <Activator />

                            <Services dispatch = {dispatch} selectedService = {selectedService} />
                            
                            <Offers dispatch = {dispatch} isServiceSelected = {isServiceSelected} selectedServiceID = {selectedService} />

                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="textarea-input">Açıklama</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CTextarea
                                        name="textarea-input"
                                        id="textarea-input"
                                        rows="9"
                                        placeholder="İşlemle alakalı ekstra detaylarınızı buraya yazın"
                                        value={clientDescription}
                                        onChange={(e) => dispatch({type: "SET_CLIENT_DESCRIPTION", payload: e.target.value})}
                                    />
                                    <CFormText>İşlemle alakalı açıklamanız</CFormText>
                                </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input">Müşteri</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={clientName} id="text-input" name="text-input" placeholder="" onChange={(e) => dispatch({type: "SET_CLIENT_NAME", payload: e.target.value})} />
                                    <CFormText>müşterinin isim soyisimi</CFormText>
                                </CCol>
                            </CFormGroup>
                            <ApplicationImages dispatch = {dispatch} applicationImages = {applicationImagesObjUrls} />
                    </CCardBody>
                    <CCardFooter>
                        <CButton type="submit" size="sm" color="primary" onClick={onSubmit} disabled = {inputFieldsNotEmpty} ><CIcon name="cil-scrubber" /> Gönder</CButton>
                        <CButton type="reset" size="sm" color="danger" onClick={resetInput}  ><CIcon name="cil-ban" /> Resetle</CButton>
                    </CCardFooter>
                </CCard>
                </HocLoader>
            </CCol>
        </CRow>
    )
}

export default React.memo(YeniBasvuru)