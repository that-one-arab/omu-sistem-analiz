import React, { useEffect, useState } from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { useHistory } from 'react-router-dom'
import { mapDataToTurkish, getBadge } from "../../components/index";
import qs from "qs"
import customFetch from "../../custom-fetch";

const fetchData = async(service, id, month, year) => {
  // const res = await customFetch(`/sdc/user/${id}/details?service=${service}`, {
  const res = await customFetch(`/applications/details?service=${service}&userID=${id}&month=${month}&year=${year}`, {
    headers: {
      'content-type': 'application/json',
      'authorization' :`Bearer ${document.cookie.slice(8)} `
    }
  })
  const fetchData = await res.json()
  const resData = mapDataToTurkish(fetchData)
  return resData
 }

const SdcIslemler = ({match, location}) => {
  const history = useHistory()
  const urlParams = qs.parse(location.search)
  const [data, setData] = useState([])

 useEffect(() => {
   const fetchAllData = async () => {
     const res = await fetchData(urlParams["?service"], urlParams.id, urlParams.month, urlParams.year);
     setData(res)
   }
   fetchAllData()
   // eslint-disable-next-line
 }, [])

 const fields = [
   { key: 'İsim', _style: { width: '25%'} },
   { key: 'Tarih', _style: { width: '25%'} },
   { key: 'Tip', _style: { width: '25%'} },
   { key: 'Statü', _style: { width:'25%'}},
   {
     key: 'show_details',
     label: '',
     _style: { width: '1%' },
     sorter: false,
     filter: false
   }
 ]

     return (
<>
   <CDataTable
     items={data}
     fields={fields}
     columnFilter
     tableFilter
     footer
     itemsPerPageSelect
     itemsPerPage={20}
     hover
     sorter
     pagination
     scopedSlots = {{
       'Statü':
         (item)=>(
           <td>
             <CBadge color={getBadge(item.Statü)}>
               {item.Statü}
             </CBadge>
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
                 onClick={() => history.push(`/islem/${item.ID}`)}
               >
                 Detaylar
               </CButton>
             </td>
             )
         }
     }}
   />
</>
 )
}

export default SdcIslemler;