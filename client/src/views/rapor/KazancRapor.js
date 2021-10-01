import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'
// import XLSX from "xlsx";

const Rapor = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [loading, setLoading] = useState(true)
  const [reportsData, setReportsData] = useState(undefined)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/bayi/islemler/rapor?sayfa=${newPage}`)
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
      const res = await fetch("/report/transactions", {
        headers: {
          'content-type': 'application/json',
          'authorization' :`Bearer ${document.cookie.slice(8)} `
        }
      })
      if (res.status === 200) {
        const data = await res.json()
        const mapedDataToTUR = data.map(obj => {
          return {
            rapor_id: obj.report_id,
            toplam_kazanç: obj.transaction_total,
            tarih: obj.date.slice(0, 10)
          }
        })
        setReportsData(mapedDataToTUR)
      }
      setLoading(false)
    };
    fetchData();
    // eslint-disable-next-line
  }, [currentPage])

  return (
    <CRow className = "d-flex justify-content-center">
      <CCol xl={10}>
        <CCard>
          <CCardHeader>
            Kazanç
            <small className="text-muted"> raporlarınız</small>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                // overTableSlot = {<CButton color = "primary" onClick = {() => exportFile()}>Excele aktar</CButton>}
                loading = {loading}
                sorter
                items={reportsData}
                tableFilter
                hover
                striped
                itemsPerPage={15}
                activePage={page}
                clickableRows
                onRowClick={(item) => history.push(`/bayi/rapor/kazanc/detay/${item.rapor_id}`)}
                scopedSlots = {{
                'toplam_kazanç':
                    (item)=>(
                    <td>
                        <p style = {{color: "green", fontSize: "15px"}}>{Number(item.toplam_kazanç).toFixed(2)} TL</p>
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
