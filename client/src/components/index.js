export const mapDataToTurkish = (fetchData) => {
    return fetchData.map(obj => {
        let submitDate = new Date(obj.submit_time)
        let statusChangeDate = new Date(obj.status_change_date)
        let lastChangeDate = new Date(obj.last_change_date)
        let submitProcessNum = 0
        let status = ""
        if (obj.status === "approved") {
          submitProcessNum = 3
          status = "Onaylandı"
        }
        else if (obj.status === "rejected") {
          submitProcessNum = 3
          status = "İptal"
        }
        else if (obj.status === "processing") {
          submitProcessNum = 2
          status = "İşleniyor"
        }
        else if (obj.status === "sent") {
          status = "Gönderildi"
          submitProcessNum = 1
        }
        return {
            ID: obj.id,
            İsim: obj.client_name,
            Tarih: submitDate.toISOString().slice(0, 10),
            Hizmet: obj.service_name,
            Kampanya: obj.offer_name,
            Açıklama: obj.description,
            Statü: status,
            salesRepDetails: obj.sales_rep_details ? obj.sales_rep_details : "",
            statusChangeDate: statusChangeDate ? statusChangeDate.toISOString().slice(0, 10) : null,
            finalSalesRepDetails: obj.final_sales_rep_details ? obj.final_sales_rep_details : "",
            lastChangeDate: lastChangeDate ? lastChangeDate.toISOString().slice(0, 10) : null,
            submitProcessNum,
            imageURLS: obj.image_urls ? obj.image_urls : null
          }
      })
}

export const getBadge = (status)=>{
    switch (status) {
       case 'Onaylandı': return 'success'
       case 'İşleniyor': return 'warning'
       case 'İptal': return 'danger'
       case 'Gönderildi': return 'secondary'
       default: return 'primary'
    }
  }

export const mapRoleToTurkish = (status)=>{
  switch (status) {
      case 'dealer': return 'Bayi'
      case 'sales_assistant': return 'Satış Destek'
      case 'sales_assistant_chef': return 'Satış Destek Şefi'
      case 'admin': return 'Admin'
      default: return ''
  }
}