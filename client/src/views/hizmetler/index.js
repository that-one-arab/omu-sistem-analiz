import {
    CCol,
    CRow,
    CModal,
    CModalTitle,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CFormGroup,
    CLabel,
    CInput,
    CTextarea,
    CInputRadio,
    CInputGroupPrepend
  } from '@coreui/react'
import { useEffect, useState } from 'react'

import Toaster from "../../components/toaster/Toaster2"
import HocLoader from '../hocloader/HocLoader'

export const successObj = {
    color: "success",
    body: "Değişikleriniz başarıyla tamamlanmıştır!"
}

export const errorObj = {
    color: "danger",
    body: "Bir hata oldu, lütfen daha sonra tekrar deneyin"
}

export const ModifyOffer = ({offer, show, setModal, toasters, triggerToaster, refetch}) => {
    const [offerDetails, setOfferDetails] = useState(offer)
    const [newName, setNewName] = useState(offer.kampanya_ismi)
    const [newValue, setNewValue] = useState(offer.değeri)
    const [newDescription, setNewDescription] = useState(offer.kampanya_açıklaması)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    function verifyInputFields() {
        let changesArr = [false, false, false]
        if (newName !== offerDetails.kampanya_ismi)
            changesArr[0] = true
        else
            changesArr[0] = false

        if (newDescription !== offerDetails.kampanya_açıklaması)
            changesArr[1] = true
        else
            changesArr[1] = false

        if (Number(newValue) !== Number(offerDetails.değeri))
            changesArr[2] = true
        else
            changesArr[2] = false

        return changesArr
    }

    function reSetSelectedOffer(offerID, offersData) {
        const selectedOffer = offersData.find(obj => obj.offer_id === offerID)
        return selectedOffer
    }

    async function deleteOffer() {
        const res = await fetch(`/offer/active?offerID=${offer.offer_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${document.cookie.slice(8)} `
            },
            body: JSON.stringify({
              newOfferName : newName
            })
      })
      if (res.status === 200) {
        refetch()
        triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
      } else {
        triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
      }
      setModal(false)
    }

    async function handleSubmit() {
        const handleNameUpdate = async () => {
            const res = await fetch(`/offer/name?offerID=${offer.offer_id}&forServiceID=${offer.service_id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${document.cookie.slice(8)} `
                  },
                  body: JSON.stringify({
                    newOfferName : newName
                  })
            })
            if (res.status === 200)
                return true
            else
                return false
        }
        const handleDescriptionUpdate = async () => {
            const res = await fetch(`/offer/description?offerID=${offer.offer_id}&forServiceID=${offer.service_id}`, {
                method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${document.cookie.slice(8)} `
                  },
                  body: JSON.stringify({
                    newOfferDescription: newDescription
                  })
                  
            })
            if (res.status === 200)
                return true
            else
                return false
        }
        const handleValueUpdate = async () => {
            const res = await fetch(`/offer/value?offerID=${offer.offer_id}&forServiceID=${offer.service_id}`, {
                method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${document.cookie.slice(8)} `
                  },
                  body: JSON.stringify({
                    newOfferValue: newValue
                  })
            })
            if (res.status === 200)
                return true
            else
                return false
        }
        
        const verifyFields = verifyInputFields()
        const handleChangeFunctions = [handleNameUpdate, handleDescriptionUpdate, handleValueUpdate]
        setLoading(true)        
        for (let i = 0; i < verifyFields.length; i++) {
            if (verifyFields[i]) {
                const res = await handleChangeFunctions[i]()
                if (res)
                    continue
                else {
                    setLoading(false)
                    refetch().then((data) => {
                        const selectedOffer = reSetSelectedOffer(offer.offer_id, data)
                        setOfferDetails(selectedOffer)
                        
                    })
                    return triggerToaster([...toasters, {element: Toaster, textObj: errorObj}])
                }
            }
        }
        setLoading(false)
        refetch().then((data) => {
            const selectedOffer = reSetSelectedOffer(offer.offer_id, data)
            setOfferDetails(selectedOffer)
            
        })        
        return triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
    }

    useEffect(() => {
        const verifyFields = verifyInputFields()
        for (let i = 0; i < verifyFields.length; i++) {
            if (verifyFields[i])
                return setButtonDisabled(false)
        }
        return setButtonDisabled(true)
        //eslint-disable-next-line
    }, [newName, newValue, newDescription, offerDetails])
    return (
        <CModal 
        size = "lg"
        show={show}
        onClose={() => setModal(!show)}
        centered
        >
            <HocLoader relative isLoading = {loading}>
            <CModalHeader closeButton>
                <CModalTitle> Kampanya detayı </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow className = "justify-content-center align-items-center">
                <CCol xs="12" sm="11">
                    <CFormGroup row className="my-0">
                        <CCol xs = "12" lg="10">
                            <CFormGroup>
                                <CLabel>Kampanya ismi</CLabel>
                                <CInput defaultValue={offerDetails?.kampanya_ismi} onChange = {(e) => setNewName(e.target.value)} />
                            </CFormGroup>
                        </CCol>
                        <CCol xs = "12" lg="2">
                            <CFormGroup>
                                <CLabel>Değeri</CLabel>
                                <CInput defaultValue= {offerDetails?.değeri} onChange = {(e) => setNewValue(Number(e.target.value))} type = "number" />
                            </CFormGroup>
                        </CCol>
                    </CFormGroup>
                    <CFormGroup>
                        <CLabel>Kampanya Açıklaması</CLabel>
                        <CTextarea
                        onChange = {(e) => setNewDescription(e.target.value)}
                        rows="6"
                        defaultValue = {offerDetails?.kampanya_açıklaması}
                        />
                    </CFormGroup>
                </CCol>
                </CRow>
                <CButton color = "danger" onClick = {deleteOffer} >Kampanyayı sil</CButton>
            </CModalBody>
            <CModalFooter>
                <CButton color = "success" disabled = {buttonDisabled} onClick = {handleSubmit} >Değiştir</CButton>
                <CButton color="secondary" onClick={() => setModal(!show)}>Kapat</CButton>
            </CModalFooter>
            </HocLoader>
        </CModal>
    )
}


export const ConfirmDeleteModal = ({ modalOn, setModal, serviceID, toasters, triggerToaster, refetch }) => {
    const [loading, setLoading] = useState(false)

    const confirmDelete = async () => {
        setLoading(true)
        const res = await fetch(`/service/active?serviceID=${serviceID}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(8)} `
              }
        })
        if (res.status === 200) {
            triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
        } else {
            triggerToaster([...toasters, {element: Toaster, textObj: errorObj}])
        }
        refetch()
        setModal(false)
        setLoading(false)
    }
    return (
        <CModal 
        show={modalOn}
        onClose={() => setModal(!modalOn)}
        color="warning"
        centered
        >   
            <HocLoader relative isLoading = {loading} >
                <CModalHeader closeButton>
                    <CModalTitle> Dikkat </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <h6 style = {{textAlign: "center"}}>Bu hizmeti silerseniz, bu hizmete ait olan kampanyaları silenecektir </h6>
                    <h5 style = {{textAlign: "center"}}>Bu hizmeti silmek istediğinizden emin misiniz? </h5>
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={confirmDelete}>Onayla</CButton>
                    <CButton color="secondary" onClick={() => setModal(!modalOn)}>Kapat</CButton>
                </CModalFooter>
            </HocLoader>
        </CModal>
    )
}


function matchServiceWithServicesData(serviceID, servicesData) {
    const selectedService = servicesData.find(obj => obj.service_id === Number(serviceID))
    return selectedService
}

export const ModifyService = ({ modalOn, setModal, service, toasters, triggerToaster, refetch }) => {
    const [serviceData, setServiceData] = useState(service)
    const [loading, setLoading] = useState(false)
    const [newServiceName, setNewServiceName] = useState(serviceData.name)
    const [newServiceDescription, setNewServiceDescription] = useState(serviceData.description)
    const [buttonDisabled, setButtonDisabled] = useState(true)

    function verifyInputFields() {
        let changesArr = [false, false]
        if (newServiceName !== serviceData.name)
            changesArr[0] = true
        else
            changesArr[0] = false
    
        if (newServiceDescription !== serviceData.description)
            changesArr[1] = true
        else
            changesArr[1] = false
    
        return changesArr
    }

    async function handleSubmit() {
        const handleNameUpdate = async () => {
            const res = await fetch(`/service/name?serviceID=${serviceData.service_id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${document.cookie.slice(8)} `
                  },
                  body: JSON.stringify({
                    newServiceName
                  })
            })
            if (res.status === 200)
                return true
            else
                return false
        }
        const handleDescriptionUpdate = async () => {
            const res = await fetch(`/service/description?serviceID=${serviceData.service_id}`, {
                method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${document.cookie.slice(8)} `
                  },
                  body: JSON.stringify({
                    newServiceDescription
                  })
                  
            })
            if (res.status === 200)
                return true
            else
                return false
        }
        const verifyFields = verifyInputFields()
        const handleChangeFunctions = [handleNameUpdate, handleDescriptionUpdate]
        setLoading(true)   
        for (let i = 0; i < verifyFields.length; i++) {
            if (verifyFields[i]) {
                const res = await handleChangeFunctions[i]()
                if (res)
                    continue
                else {
                    setLoading(false)
                    refetch().then(data => setServiceData(matchServiceWithServicesData(serviceData.service_id, data)))
                    return triggerToaster([...toasters, {element: Toaster, textObj: errorObj}])
                }
            }
        }
        setLoading(false)
        refetch().then(data => setServiceData(matchServiceWithServicesData(serviceData.service_id, data)))
        return triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
    }

    useEffect(() => {
        const verifyFields = verifyInputFields()
        for (let i = 0; i < verifyFields.length; i++) {
            if (verifyFields[i] === true)
                return setButtonDisabled(false)
        }
        return setButtonDisabled(true)
        //eslint-disable-next-line
    }, [newServiceName, newServiceDescription, serviceData])
    return (
        <CModal 
        // size = "md"
        show={modalOn}
        onClose={() => setModal(!modalOn)}
        color="info"
        centered
        >   
            <HocLoader relative isLoading = {loading} >
                <CRow>
                    <CCol xs = "12" >
                        <CModalHeader closeButton>
                            <CModalTitle>Hizmet bilgileri </CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormGroup row>
                                <CCol xs = "12" lg="4">
                                    <CLabel>Hizmet adı</CLabel>
                                </CCol>
                                <CCol xs = "12" lg="8">
                                    <CInput defaultValue = {serviceData?.name} onChange = {e => setNewServiceName(e.target.value)} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs = "12" lg="4">
                                    <CLabel>Hizmet açıklaması</CLabel>
                                </CCol>
                                <CCol xs = "12" lg="8">
                                    <CTextarea
                                        defaultValue = {serviceData?.description}
                                        onChange = {e => setNewServiceDescription(e.target.value)}
                                        rows = "6"
                                    />
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                        <CModalFooter>
                            <CButton disabled = {buttonDisabled} color="warning" onClick={handleSubmit}>Değiştir</CButton>
                            <CButton color="secondary" onClick={() => setModal(!modalOn)}>Kapat</CButton>
                        </CModalFooter>
                    </CCol>
                </CRow>
            </HocLoader>
        </CModal>
    )
}

export const AddService = ({ modalOn, setModal, toasters, triggerToaster, refetch, services }) => {
    const [loading, setLoading] = useState(false)
    const [newServiceName, setNewServiceName] = useState("")
    const [newServiceDescription, setNewServiceDescription] = useState("")
    const [isProfitable, setIsProfitable] = useState(undefined)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [nameFieldInvalid, setNameFieldInvalid] = useState(undefined)

    function verifyNameDoesntExist() {
        if (services.find(obj => obj.name === newServiceName)) {
            setNameFieldInvalid(true)
            return false
        }
        setNameFieldInvalid(false)
        return true
    }

    function verifyInputFields() {
        let changesArr = [false, false, false]
        if (newServiceName.trim() !== "" && verifyNameDoesntExist() !== false )
            changesArr[0] = true
        else
            changesArr[0] = false
    
        if (newServiceDescription.trim() !== "")
            changesArr[1] = true
        else
            changesArr[1] = false
        
        if (isProfitable !== undefined)
            changesArr[2] = true
        else
            changesArr[2] = false

        return changesArr
    }

    function resetInput() {
        setNewServiceName("")
        setNewServiceDescription("")
        setIsProfitable(undefined)
        setButtonDisabled(true)
        setNameFieldInvalid(undefined)
    }

    async function handleSubmit() {
        setLoading(true) 
        const res = await fetch(`/service`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${document.cookie.slice(8)} `
            },
            body: JSON.stringify({
              newServiceName,
              newServiceDescription,
              isProfitable
            })
        })
        if (res.status === 200) {
            triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
            resetInput()
            setModal(false)
        } else {
            triggerToaster([...toasters, {element: Toaster, textObj: errorObj}])
        }
        setLoading(false)
        refetch()
    }

    useEffect(() => {
        const verifyFields = verifyInputFields()
        for (let i = 0; i < verifyFields.length; i++) {
            if (verifyFields[i] === false)
                return setButtonDisabled(true)
        }
        return setButtonDisabled(false)
        //eslint-disable-next-line
    }, [newServiceName, newServiceDescription, isProfitable])
    return (
        <CModal
        size = "lg"
        show={modalOn}
        onClose={() => setModal(!modalOn)}
        color="success"
        centered
        >   
            <HocLoader relative isLoading = {loading} >
                <CRow>
                    <CCol xs = "12" >
                        <CModalHeader closeButton>
                            <CModalTitle>Hizmet Ekle </CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormGroup row>
                                <CCol xs = "12" lg="2">
                                    <CLabel>Hizmet adı</CLabel>
                                </CCol>
                                <CCol xs = "12" lg="4">
                                    <CInput invalid = {nameFieldInvalid} placeholder = "Yeni hizmet adını giriniz" value = {newServiceName} onChange = {e => setNewServiceName(e.target.value)} />
                                </CCol>
                                <CCol xs = "12" lg="6">
                                    <CRow>
                                        <CCol xs = "12" lg="6">
                                            <CLabel>Kârlı mı</CLabel>
                                        </CCol>
                                        <CCol xs = "12" lg="6">
                                            <CFormGroup variant="checkbox">
                                                <CInputRadio className="form-check-input" id="radio1" name="radios" value="true" onClick = {(e) => setIsProfitable(e.target.value)} />
                                                <CLabel variant="checkbox" htmlFor="radio1">Evet</CLabel>
                                            </CFormGroup>
                                            <CFormGroup variant="checkbox">
                                                <CInputRadio className="form-check-input" id="radio2" name="radios" value="false" onClick = {(e) => setIsProfitable(e.target.value)}/>
                                                <CLabel variant="checkbox" htmlFor="radio2">Hayır</CLabel>
                                            </CFormGroup>
                                        </CCol>
                                    </CRow>
                                    <CInputGroupPrepend style = {{color: "grey", fontSize: "0.85em"}} >Bu hizmetten para kazanılır mı?</CInputGroupPrepend>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs = "12" lg="2">
                                    <CLabel>Hizmet açıklaması</CLabel>
                                </CCol>
                                <CCol xs = "12" lg="10">
                                    <CTextarea
                                        value = {newServiceDescription}
                                        placeholder = "Hizmetin açıklamasını giriniz"
                                        onChange = {e => setNewServiceDescription(e.target.value)}
                                        rows = "6"
                                    />
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                        <CModalFooter>
                            <CButton disabled = {buttonDisabled} color="success" onClick={handleSubmit}>Hizmet ekle</CButton>
                            <CButton color="secondary" onClick={() =>{ setModal(!modalOn); resetInput()}}>Kapat</CButton>
                        </CModalFooter>
                    </CCol>
                </CRow>
            </HocLoader>
        </CModal>
    )
}



export const AddOffer = ({ modalOn, setModal, toasters, triggerToaster, refetch, offers, serviceID }) => {
    const [loading, setLoading] = useState(false)
    const [newOfferName, setNewOfferName] = useState("")
    const [newOfferDescription, setNewOfferDescription] = useState("")
    const [newOfferValue, setNewOfferValue] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(true)
    const [nameFieldInvalid, setNameFieldInvalid] = useState(undefined)

    function verifyNameDoesntExist() {
        if (offers.find(obj => obj.kampanya_ismi === newOfferName)) {
            setNameFieldInvalid(true)
            return false
        }
        setNameFieldInvalid(false)
        return true
    }

    function verifyInputFields() {
        let changesArr = [false, false, false]
        if (newOfferName.trim() !== "" && verifyNameDoesntExist() !== false )
            changesArr[0] = true
        else
            changesArr[0] = false
    
        if (newOfferDescription.trim() !== "")
            changesArr[1] = true
        else
            changesArr[1] = false
        
        if (Number(newOfferValue) >= 1)
            changesArr[2] = true
        else
            changesArr[2] = false

        return changesArr
    }

    function resetInput() {
        setNewOfferName("")
        setNewOfferDescription("")
        setButtonDisabled(true)
        setNameFieldInvalid(undefined)
    }

    async function handleSubmit() {
        setLoading(true) 
        const res = await fetch(`/offer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${document.cookie.slice(8)} `
            },
            body: JSON.stringify({
              newOfferName,
              newOfferDescription,
              newOfferValue,
              forServiceID: serviceID
            })
        })
        if (res.status === 200) {
            triggerToaster([...toasters, {element: Toaster, textObj: successObj}])
            resetInput()
            setModal(false)
        } else {
            triggerToaster([...toasters, {element: Toaster, textObj: errorObj}])
        }
        setLoading(false)
        refetch()
    }

    useEffect(() => {
        const verifyFields = verifyInputFields()
        for (let i = 0; i < verifyFields.length; i++) {
            if (verifyFields[i] === false)
                return setButtonDisabled(true)
        }
        return setButtonDisabled(false)
        //eslint-disable-next-line
    }, [newOfferName, newOfferDescription, newOfferValue])
    return (
        <CModal
        size = "lg"
        show={modalOn}
        onClose={() => setModal(!modalOn)}
        color="success"
        centered
        >   
            <HocLoader relative isLoading = {loading} >
                <CRow>
                    <CCol xs = "12" >
                        <CModalHeader closeButton>
                            <CModalTitle>Kampanya Ekle</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormGroup row>
                                <CCol xs = "12" lg="2">
                                    <CLabel>Kampanya adı</CLabel>
                                </CCol>
                                <CCol xs = "12" lg="5">
                                    <CInput invalid = {nameFieldInvalid} placeholder = "Yeni kampanya adını giriniz" value = {newOfferName} onChange = {e => setNewOfferName(e.target.value)} />
                                </CCol>
                                <CCol xs = "12" lg="3">
                                    <CLabel>Kampanya Kârı</CLabel>
                                </CCol>
                                <CCol xs = "12" lg="">
                                    <CInput type = "number" placeholder = "Bu kampanyadan ne kadar para kazanılır" value = {newOfferValue} onChange = {e => setNewOfferValue(e.target.value)} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol xs = "12" lg="2">
                                    <CLabel>Kampanya açıklaması</CLabel>
                                </CCol>
                                <CCol xs = "12" lg="10">
                                    <CTextarea
                                        value = {newOfferDescription}
                                        placeholder = "Kampanyanın açıklamasını giriniz"
                                        onChange = {e => setNewOfferDescription(e.target.value)}
                                        rows = "6"
                                    />
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                        <CModalFooter>
                            <CButton disabled = {buttonDisabled} color="success" onClick={handleSubmit}>Kampanya ekle</CButton>
                            <CButton color="secondary" onClick={() =>{ setModal(!modalOn); resetInput()}}>Kapat</CButton>
                        </CModalFooter>
                    </CCol>
                </CRow>
            </HocLoader>
        </CModal>
    )
}
