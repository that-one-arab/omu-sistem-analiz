import {
    CCol,
    CRow,
    CModal,
    CModalTitle,
    CModalHeader,
    CModalBody,
    CButton,
    CFormGroup,
    CLabel,
    CInput,
    CSelect
} from '@coreui/react'
import { useEffect, useState, memo } from 'react'

import Toaster from "../../components/toaster/Toaster2"
import HocLoader from '../hocloader/HocLoader'

const successObj = {
    color: "success",
    body: "Değişikleriniz başarıyla tamamlanmıştır!"
}

const errorObj = {
    color: "danger",
    body: "Bir hata oldu, lütfen daha sonra tekrar deneyin"
}



// in this component, the component fetches services from the backend, and maps the in a select tag.
// ideally I would like for the component to only map services that doesn't have a goal, by comparing them
// to the goals array above.
const AddGoal = ({ modalOn, setModal, goals, dealer, month, year, toasters, triggerToaster, refetch}) => {
    const [services, setServices] = useState([])
    const [service, setService] = useState("0")
    const [goal, setGoal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(true)

    const [goalFieldInvalid, setGoalFieldInvalid] = useState(false)

    function verifyGoalDoesntExist() {
        if (goals) {
            if (goals.find(obj => obj.service_id === Number(service))) {
                setGoalFieldInvalid(true)
                return false
            }
            setGoalFieldInvalid(false)
            return true
        }
    }

    function verifyInputFields() {
        let changesArr = [false, false]
        if (service !== "0" && verifyGoalDoesntExist() === true)
            changesArr[0] = true
        else
            changesArr[0] = false

        if (Number(goal) >= 1)
            changesArr[1] = true
        else
            changesArr[1] = false

        return changesArr
    }

    function resetInput() {
        setService({})
        setGoal(0)
    }

    async function handleSubmit() {
        const dealerID = dealer.user_id
        const dateString = `${year}-${month}-01`
        setLoading(true)
        const res = await fetch(`/goal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(8)} `
            },
            body: JSON.stringify({
                userID: dealerID,
                date: dateString,
                service: service,
                goal: goal
            })
        })
        if (res.status === 200) {
            triggerToaster([...toasters, { element: Toaster, textObj: successObj }])
            resetInput()
            setModal(false)
        } else {
            triggerToaster([...toasters, { element: Toaster, textObj: errorObj }])
        }
        setLoading(false)
        refetch()
    }

    // fetch data use effect
    useEffect(() => {
        const fetchServices = async () => {
            const res = await fetch(`/services?active=true` , {
                headers: {
                  'content-type': 'application/json',
                  'authorization' :`Bearer ${document.cookie.slice(8)} `
                }
            })
            if (res.status === 200) {
                const fetchData = await res.json()
                setServices(fetchData)
            }
        }
        fetchServices()
    }, [])

    // useEffect for verifiyng user input
    useEffect(() => {
        const verifyFields = verifyInputFields()
        for (let i = 0; i < verifyFields.length; i++) {
            if (verifyFields[i] === false)
                return setButtonDisabled(true)
        }
        return setButtonDisabled(false)
        //eslint-disable-next-line
    }, [service, goal])
    return (
        <CModal
            size="lg"
            show={modalOn}
            onClose={() => setModal(!modalOn)}
            color="success"
            centered
        >
            <HocLoader relative isLoading={loading} >
                <CRow>
                    <CCol xs="12" >
                        <CModalHeader closeButton>
                            <CModalTitle>Hedef ekle</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CFormGroup row>
                                <CCol xs="12" lg="1">
                                    <CLabel>Hizmet</CLabel>
                                </CCol>
                                <CCol xs="12" lg="3">
                                    <CSelect invalid = {goalFieldInvalid} onChange = {e => setService(e.target.value)} >
                                        <option value ={"0"} ></option>
                                        {services && services.map(obj => {
                                            return <option key={obj.service_id} value = {obj.service_id}>{obj.name}</option>
                                        })}
                                    </CSelect>
                                </CCol>
                                <CCol xs="12" lg="1">
                                    <CLabel>Hedef</CLabel>
                                </CCol>
                                <CCol xs="12" lg="2">
                                    <CInput type="number" value={goal} onChange={e => setGoal(e.target.value)} />
                                </CCol>
                                <CCol xs="12" lg="1" >

                                </CCol>
                                <CCol xs="12" lg="4" style = {{position: "relative"}} >
                                    <div id = "AddGoal-modal-footer-div" >
                                        <CButton disabled={buttonDisabled} color="success" onClick={handleSubmit}>Hedef ekle</CButton>
                                        <CButton color="secondary" onClick={() => { setModal(!modalOn); resetInput() }}>Kapat</CButton>
                                    </div>
                                </CCol>
                            </CFormGroup>
                        </CModalBody>
                    </CCol>
                </CRow>
            </HocLoader>
        </CModal>
    )
}

export default memo(AddGoal)