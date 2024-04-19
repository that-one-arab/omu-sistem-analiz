import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CLabel,
  CSelect,
  CRow,
  CDataTable,
  CButton
} from '@coreui/react';
import HocLoader from "../hocloader/HocLoader"
import { ModifyOffer, ConfirmDeleteModal, ModifyService, AddService, AddOffer } from '.';
import customFetch from '../../custom-fetch';

function mapOffersData(offers) {
    return offers.map(obj => {
        return {
            kampanya_ismi: obj.name,
            kampanya_açıklaması: obj.description,
            değeri: `${obj.value}` ,
            aktif: obj.active === true ? "Evet" : "Hayır",
            offer_id: obj.offer_id,
            service_id: obj.service_id
        }
    })
}

function matchServiceWithServicesData(serviceID, servicesData) {
    const selectedOffer = servicesData.find(obj => obj.service_id === Number(serviceID))
    return selectedOffer
}

const fields = [
    { key: 'kampanya_ismi', _style: { width: '20%'} },
    { key: 'kampanya_açıklaması', _style: { width: '20%'} },
    { key: 'aktif', _style: { width: '20%'} },
    { key: "değeri", _style: {width: '15%'}},
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

const Hizmetler = () => {
    const [servicesLoading, setServicesLoading] = useState(false)
    const [servicesData, setServicesData] = useState([])
    const [selectedService, setSelectedService] = useState("0")
    const [selectedServiceObj, setSelectedServiceObj] = useState({})

    const [offersLoading, setOffersLoading] = useState(false)
    const [offersData, setOffersData] = useState([])
    const [selectedOffer, setSelectedOffer] = useState({})

    const [toasters, addToaster] = useState([])

    const [confirmDeleteServiceModal, setConfirmDeleteServiceModal] = useState(false)
    const [modifyOffer, setModifyOffer] = useState(false)
    const [modifyServiceModal, setModifyServiceModal] = useState(false)
    const [addServiceModal, setAddServiceModal] = useState(false)
    const [addOfferModal, setAddOfferModal] = useState(false)

    const fetchServices = async () => {
        setServicesLoading(true)
        const res = await customFetch("/services?active=true", {
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
        })
        let data = []
        if (res.status === 200) {
            const fetchedData = await res.json()
            setServicesData(fetchedData)
            data = fetchedData
        }
        setServicesLoading(false)
        return data
    }
    useEffect(() => {
        fetchServices()
        //eslint-disable-next-line
    }, [])

    const fetchOffers = async () => {
        setOffersLoading(true)
        const res = await customFetch(`/service/${selectedService}?active=true`, {
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
        })
        let data
        if (res.status === 200) {
            const fetchedData = await res.json()
            const mappedData = mapOffersData(fetchedData)
            setOffersData(mappedData)
            data = mappedData
        } else if (res.status === 406) {
            setOffersData([])
        }
        setOffersLoading(false)
        return data
    }
    useEffect(() => {
        fetchOffers()
        //eslint-disable-next-line
    }, [selectedService])

    const fetchAll = () => {
        fetchServices()
        fetchOffers()
    }

    return (
        <CRow className="d-flex justify-content-center">
        {/* renders a toaster */}
        {toasters && toasters.map((toaster, i) => ( toaster.element(toaster.textObj, i)))}
        {   // EditingModal is responsible for updating an offer's details, such as name, description, value and active
            modifyOffer && 
            <ModifyOffer show = {modifyOffer} setModal = {setModifyOffer} 
            offer = {selectedOffer} toasters = {toasters} triggerToaster = {addToaster} refetch = {fetchOffers} />
        }
        { // ConfirmDeleteModal is responsible for confirming a delete on a service. 
            selectedService !== "0" ?
            <ConfirmDeleteModal 
            modalOn = {confirmDeleteServiceModal} setModal = {setConfirmDeleteServiceModal} toasters = {toasters}  
            refetch = {fetchAll} serviceID = {selectedService} triggerToaster = {addToaster} />
            :
            null
        }
        { // ModifyService modal is responsible for modifiyng a service's details, such as name and description
            selectedService !== "0"?
            <ModifyService modalOn = {modifyServiceModal} setModal = {setModifyServiceModal} service = {selectedServiceObj}
            toasters = {toasters} triggerToaster = {addToaster} refetch = {fetchServices} />
            :
            null
        }
            <AddService modalOn = {addServiceModal} setModal = {setAddServiceModal} toasters = {toasters} triggerToaster = {addToaster} refetch = {fetchServices} services = {servicesData} />
            <AddOffer modalOn = {addOfferModal} setModal = {setAddOfferModal} toasters = {toasters} triggerToaster = {addToaster} refetch = {fetchOffers} offers = {offersData} serviceID = {selectedService} />
            <CCol xs="12" md="12">
                <CCard>
                    <CCardHeader className="basvuruFormHeader">
                        Hizmetler
                    </CCardHeader>
                    <CCardBody>
                            <CFormGroup row >
                                <CCol xs = "12" md = "1" >
                                    <CLabel>Hizmet seçiniz:</CLabel>
                                </CCol>
                                <CCol xs = "12" md = "2">
                                    <HocLoader isLoading = {servicesLoading} relative>
                                        <CSelect onChange = {(e) =>{
                                             setSelectedService( e.target.value); 
                                             setSelectedServiceObj(matchServiceWithServicesData(e.target.value, servicesData)) 
                                        }}>
                                            <option value = {0} ></option>
                                            {servicesData && servicesData.map((service) => (
                                                <option key = {service.service_id} value = {service.service_id}>{service.name}</option>))}
                                        </CSelect>
                                    </HocLoader>
                                </CCol>
                                <CCol xs = "4" md = "1">
                                    <CButton disabled = {selectedService === "0" ? true : false} color = "danger" shape = "ghost" onClick = {()=> setConfirmDeleteServiceModal(true)} >SİL</CButton>
                                </CCol>
                                <CCol xs = "4" md = "2">
                                    <CButton disabled = {selectedService === "0" ? true : false} color = "info" shape = "ghost" onClick = {()=> setModifyServiceModal(true)} >Hizmet detayları</CButton>
                                </CCol>
                                <CCol xs = "4" md = "2">
                                    <CButton color = "success" shape = "ghost" onClick = {()=> setAddServiceModal(true)} >Hizmet ekle</CButton>
                                </CCol>
                                <CCol xs = "4" md = "2">
                                    <CButton disabled = {selectedService === "0" ? true : false} color = "secondary" shape = "ghost" onClick = {()=> setAddOfferModal(true)} >Kampanya ekle</CButton>
                                </CCol>
                            </CFormGroup>
                            {/* if a service is selected, render the offers table */}
                            {
                                selectedService !== "0" ?
                                    <CDataTable
                                        items={offersData}
                                        fields={fields}
                                        loading = {offersLoading}
                                        hover
                                        scopedSlots = {{
                                        'değeri':
                                            (item)=>(
                                            <td>
                                                <p style = {{color: "green"}} >{item.değeri} TL</p>
                                            </td>
                                            ),
                                        'show_details':
                                            (item, index)=>{
                                            return (
                                            <td className="py-2">
                                                <CButton
                                                    color="primary"
                                                    variant="outline"
                                                    shape="square"
                                                    size="sm"
                                                    onClick={() => {setSelectedOffer(item); setModifyOffer(true)}}
                                                >
                                                    Değiştir
                                                </CButton>
                                            </td>
                                            )
                                        }
                                        }}
                                    />
                                    : null
                            }
                    </CCardBody>
                    {/* <CCardFooter>
                        <CButton type="submit" size="sm" color="primary" onClick={onSubmit} disabled = {inputFieldsNotEmpty} ><CIcon name="cil-scrubber" /> Gönder</CButton>
                        <CButton type="reset" size="sm" color="danger" onClick={resetInput}  ><CIcon name="cil-ban" /> Resetle</CButton>
                    </CCardFooter> */}
                </CCard>
            </CCol>
        </CRow>
    )
}


export default React.memo(Hizmetler)