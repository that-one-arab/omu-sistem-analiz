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
  CButton
} from '@coreui/react'
import Select from "react-select"
import "./style.css"
import ToggleSwitch from '../../components/toggleswitch/ToggleSwitch'
import HocLoader from '../hocloader/HocLoader'
import Modal from "../../components/modals/Modal"
import { compare, mapUsersData } from '.'

const fields = [
  { key: 'ID', _style: { width: '20%'} },
  { key: 'Kullanıcı', _style: { width: '20%'} },
  { key: 'Röl', _style: { width: '20%'} },
  { key: "Bakiye", _style: {width: '15%'}},
  { key: "Kayıt_tarihi", _style: {width: '15%'}},
  { key: 'Aktif', _style: { width:'10%'}},
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }
]

const selectRoleOptions = [
  { value: 'sales_assistant', label: 'Satış Destek' },
  { value: 'dealer', label: 'Bayi' }
]

const SdcKullanicilar = () => {
  const history = useHistory()
  const queryPage = useLocation().search.match(/sayfa=([0-9]+)/, '')
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1)
  const [page, setPage] = useState(currentPage)
  const [usersData, setUsersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOn, setModalOn] = useState(false)

  const pageChange = newPage => {
    currentPage !== newPage && history.push(`/sdc/kullanicilar?sayfa=${newPage}`)
  }

  const toggleUserActive = (setState, itemID, state) => {
    const stateCopy = [...state]
    const i = stateCopy.findIndex(obj => obj.ID === itemID)
    stateCopy[i].Aktif = !stateCopy[i].Aktif
    setState(stateCopy)
  }

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch("/users", {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    if (res.status === 200) {
      const fetchData = await res.json()
      const mappedData = mapUsersData(fetchData)
      // *** I had to sort the data here because I couldn't figure out how to default sort it in the coreUI table component below
      const sortedData = mappedData.sort(compare);
      setUsersData(sortedData)
      setLoading(false)
    }
  };

  const changeUserRole = async (newRole, userID) => {
    setLoading(true)
    const res = await fetch(`/user/assign/role?userID=${userID}&toRole=${newRole}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    if (res.status === 200) {
      fetchData()
    } else {
      setModalOn(true)
    }
    setLoading(false)
  }

  const updateUserActiveState = async (userID) => {
    setLoading(true)
    const res = await fetch(`/user/active/${userID}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization' :`Bearer ${document.cookie.slice(8)} `
      }
    })
    setLoading(false)
    if (res.status === 200) {
      fetchData()
    } else {
      // setModalOn(true)
      fetchData()
    }
  }

  useEffect(() => {
    currentPage !== page && setPage(currentPage)

    fetchData();
  }, [currentPage, page])

  return (
    <HocLoader isLoading = {false} absolute = {true}>
      <Modal modalOn = {modalOn} setModal = {setModalOn} color = "danger" header = "Hata" body = "Sunucu hatasından dolayı güncelleme sağlanmamıştır, lütfen tekrar deneyin" />
      <CRow className = "d-flex justify-content-center">
        <CCol xl={12}>
          <CCard>
            <CCardHeader>
              Kullanıcılar
            </CCardHeader>
            <CCardBody>
              <CDataTable
                  columnFilter
                  fields = {fields}
                  loading = {loading}
                  responsive
                  items={usersData}
                  hover
                  itemsPerPage={30}
                  activePage={page}
                  clickableRows
                  scopedSlots = {{
                    "Aktif":
                      (item, index) => {
                        if (item.Röl === "Satış Destek Şefi" || item.Röl === "Admin")
                          return (
                          <td>
                            <ToggleSwitch
                              id={`userActive${item.ID}`}
                              checked={item.Aktif}
                              disabled
                            />
                          </td>
                          )
                        else return (
                          <td>
                            <ToggleSwitch
                              id={`userActive${item.ID}`}
                              checked={item.Aktif}
                              onChange={() => {
                                toggleUserActive(setUsersData, item.ID, usersData)
                                updateUserActiveState(item.ID)
                                }}
                            />
                          </td>
                        )
                      },
                    "Bakiye":
                      (item, index) => (
                        <td>
                          <p style = {{color: "green"}}>{item.Bakiye} {item.Bakiye === "Yok" ? "" : "TL"}</p>
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
                              onClick={() => history.push(`/sdc/kullanici/${item.ID}`)}
                            >
                              Detaylar
                            </CButton>
                          </td>
                          )
                      },
                    'Röl':
                    (item, index)=>{
                      return (
                        <td>
                          <Select options = {selectRoleOptions} placeholder = {item.Röl} onChange = {e => changeUserRole(e.value, item.ID)} />
                        </td>
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
    </HocLoader>
  )
}

export default SdcKullanicilar;
