import { CCol, CFormGroup, CLabel, CTextarea, CButton } from '@coreui/react'

export const forRoleSetFormLabel = (role) => {
    switch (role) {
        case "dealer":
            return {
                field3: "Satış Destek Son Notları"
            }
        case "sales_assistant":
            return {
                field3: "Son notlarınız"
            }
        case "sales_assistant_chef":
            return {
                field3: "Satış Destek Son Notları"
            }    
        default:
            break;
    }
}

export const renderBasvuruDetayFooterButtons = (details, updateApp) => {
    // if the application is on Hold (first status change)
    if (details.submitProcessNum === 2) {
        return (
        <div id = "basvuruDetay-footerButtons">
            {/* Here "true" in updateApp refers to sp optional parameter, if true it modifies the urlString in fetch */}
            <CButton onClick = {() => updateApp("İptal", true)} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
            <CButton onClick = {()=> updateApp("Onaylandı", true)} size="md" color="success" className = "">
            <i className="fas fa-check-circle"></i> ONAYLA</CButton>
        </div>
        )
    }
    // if the applications has been approved or denied (second status change)
    else if (details.submitProcessNum === 3) {
        return null
    // else return first process submission
    } else {
        return (
        <div id = "basvuruDetay-footerButtons">
            <CButton onClick = {() => updateApp("İptal")} size="md" color="danger"><i className="fas fa-ban"></i> İPTAL</CButton>
            <CButton onClick = {()=> updateApp("İşleniyor")} size="md" color="warning" className = "basvuru-detay-submit-buttons-submit" >
            <i className="fas fa-arrow-circle-up"></i> İŞLE</CButton>
        </div>
        )
    }
}

export const renderMiddleTextArea = (applicationDetails, userRole) => {
    if (applicationDetails.submitProcessNum === 2) {
        return (
            <CFormGroup row>
            <CCol>
                <CLabel>Bayi Açıklaması</CLabel>
                <CTextarea 
                rows="8"
                placeholder={applicationDetails.Açıklama}
                readOnly
                />
            </CCol>
            {
                userRole === "sales_assistant" ?
                <CCol>
                    <CLabel>Önceki Notlarınız</CLabel>
                    <CTextarea
                    rows="8"
                    placeholder={applicationDetails.salesRepDetails}
                    readOnly
                    />
                </CCol>
                :
                <CCol>
                    <CLabel>Satış Destek Notları</CLabel>
                    <CTextarea
                    rows="8"
                    placeholder={applicationDetails.salesRepDetails}
                    readOnly
                    />
                </CCol>
            }
            </CFormGroup>
        )
    }
    else if (applicationDetails.submitProcessNum === 3) {
        return (
        <CFormGroup>
        <CLabel>Bayi Açıklaması</CLabel>
        <CTextarea 
            rows="4"
            placeholder={applicationDetails.Açıklama}
            readOnly
        />
        </CFormGroup>
        )
    } else {
        return (
        <CFormGroup>
            <CLabel>Bayi Açıklaması</CLabel>
            <CTextarea 
            rows="4"
            placeholder={applicationDetails.Açıklama}
            readOnly
            />
        </CFormGroup>
        )
    }
}

export const renderFooterTextArea = (setSdDetay, userRole, userDetails, forRoleSetFields) => {
    if (userDetails.submitProcessNum === 3)
        return (
            <CFormGroup>
                <CLabel>{forRoleSetFields.field3}</CLabel>
                    <CTextarea 
                    rows="6"
                    placeholder={userDetails.finalSalesRepDetails}
                    readOnly
                    />
            </CFormGroup>
        )
    else {
        if (userRole === "sales_assistant")
            return (
                <CFormGroup>
                    <CLabel>Notlarınız</CLabel>
                    <CTextarea 
                        rows="6"
                        placeholder="işlemle alakalı notlarınız..."
                        onChange = {(e) => setSdDetay(e.target.value)}
                    />
                </CFormGroup>
            )
        else
            return (
                <CFormGroup>
                    <CLabel>Satış Destek Son Notları</CLabel>
                    <CTextarea 
                        rows="6"
                        placeholder={userDetails.finalSalesRepDetails}
                        readOnly
                    />
                </CFormGroup>
            )
    }
}

export const setHeaderColor = (details) => {
    switch (details.Statü) {
        case "İşleniyor":
        return "rgb(214, 160, 11)"
        case "İptal":
        return "rgb(212, 69, 13)"
        case "Onaylandı":
        return "rgb(55, 150, 55)"
        default:
        return "rgb(120, 138, 151)"
    }
}