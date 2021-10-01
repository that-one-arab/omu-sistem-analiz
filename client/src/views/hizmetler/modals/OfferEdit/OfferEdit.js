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
    CTextarea
  } from '@coreui/react'
import { useEffect, useState, memo } from 'react'

import Toaster from "../../../../components/toaster/Toaster2"
import HocLoader from '../../../hocloader/HocLoader'
import { successObj, errorObj } from '../../index'


const OfferEdit = ({offer, show, onClose, toasters, triggerToaster, refetch}) => {
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
        onClose={() => onClose(!show)}
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
            </CModalBody>
            <CModalFooter>
                <CButton color = "success" disabled = {buttonDisabled} onClick = {handleSubmit} >Değiştir</CButton>
                <CButton color="secondary" onClick={() => onClose(!show)}>Kapat</CButton>
            </CModalFooter>
            </HocLoader>
        </CModal>
    )
}

export default memo(OfferEdit)