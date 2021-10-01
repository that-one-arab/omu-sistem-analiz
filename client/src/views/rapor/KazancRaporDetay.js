import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CCollapse
} from '@coreui/react'
import BasvuruID from '../basvuruid/BasvuruID'
// import XLSX from "xlsx";

const fields = [
  {key: 'başvuru_ID',  _style: { width: '10%'} },
  { key: 'müşteri', _style: { width: '20%'} },
  { key: 'hizmet', _style: { width: '10%'} },
  'önceki_bakiye',
  'tutar',
  'sonraki_bakiye',
  'kazanç_ID',
  'tarih',
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }
]
const toggleDetails = (index, details, setDetails) => {
  const position = details.indexOf(index)
  let newDetails = details.slice()
  if (position !== -1) {
      newDetails.splice(position, 1)
  } else {
      newDetails = [index]
  }
  setDetails(newDetails)
}

const RaporDetay = ({match, location}) => {
  console.log("match", match)
  const { id }= match.params
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [loading, setLoading] = useState(true)
  const [reportsData, setReportsData] = useState(undefined)
  const [details, setDetails] = useState([])

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`${match.url}?sayfa=${newPage}`)
  }

  // const exportFile = () => {
  //   let cols = ["ID", "İsim", "Tarih", "Hizmet", "Kampanya", "Açıklama", "Statü", "S-D Açıklaması", "S-D Açıklama Tarihi", "S-D Son Açıklaması", "S-D Son Açıklama Tarihi" ]
  //   const excelData = JSON.parse(JSON.stringify(reportsData));
  //   excelData.forEach(obj => delete obj.submitProcessNum)
  //   let arrOfArrs = []
  //   for (let i = 0; i < excelData.length; i++) {
  //       arrOfArrs[i] = Object.values(excelData[i])
  //     }
  //   arrOfArrs.unshift(cols)
  //   const ws = XLSX.utils.aoa_to_sheet(arrOfArrs);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Başvurular");
  //   XLSX.writeFile(wb, "başvurular.xlsx")
  // };
  useEffect(() => {
    currentPage !== page && setPage(currentPage)
    const fetchData = async () => {
      setLoading(true)
      const res = await fetch(`/report/transactions?reportID=${id}`, {
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      })
      if (res.status === 200) {
        const data = await res.json()
        console.log("data ", data)
        const mapedDataToTUR = data.map(obj => {
          return {
            başvuru_ID: obj.app_id,
            müşteri: obj.client_name,
            hizmet: obj.selected_service,
            önceki_bakiye: Number(obj.balance_before).toFixed(2),
            tutar: obj.amount,
            sonraki_bakiye: Number(obj.balance_after).toFixed(2),
            kazanç_ID: obj.transaction_id,
            tarih: obj.date
          }
        })
        setReportsData(mapedDataToTUR)
        setLoading(false)
      }
      setLoading(false)
    };
    fetchData();
    // eslint-disable-next-line
  }, [currentPage])

  return (
    <CRow className = "d-flex justify-content-center">
      <CCol xl={12} lg = {10}>
        <CCard>
          <CCardHeader>
            Kazanç
            <small className="text-muted"> DETAY</small>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                // overTableSlot = {<CButton color = "primary" onClick = {() => exportFile()}>Excele aktar</CButton>}
                fields = {fields}
                loading = {loading}
                sorter
                items={reportsData}
                tableFilter
                hover
                itemsPerPage={15}
                activePage={page}
                clickableRows
                onRowClick={(item) => history.push(`/bayi/rapor/kazanc/detay/${item.rapor_id}`)}
                scopedSlots = {{
                'tutar':
                    (item)=>(
                    <td>
                        <p style = {{color: "green", fontSize: "15px"}}>{Number(item.tutar).toFixed(2)} TL</p>
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
                        onClick={()=>{
                          toggleDetails(index, details, setDetails)
                          }}
                      >
                        {details.includes(index) ? 'Sakla' : 'Göster'}
                      </CButton>
                    </td>
                    )
                },
                'details':
                    (item, index)=>{
                      return (
                      <CCollapse show={details.includes(index)}>
                          <CCol sm = "12">
                            <div style = {{marginTop: "15px"}}> </div>
                            <BasvuruID applicationID = {item.başvuru_ID}/>
                          </CCol>
                      </CCollapse>
                    )
                  }
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

export default RaporDetay;
