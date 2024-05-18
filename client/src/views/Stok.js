import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CRow,
  CButton,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import customFetch from '../custom-fetch';

const Stok = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState('');

  // Fetch devices from the backend
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await customFetch('/devices');
        const data = await response.json();
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);


  const handleIncrement = async (id, index) => {
    try {
      const response = await customFetch(`/devices/${id}/increment`, {
        method: 'PUT',
      });
      const updatedDevice = await response.json();
      setDevices(devices.map((device, i) => (i === index ? updatedDevice : device)));
    } catch (error) {
      console.error('Error incrementing device count:', error);
    }
  };

  const handleDecrement = async (id, index) => {
    try {
      const response = await customFetch(`/devices/${id}/decrement`, {
        method: 'PUT',
      });
      const updatedDevice = await response.json();
      setDevices(devices.map((device, i) => (i === index ? updatedDevice : device)));
    } catch (error) {
      console.error('Error decrementing device count:', error);
    }
  };

  const handleNewDeviceChange = (e) => {
    setNewDevice(e.target.value);
  };

  const handleNewDeviceSubmit = async (e) => {
    e.preventDefault();
    if (newDevice.trim() !== '') {
      try {
        const response = await customFetch('/devices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newDevice, count: 0 }),
        });
        const newDeviceData = await response.json();
        setDevices([...devices, newDeviceData]);
        setNewDevice('');
      } catch (error) {
        console.error('Error adding new device:', error);
      }
    }
  };

  const handleDelete = async (id, index) => {
    try {
      await customFetch(`/devices/${id}`, {
        method: 'DELETE',
      });
      setDevices(devices.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  return (
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCard>
            <CCardHeader>Stok Yönetimi</CCardHeader>
            <CCardBody>
              <CForm>
              <CFormGroup>
                  <CLabel>Cihazlar</CLabel>
                  <CListGroup>
                    {devices.map((device, index) => (
                      <CListGroupItem key={device.id} className="d-flex justify-content-between align-items-center">
                        <span>{device.name} sayısı</span>
                        <div className="d-flex align-items-center">
                          <CButton color="primary" onClick={() => handleDecrement(device.id, index)}>-</CButton>
                          <CInput
                            className="mx-2 text-center"
                            type="text"
                            value={device.count}
                            readOnly
                            style={{ width: '50px' }}
                          />
                          <CButton color="primary" onClick={() => handleIncrement(device.id, index)}>+</CButton>
                          <CButton color="danger" onClick={() => handleDelete(device.id, index)} className="ml-2">Delete</CButton>
                        </div>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="newDevice">Yeni Cihaz Ekle</CLabel>
                  <CInput
                    id="newDevice"
                    type="text"
                    value={newDevice}
                    onChange={handleNewDeviceChange}
                    placeholder="Yeni cihaz ismi girin"
                  />
                </CFormGroup>
                <CButton color="success" onClick={handleNewDeviceSubmit}>Ekle</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Stok;
