import React, { useEffect, useState } from "react"
import {
    CCard,
    CCardBody,
    CFormGroup,
    CCol,
    CLabel,
    CDataTable,
    CButton
} from "@coreui/react"
import "./hedefler.css"
import AddGoal from "./AddGoal"
import { currentYear, currentMonth, mapGoalsData, fields, DateField, DealersField } from "."
import customFetch from "../../custom-fetch";

const Hedefler = () => {
    const [dealer, setDealer] = useState({})
    const [month, setMonth] = useState(currentMonth())
    const [year, setYear] = useState(currentYear())
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(false)
    const [addGoalModal, setAddGoalModal] = useState(false)
    const [toasters, addToaster] = useState([])

    const fetchGoals = async () => {
        setLoading(true)
        const res = await customFetch(`/goal?userID=${dealer.user_id}&month=${month}&year=${year}` , {
            headers: {
              'content-type': 'application/json',
              'authorization' :`Bearer ${document.cookie.slice(8)} `
            }
        })
        if (res.status === 200) {
            const data = await res.json()
            const mappedData = mapGoalsData(data)
            setGoals(mappedData)
        }
        setLoading(false)
    }

    useEffect(() => {
        // NEEDS to handle dealer as an object not as a string
        if (dealer.user_id !== undefined)
            fetchGoals()
        //eslint-disable-next-line
    }, [dealer, month, year])
    return (
        <CCard>

            {toasters && toasters.map((toaster, i) => ( toaster.element(toaster.textObj, i)))}

            <AddGoal modalOn={addGoalModal} setModal={setAddGoalModal} toasters={toasters} triggerToaster={addToaster} refetch={fetchGoals} goals={goals} month={month} year={year} dealer={dealer} />

            <CCardBody>
                <CFormGroup row>
                    <CCol xs = "12" lg = "1">
                        <CLabel>Bayi</CLabel>
                    </CCol>
                    <CCol xs = "12" lg = "3" >
                        <DealersField setDealer = {setDealer} />
                    </CCol>
                    <CCol xs = "12" lg = "4" ></CCol>

                    <CCol xs = "12" lg = "1">
                        <CLabel>Tarih</CLabel>
                    </CCol>
                    <CCol xs = "12" lg = "2" >
                        <DateField setYear = {setYear} setMonth = {setMonth} />
                    </CCol>
                </CFormGroup>
                <div id = "add-goal-div-row" >
                    <CButton color = "info" id = "add-goal-div-row-button" 
                        onClick = {() => setAddGoalModal(true)} disabled = {dealer.user_id !== undefined ? false : true}
                    >Hedef ekle</CButton>
                </div>
                <CDataTable
                    items={goals}
                    fields={fields}
                    tableFilter
                    loading = {loading}
                    hover
                    // clickableRows
                    // onRowClick={(item) => { setModal(true); setModalData(item)}}
                    // scopedSlots = {{
                    // 'değeri':
                    //     (item)=>(
                    //     <td>
                    //         <p style = {{color: "green"}} >{item.değeri} TL</p>
                    //     </td>
                    //     ),
                    // 'show_details':
                    //     (item, index)=>{
                    //     return (
                    //     <td className="py-2">
                    //         <CButton
                    //             color="primary"
                    //             variant="outline"
                    //             shape="square"
                    //             size="sm"
                    //             onClick={() => {setSelectedOffer(item); setModifyOffer(true)}}
                    //         >
                    //             Değiştir
                    //         </CButton>
                    //     </td>
                    //     )
                    // }
                    // }}
                />
            </CCardBody>
        </CCard>
    )
}

export default React.memo(Hedefler)