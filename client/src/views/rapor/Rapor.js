import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import qs from "qs"
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton
} from '@coreui/react'
import XLSX from "xlsx";
import { getBadge, mapDataToTurkish } from '../../components'
import { switchRaporHeader } from "."
import customFetch from '../../custom-fetch';

// it returns a query string to allow for dynamic fetching from server
const returnRaporQueryString = (queryObj) => {
  let url = ""
  for (const key in queryObj) {
      if (key === "sayfa" || key === "?sayfa" || key === "q" || key === "?q")
        continue
      else
        url = url+key+"="+queryObj[key]+"&"
  }
  let removeLastAndChar = url.slice(0, -1)
  if (removeLastAndChar.charAt(0) === "?")
    return removeLastAndChar.substr(1)

  return removeLastAndChar
}

const Rapor = ({match, location}) => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [loading, setLoading] = useState(true)
  const [usersData, setUsersData] = useState(undefined)
  const qsQuery = qs.parse(location.search)
  const qsQueryString = returnRaporQueryString(qsQuery)
  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/bayi/islemler/rapor?sayfa=${newPage}&${qsQueryString}`)
  }

  const exportFile = () => {
    let cols = ["ID", "İsim", "Tarih", "Hizmet", "Kampanya", "Açıklama", "Statü", "S-D Açıklaması", "S-D Açıklama Tarihi", "S-D Son Açıklaması", "S-D Son Açıklama Tarihi" ]
    const excelData = JSON.parse(JSON.stringify(usersData));
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
    currentPage !== page && setPage(currentPage)
    const fetchData = async () => {
      setLoading(true)
      const url = `/applications/details/?${qsQueryString}`
      const res = await customFetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        const mappedData = mapDataToTurkish(fetchData)
        setUsersData(mappedData)
      }
      setLoading(false)
    };
    fetchData();
    // eslint-disable-next-line
  }, [qsQuery["?status"], currentPage])

  return (
    <CRow className = "d-flex justify-content-center">
      <CCol xl={10}>
        <CCard>
          <CCardHeader>
            Raporunuz
            <small className="text-muted"> {switchRaporHeader(qsQuery["?status"])} işlemler</small>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                overTableSlot = {<CButton color = "primary" onClick = {() => exportFile()}>Excele aktar</CButton>}
                loading = {loading}
                sorter
                items={usersData}
                fields={[
                { key: 'İsim', _classes: 'font-weight-bold' },
                'Tarih', 'Hizmet', 'Statü'
                ]}
                tableFilter
                hover
                striped
                itemsPerPage={15}
                activePage={page}
                clickableRows
                onRowClick={(item) => history.push(`/islem/${item.ID}`)}
                scopedSlots = {{
                'Statü':
                    (item)=>(
                    <td>
                        <CBadge color={getBadge(item.Statü)}> 
                        {item.Statü}
                        </CBadge>
                    </td>
                    )
                }}
            />
            <CPagination
                activePage={page}
                onActivePageChange={pageChange}
                pages={15}
                doubleArrows={false} 
                align="center"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Rapor;
