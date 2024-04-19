import {
    CModal,
    CModalTitle,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton
  } from '@coreui/react'
import { useState, memo } from 'react'

import Toaster from "../../../../components/toaster/Toaster2"
import HocLoader from '../../../hocloader/HocLoader'
import { successObj, errorObj } from '../../index'
import customFetch from '../../../../custom-fetch';

const ConfirmDeleteModal = ({ modalOn, setModal, serviceID, toasters, triggerToaster, refetch }) => {
    const [loading, setLoading] = useState(false)
    const confirmDelete = async () => {
        setLoading(true)
        const res = await customFetch(`/service?serviceID=${serviceID}`, {
              method: 'DELETE',
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
                    <h5 style = {{textAlign: "center"}}>Bu hizmeti silmek istediğinizden emin misiniz? hizmeti </h5>
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" onClick={confirmDelete}>Onayla</CButton>
                    <CButton color="secondary" onClick={() => setModal(!modalOn)}>Kapat</CButton>
                </CModalFooter>
            </HocLoader>
        </CModal>
    )
}

export default memo(ConfirmDeleteModal)