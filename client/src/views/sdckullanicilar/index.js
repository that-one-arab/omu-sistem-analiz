


// ******** Was used to map diğer işlem's data, for now it's deprecated ******** //
// export const filterAndMapAppData = (allData) => {
//     let digerIslemApproved = 0
//     let digerIslemSent = 0
//     let digerIslemProcessing = 0
//     let digerIslemRejected = 0
//     // eslint-disable-next-line
//     const allDataFiltered = allData.filter(obj => {
//       switch (obj.service) {
//         case "İptal":
//           digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
//           digerIslemSent = digerIslemSent + Number(obj.sentCount)
//           digerIslemProcessing = digerIslemProcessing + Number(obj.processingCount)
//           digerIslemRejected = digerIslemRejected + Number(obj.rejectedCount)
//           break;
//         case "Devir":
//           digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
//           digerIslemSent = digerIslemSent + Number(obj.sentCount)
//           digerIslemProcessing = digerIslemProcessing + Number(obj.processingCount)
//           digerIslemRejected = digerIslemRejected + Number(obj.rejectedCount)
//           break;
//         case "Nakil":
//           digerIslemApproved = digerIslemApproved + Number(obj.approvedCount)
//           digerIslemSent = digerIslemSent + Number(obj.sentCount)
//           digerIslemProcessing = digerIslemProcessing + Number(obj.processingCount)
//           digerIslemRejected = digerIslemRejected + Number(obj.rejectedCount)
//           break;
//         default:
//           return obj
//       }
//     })
//     allDataFiltered.push({
//       service: "Diğer", 
//       routeName: "diger", 
//       approvedCount: digerIslemApproved, 
//       sentCount: digerIslemSent,
//       processingCount: digerIslemProcessing,
//       rejectedCount: digerIslemRejected
//     })
//     const allDataMapped = allDataFiltered.map(obj => {
//       switch (obj.service) {
//         case "Faturasız":
//           return {
//             ...obj,
//             routeName: "faturasiz"
//           }
//         case "Faturalı":
//           return {
//             ...obj,
//             routeName: "faturali"
//           }
//         case "DSL":
//           return {
//             ...obj,
//             routeName: "DSL"
//           }
//         case "PSTN":
//           return {
//             ...obj,
//             routeName: "pstn"
//           }
//         case "Taahüt":
//           return {
//             ...obj,
//             routeName: "taahut"
//           }
//         case "Tivibu":
//           return {
//             ...obj,
//             routeName: "tivibu"
//           }
//         default:
//           return obj
//       }
//     })
//     return allDataMapped
// }

export const mapUsersData = (fetchData) => {
  return fetchData.map(obj => {
    let role = ""
    switch (obj.role) {
      case "admin":
        role = "Admin"
        break;
      case "dealer":
        role = "Bayi"
        break
      case "sales_assistant":
        role = "Satış Destek"
        break
      case "sales_assistant_chef":
        role = "Satış Destek Şefi"
        break
      default:
        break;
    }
    return {
        ID: obj.user_id,
        Kullanıcı: obj.name,
        Röl: role,
        Bakiye: obj.balance ? Number(obj.balance).toFixed(2) : "Yok",
        Kayıt_tarihi: obj.register_date,
        Aktif: obj.active
      }
  })
}

export const compare = ( a, b ) => {
  if ( a.ID < b.ID ){
    return -1;
  }
  if ( a.ID > b.ID ){
    return 1;
  }
  return 0;
}