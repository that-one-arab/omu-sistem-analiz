import React, { useEffect, useState } from 'react'
import {
    CFormGroup,
    CLabel,
    CInput,
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from '@coreui/react'
import customFetch from '../custom-fetch'

const DailyCash = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [transactions, setTransactions] = useState({
        sanalpara: 0,
        cihazsatisi: 0,
        aksesuarsatisi: 0,
        digergelirler: 0,
        digergiderler: 0,
    })
    const [descriptions, setDescriptions] = useState({
        sanalparadesc: '',
        cihazsatisidesc: '',
        aksesuarsatisidesc: '',
        digergelirlerdesc: '',
        digergiderlerdesc: '',
    })
    const [formDisabled, setFormDisabled] = useState(false)

    useEffect(() => {
        customFetch(`/report/${date}`).then((response) => {
            if (!response.ok) {
                console.error('Failed to fetch report')
                return
            }
            response.json().then((data) => {
                console.info({ data })
                if (data) {
                    setTransactions(data.transactions)
                    setDescriptions(data.descriptions)
                    setFormDisabled(true)
                }
            })
        })
    }, [date])

    const handleDateChange = (e) => {
        setDate(e.target.value)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setTransactions({
            ...transactions,
            [name]: parseFloat(value),
        })
    }

    const handleDescriptionChange = (e) => {
        const { name, value } = e.target
        setDescriptions({
            ...descriptions,
            [name]: value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        customFetch('/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, transactions, descriptions }),
        }).then((response) => {
            if (!response.ok) {
                console.error('Failed to create report')
                return
            }
        })
    }

    const handleDelete = (e) => {
        e.preventDefault()

        customFetch(`/report/${date}`, {
            method: 'DELETE',
        }).then((response) => {
            if (!response.ok) {
                console.error('Failed to delete report')
                return
            }

            setFormDisabled(false)
            setTransactions({
                sanalpara: 0,
                cihazsatisi: 0,
                aksesuarsatisi: 0,
                digergelirler: 0,
                digergiderler: 0,
            })

            setDescriptions({
                sanalparadesc: '',
                cihazsatisidesc: '',
                aksesuarsatisidesc: '',
                digergelirlerdesc: '',
                digergiderlerdesc: '',
            })
        })
    }


    const calculateTotal = () => {
        let total = 0
        for (const key in transactions) {
            if (
                typeof transactions[key] !== 'number' ||
                isNaN(transactions[key])
            ) {
                continue
            }
            if (key === 'digergiderler') {
                total -= transactions[key]
            } else {
                total += transactions[key]
            }
        }

        return total
    }

    return (
        <CCard>
            <CCardHeader>Günlük Kasa</CCardHeader>
            <CCardBody>
                <CRow>
                    <CFormGroup>
                        <CCol xs={3}>
                            <CLabel>Tarih</CLabel>
                            <br />
                            <CInput
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                            />
                        </CCol>
                    </CFormGroup>
                </CRow>
                <CRow>
                    <CFormGroup>
                        <CCol xs={3}>
                            <CLabel>Sanal Para</CLabel>
                            <CInput
                                type="number"
                                name="sanalpara"
                                value={transactions.sanalpara}
                                onChange={handleInputChange}
                                disabled={formDisabled}
                            />
                        </CCol>
                        <CCol>
                            <CInput
                                type="text"
                                name="sanalparadesc"
                                placeholder="Açıklama"
                                value={descriptions.sanalparadesc}
                                onChange={handleDescriptionChange}
                                disabled={formDisabled}

                            />
                        </CCol>
                    </CFormGroup>
                </CRow>
                <CRow>
                    <CFormGroup>
                        <CFormGroup>
                            <CCol xs={3}>
                                <CLabel>Cihaz Satışı</CLabel>
                                <CInput
                                    type="number"
                                    name="cihazsatisi"
                                    value={transactions.cihazsatisi}
                                    onChange={handleInputChange}
                                    disabled={formDisabled}
                                />
                            </CCol>
                            <CCol>
                                <CInput
                                    type="text"
                                    name="cihazsatisidesc"
                                    placeholder="Açıklama"
                                    value={descriptions.cihazsatisidesc}
                                    onChange={handleDescriptionChange}
                                    disabled={formDisabled}
                                />
                            </CCol>
                        </CFormGroup>
                    </CFormGroup>
                </CRow>
                <CRow>
                    <CFormGroup>
                        <CFormGroup>
                            <CCol xs={3}>
                                <CLabel>Aksesuar Satışı</CLabel>
                                <CInput
                                    type="number"
                                    name="aksesuarsatisi"
                                    value={transactions.aksesuarsatisi}
                                    onChange={handleInputChange}
                                    disabled={formDisabled}
                                />
                            </CCol>
                            <CCol>
                                <CInput
                                    type="text"
                                    name="aksesuarsatisidesc"
                                    placeholder="Açıklama"
                                    value={descriptions.aksesuarsatisidesc}
                                    onChange={handleDescriptionChange}
                                    disabled={formDisabled}
                                />
                            </CCol>
                        </CFormGroup>
                    </CFormGroup>
                </CRow>
                <CRow>
                    <CFormGroup>
                        <CCol xs={3}>
                            <CLabel>Diğer Gelirler</CLabel>
                            <CInput
                                type="number"
                                name="digergelirler"
                                value={transactions.digergelirler}
                                onChange={handleInputChange}
                                disabled={formDisabled}
                            />
                        </CCol>
                        <CCol>
                            <CInput
                                type="text"
                                name="digergelirlerdesc"
                                placeholder="Açıklama"
                                value={descriptions.digergelirlerdesc}
                                onChange={handleDescriptionChange}
                                disabled={formDisabled}
                            />
                        </CCol>
                    </CFormGroup>
                </CRow>
                <CRow>
                    <CFormGroup>
                        <CCol xs={3}>
                            <CLabel>Diğer Giderler</CLabel>
                            <CInput
                                type="number"
                                name="digergiderler"
                                value={transactions.digergiderler}
                                onChange={handleInputChange}
                                disabled={formDisabled}
                            />
                        </CCol>
                        <CCol>
                            <CInput
                                type="text"
                                name="digergiderlerdesc"
                                placeholder="Açıklama"
                                value={descriptions.digergiderlerdesc}
                                onChange={handleDescriptionChange}
                                disabled={formDisabled}
                            />
                        </CCol>
                    </CFormGroup>
                </CRow>

                <CRow>
                    <CFormGroup>
                        <CCol xs={12}>
                            <CLabel>Toplam</CLabel>
                            <CInput
                                type="number"
                                name="toplam"
                                value={calculateTotal()}
                            />
                        </CCol>
                    </CFormGroup>
                </CRow>

                <div>Toplam: {calculateTotal()}</div>

                <CRow>
                    <CCol xs={2}>
                        <CButton color="primary" disabled={formDisabled || calculateTotal() <= 0} onClick={handleSubmit}>
                            Kaydet
                        </CButton>
                    </CCol>
                    <CCol xs={2}>
                        <CButton color="danger" disabled={!formDisabled} onClick={handleDelete}>
                            Sil
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    )
}

export default DailyCash
