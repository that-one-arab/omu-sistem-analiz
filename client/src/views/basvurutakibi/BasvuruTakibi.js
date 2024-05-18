import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CPagination
} from '@coreui/react'
import ApplicationViewModal from '.'
import { mapDataToTurkish, getBadge } from "../../components/index"
import customFetch from '../../custom-fetch';

const BasvuruTakibi = () => {
  // code lines for setting up pagnation
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  
  const history = useHistory()
  const [usersData, setUsersData] = useState(undefined)
  const [modal, setModal] = useState(false)
  const [modalData, setModalData] = useState({})
  const [loading, setLoading] = useState(true)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/basvuru/takip?sayfa=${newPage}`)
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)
    const getData = async () => {
      const res = await customFetch("/applications/details?interval=today", {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        }
      })
      if (res.status === 200) {
        const fetchData = await res.json()
        const resData = mapDataToTurkish(fetchData)
        setUsersData(resData)
      }
      setLoading(false)
    };
    getData();
  }, [currentPage, page])

  return (
    <CRow className = "d-flex justify-content-center">
      {
        usersData ? <ApplicationViewModal show = {modal} userDetails = {modalData} onClose = {setModal} /> : null
      }
      <CCol xl={12}> 
        <CCard>
          <CCardHeader>
            Bugünkü başvurularınız
          </CCardHeader>
          <CCardBody>
            <CDataTable
                tableFilter
                items={usersData}
                fields={[
                { key: 'İsim', _classes: 'font-weight-bold' },
                'Tarih', 'Hizmet', 'Statü'
                ]}
                loading = {loading}
                hover
                striped
                itemsPerPage={30}
                activePage={page}
                clickableRows
                onRowClick={(item) => { setModal(true); setModalData(item)}}
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

export default BasvuruTakibi;
