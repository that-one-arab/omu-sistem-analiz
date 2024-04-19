import React, { useEffect, useState } from "react";
import { CDataTable, CBadge, CButton } from "@coreui/react";
import { useHistory } from 'react-router-dom'
import XLSX from "xlsx";
import { mapDataToTurkish, getBadge } from '../../components/index'
import customFetch from "../../custom-fetch";

const BasvurularGoruntule = () => {
  const history = useHistory()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const exportFile = () => {
    let cols = ["ID", "İsim", "Tarih", "Hizmet", "Kampanya", "Açıklama", "Statü", "S-D Açıklaması", "S-D Açıklama Tarihi", "S-D Son Açıklaması", "S-D Son Açıklama Tarihi" ]
    const excelData = JSON.parse(JSON.stringify(data));
    excelData.forEach(obj => delete obj.submitProcessNum)
    let arrOfArrs = []
    for (let i = 0; i < excelData.length; i++) {
        arrOfArrs[i] = Object.values(excelData[i])
      }
    arrOfArrs.unshift(cols)
    const ws = XLSX.utils.aoa_to_sheet(arrOfArrs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Başvurular");
    XLSX.writeFile(wb, "başvurular.xlsx")
  };

 useEffect(() => {
  const fetchData = async() => {
    try {
      const res = await customFetch("/applications/details?interval=ALL", {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      })
      const fetchData = await res.json()
      const resData = mapDataToTurkish(fetchData)
      setData(resData)
      
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
   }
   fetchData();
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
     overTableSlot = {<CButton color = "primary" onClick = {() => exportFile()}>Excele aktar</CButton>}
     items={data}
     fields={fields}
     loading= {loading}
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
                 onClick={() => history.push(`/basvurular/detay/${item.ID}`)}
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

export default BasvurularGoruntule;