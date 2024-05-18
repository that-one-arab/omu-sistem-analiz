import React, { useEffect, useState } from 'react'
import AppDataForm from '../../components/appdataform/AppDataForm'
import { mapDataToTurkish } from "../../components/index";
import HocLoader from "../hocloader/HocLoader"
import customFetch from '../../custom-fetch';

const BasvuruID = ({match, applicationID}) => {
  let appID
  if (match)
    appID = match.params.id
  else if (applicationID)
    appID = applicationID
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const res = await customFetch(`/application/${appID}`,{
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        const mappedData = mapDataToTurkish(fetchData)
        setData(mappedData[0])
      }
      setLoading(false)
    }
    fetchData()
  }, [appID])

    return (
      <HocLoader relative = {true} isLoading = {loading}>
        <AppDataForm userDetails = {data} />
      </HocLoader>
    )
}

export default BasvuruID