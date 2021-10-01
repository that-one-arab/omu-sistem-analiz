import React, { useEffect, useState } from "react"

import {
    CCard,
    CCardBody,
    CCardHeader,
    CProgress,
    CRow,
    CCol
} from '@coreui/react'

const percentage =(num, per) => {
  return (num/100)*per;
}

const returnBarColor = (percentage) => {
    if (percentage < 15) return "danger"
    else if (percentage > 15 && percentage < 50) return "warning"
    else if (percentage > 50 && percentage < 100) return "primary"
    else return "success"
}

const HedefProgress = () => {
    const [data, setData] = useState([])

    const fetchData = async () => {
        const res = await fetch('/goal?month=current&year=current', {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${document.cookie.slice(8)} `
            }
        })
        if (res.status === 200) {
            const fetchData =await res.json()
            setData(fetchData)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <CCard>
            <CCardHeader>
                <p>Bu ayki hedefleriniz</p>
            </CCardHeader>
            <CCardBody>
            <CRow className = "justify-content-center"> 
                <CCol sm = "12">
                {
                    data && data.map(goal => {
                        return (
                            <div className="progress-group mb-4" key = {goal.goal_id} >
                                <div className="progress-group-prepend">
                                    <span className="progress-group-text">
                                        {goal.service}
                                    </span>
                                </div>
                                <div className="progress-group-bars">
                                    <CProgress className="progress-xs" color={returnBarColor(percentage(goal.done, goal.goal))} value={percentage(goal.done, goal.goal)} />
                                </div>
                                <span className="progress-group-text" style = {{marginLeft: "5px"}}>
                                    <p>{goal.done} / {goal.goal}</p>
                                </span>
                            </div>
                        )
                    })
                }
                </CCol>
            </CRow>

            </CCardBody>
        </CCard>
    )
}

export default HedefProgress