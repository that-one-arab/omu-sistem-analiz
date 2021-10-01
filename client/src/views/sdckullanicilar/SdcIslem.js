import React, { useEffect, useState } from 'react'
import AppDataForm from '../../components/appdataform/AppDataForm'
import { mapDataToTurkish } from "../../components/index";

const SdcIslem = ({match}) => {
  const applicationID = match.params.id
  const [data, setData] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/applications/${applicationID}`,{
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'authorization' :`Bearer ${document.cookie.slice(8)} `
          }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        const mappedData = mapDataToTurkish(fetchData)
        console.log(mappedData)
        setData(mappedData[0])
      }
    }
    fetchData()
  }, [applicationID])

    return (
      <AppDataForm userDetails = {data} />
    )
}

export default SdcIslem