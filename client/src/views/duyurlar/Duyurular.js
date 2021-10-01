 import React, { useState } from "react";
 import { CDataTable, CBadge, CButton, CCollapse, CCardBody } from "@coreui/react";

 
 
 const duyuruData = [
        {id: 0, KayıtTarihi: '13.02.2020', Duyuru: 'Güncel ÖKC POS Faturasız Paket ve Kategori Listesi', Bitiş_Tarihi: '13.02.2020', status: 'Pending'},
        {id: 1, KayıtTarihi: '12.12.2019', Duyuru: 'Selfy Faturasız Fırsat 15 Paketi', Bitiş_Tarihi: '13.02.2020', status: 'Active'},
        {id: 2, KayıtTarihi: '30.10.2019', Duyuru: 'Satış Sonrası Süreçlerin Suistimali Hakkında Bilgilendirme', Bitiş_Tarihi: '13.02.2020', status: 'Banned'},
        {id: 3, KayıtTarihi: '26.10.2019', Duyuru: 'Sil Süpür Faturalı Müşteri Katılım Koşullarında Güncelleme', Bitiş_Tarihi: '13.02.2020', status: 'Inactive'},
        {id: 4, KayıtTarihi: '30.10.2019', Duyuru: 'Abonelik İşlemlerinde Dikkat Edilmesi Gereken Konular', Bitiş_Tarihi: '13.02.2020', status: 'Pending'},
        {id: 5, KayıtTarihi: '15.10.2018', Duyuru: 'Kurumsal Sabit İnternette İlk 3 Ay Bedava Kampanyası-Kurumsal Süreç- Genişbant.', Bitiş_Tarihi: '13.02.2020', status: 'Active'},
        {id: 6, KayıtTarihi: '30.10.2019', Duyuru: 'Selfy’nin Faturasız Dijital X Large Paketi', Bitiş_Tarihi: '13.02.2020', status: 'Active'},
        {id: 7, KayıtTarihi: '13.02.2020', Duyuru: 'General Mobile GM 8 2019 Edition Kampanyası', Bitiş_Tarihi: '13.02.2020', status: 'Banned'},
        {id: 8, KayıtTarihi: '15.10.2018', Duyuru: 'GPO Tarife Değişikliği İşlemleri', Bitiş_Tarihi: '13.02.2020', status: 'Inactive'},
        {id: 9, KayıtTarihi: '15.10.2018', Duyuru: 'Bireysel Eksik Evrak Deaktivasyon Süreci Infodealer Eksik Evrak Tanımlama Alanı Kullanımı', Bitiş_Tarihi: '13.02.2020', status: 'Pending'},
        {id: 10, KayıtTarihi: '30.10.2019', Duyuru: 'Cihaz Kampanya Taahhütnameleri ile İlgili Önemli Hatırlatma', Bitiş_Tarihi: '13.02.2020', status: 'Active'},
        {id: 11, KayıtTarihi: 'Carwyn Fachtna', Duyuru: '2018/01/01', role: 'Member', status: 'Active'},
        {id: 12, KayıtTarihi: 'Nehemiah Tatius', Duyuru: '2018/02/01', role: 'Staff', status: 'Banned'},
        {id: 13, KayıtTarihi: 'Ebbe Gemariah', Duyuru: '2018/02/01', role: 'Admin', status: 'Inactive'},
        {id: 14, KayıtTarihi: 'Eustorgios Amulius', Duyuru: '2018/03/01', role: 'Member', status: 'Pending'},
        {id: 15, KayıtTarihi: 'Leopold Gáspár', Duyuru: '2018/01/21', role: 'Staff', status: 'Active'},
        {id: 16, KayıtTarihi: 'Pompeius René', Duyuru: '2018/01/01', role: 'Member', status: 'Active'},
        {id: 17, KayıtTarihi: 'Paĉjo Jadon', Duyuru: '2018/02/01', role: 'Staff', status: 'Banned'},
        {id: 18, KayıtTarihi: 'Micheal Mercurius', Duyuru: '2018/02/01', role: 'Admin', status: 'Inactive'},
        {id: 19, KayıtTarihi: 'Ganesha Dubhghall', Duyuru: '2018/03/01', role: 'Member', status: 'Pending'},
        {id: 20, KayıtTarihi: 'Hiroto Šimun', Duyuru: '2018/01/21', role: 'Staff', status: 'Active'},
        {id: 21, KayıtTarihi: 'Vishnu Serghei', Duyuru: '2018/01/01', role: 'Member', status: 'Active'},
        {id: 22, KayıtTarihi: 'Zbyněk Phoibos', Duyuru: '2018/02/01', role: 'Staff', status: 'Banned'},
        {id: 23, KayıtTarihi: 'Aulus Agmundr', Duyuru: '2018/01/01', role: 'Member', status: 'Pending'},
        {id: 42, KayıtTarihi: 'Ford Prefect', Duyuru: '2001/05/25', role: 'Alien', status: 'Don\'t panic!'}
    ]

const Duyurular = () => {

  const [details, setDetails] = useState([])
  // const [items, setItems] = useState(usersData)

  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }


  const fields = [
    { key: 'KayıtTarihi', _style: { width: '15%'} },
    { key: 'Duyuru', _style: { width: '70%'} },
    { key: 'Bitiş_Tarihi', _style: { width: '15%'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]

  const getBadge = (status)=>{
    switch (status) {
      case 'Active': return 'success'
      case 'Inactive': return 'secondary'
      case 'Pending': return 'warning'
      case 'Banned': return 'danger'
      default: return 'primary'
    }
  }

      return (
    <CDataTable
      items={duyuruData}
      fields={fields}
      columnFilter
      tableFilter
      footer
      itemsPerPageSelect
      itemsPerPage={5}
      hover
      sorter
      pagination
      scopedSlots = {{
        'status':
          (item)=>(
            <td>
              <CBadge color={getBadge(item.status)}>
                {item.status}
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
                  onClick={()=>{toggleDetails(index)}}
                >
                  {details.includes(index) ? 'Sakla' : 'Döküman'}
                </CButton>
              </td>
              )
          },
        'details':
            (item, index)=>{
              return (
              <CCollapse show={details.includes(index)}>
                <CCardBody>
                  <h4>
                    {item.username}
                  </h4>
                  <CButton size="sm" color="info">
                    Dökümanı indir
                  </CButton>
                </CCardBody>
              </CCollapse>
            )
          }
      }}
    />
  )
}

export default Duyurular;