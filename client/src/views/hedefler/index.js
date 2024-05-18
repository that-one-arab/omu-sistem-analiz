import React, { useEffect, useState, memo } from "react"
import { CSelect } from "@coreui/react"
import "./hedefler.css"
import customFetch from "../../custom-fetch";

export function mapYears() {
    let dateArr = []
    for (let i = new Date().getFullYear(); i >= 2000; i--) {
      dateArr.push(i)
    }
    return dateArr
  }
  
export function mapMonths() {
    const firstMonth = 1
    let dateArr = []
    for (let i = 12; i >= firstMonth; i--) {
      if(i < 10){
        i = '0' + i;
      }
      dateArr.push(i)
    }
    return dateArr
  }


export function currentYear() {
    return new Date().getFullYear()
}

export function currentMonth() {
  const crntMonth = new Date().getMonth()+1
  if (crntMonth < 10)
    return '0' + crntMonth
  return crntMonth
}

export function mapGoalsData(data) {
  return data.map(obj => {
    return {
      hizmet: obj.service,
      yapılan: obj.done,
      hedef: obj.goal,
      for_date: obj.for_date,
      for_user_id: obj.for_user_id,
      service_id: obj.service_id,
      goal_id: obj.goal_id,
      submit_date: obj.submit_date,
      success: obj.success
    }
  })
}

export const fields = [
  { key: 'hizmet', _style: { width: '80%'} },
  { key: 'yapılan', _style: { width: '10%'} },
  { key: 'hedef', _style: { width: '10%'} }
  // {
  //   key: 'show_details',
  //   label: '',
  //   _style: { width: '1%' },
  //   sorter: false,
  //   filter: false
  // }
]

// NEEDS to select dealer as an object not as a name
export const DealersField = memo(({setDealer}) => {
  const [dealers, setDealers] = useState([])

  // finds the dealer object referencing the dealer's id, and calls setDealer with the value of the found object
  function handleSetDealer(dealerID){
    const foundDealerObj = dealers.find(obj => obj.user_id === dealerID)
    if (foundDealerObj) setDealer(foundDealerObj)
    else setDealer({})
  }
  
  useEffect(() => {
      const fetchData = async () => {
          const res = await customFetch(`/users`, {
              headers: {
                'content-type': 'application/json',
              }
          })
          if (res.status === 200) {
              const fetchData = await res.json()
              const filteredData = fetchData.filter(obj => obj.role === "dealer")
              console.log('data: ', filteredData)
              setDealers(filteredData)
          }
      }
      fetchData()
  }, [])
  return (
      <CSelect onChange = {(e) => handleSetDealer(e.target.value)} >
          <option value = {"0"}></option>
          {
              dealers && dealers.map(dealer => <option key={dealer.user_id} value={dealer.user_id}>{dealer.name}</option>)
          }
      </CSelect>
  )
})

export const DateField = memo(({setMonth, setYear}) => {
  const months = mapMonths()
  const years = mapYears()
  return (
      <div id = "date-fields-div">
          <CSelect onChange = {e => setMonth(e.target.value)} defaultValue = {currentMonth()} >
              {months.map(month => <option value={month} key={month}>{month}</option>)}
          </CSelect>
          <p id = "month-year-seperator-slash" >-</p>
          <CSelect onChange = {e => setYear(e.target.value)} >
              {years.map(year => <option value={year} key={year}>{year}</option>)}
          </CSelect>
      </div>
  )
})