import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import "./login.css"
import Modal from '../../components/modals/Modal';
import HocLoader from '../../views/hocloader/HocLoader';

class Login extends React.Component {

  constructor() {
    super()
    this.state = {
      email: "",
      password: "",
      modalColor: "", 
      modalOn: false, 
      modalBody: "", 
      modalHeader: "", 
      loading: false
    }
  };

  onEmailChange = (e) => {
    this.setState({email: e.target.value});
  };

  onPasswordChange = (e) => {
    this.setState({password: e.target.value});
  };

  setModal = (e) => {
    this.setState({ modalOn: !this.state.modalOn })
  }

  onSubmit = async () => {
    this.setState({loading: true})
    this.props.logoutUser()
    //verify email
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmailValid = re.test(String(this.state.email).toLowerCase());
    if (!isEmailValid)
      return this.setState({
        modalOn: true,
        modalHeader: "Hatalı email",
        modalBody: "Lütfen geçerli bir email adresi giriniz",
        modalColor: "warning"
      })
    // verify email end
    let res = await fetch("/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization' :'Bearer '
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
    this.setState({loading: false})
    if (res.status === 200) {
      let data = await res.json()
      document.cookie = `vitoken=${data.token}`
      this.props.userLoggingin()
      this.props.fillUserInfo(data)

    } else if (res.status === 403) {
      this.setState({
        modalOn: true,
        modalHeader: "Hatalı giriş",
        modalBody: "Lütfen bilgilerinizi kontrol ederek tekrar deneyin",
        modalColor: "warning"
      })
    } else if (res.status === 406) {
      this.setState({
        modalOn: true,
        modalHeader: "Giriş yapılmaz",
        modalBody: "Hesabınız deaktiv edilmiştir, lütfen yöneticilere başvuru yapınız",
        modalColor: "danger"
      })
    } else {
      this.setState({
        modalOn: true,
        modalHeader: "SUNUCU HATASI",
        modalBody: "Sunucu tarafından bir hata olmuştur, lütfen tekrar deneyin",
        modalColor: "danger"
      })
    }
  }

  componentWillUnmount = () => {
    this.setState(this.state)
  }

  render() {
    const { loading, modalColor, modalOn, modalBody, modalHeader } = this.state
    return (
      <HocLoader absolute = {true} isLoading = {loading}>
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <Modal modalOn = {modalOn} color = {modalColor} header = {modalHeader} body = {modalBody} setModal = {this.setModal} />
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Kullanıcı girişi</h1>
                      <p className="text-muted">Hesabınıza giriş yapın</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <i className="far fa-envelope"></i>
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" placeholder="E-Mailiniz" autoComplete="email" onChange = {this.onEmailChange} />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" placeholder="Şifre" autoComplete="current-password" onChange = {this.onPasswordChange} />
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary" className="px-4" onClick = {this.onSubmit}>Giriş</CButton>
                        </CCol>
                        <CCol xs="6" className="text-right">
                          <CButton color="link" className="px-0"> <Link to = "resetpassword/verify">Şifrenizi unuttunuz mu?</Link></CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>HESAP OLUŞTURUN</h2>
                      <p>Sayfamıza ilk defa giriş yapıyorsanız buradan hesabınızı oluşturabilirsiniz</p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>Şimdi Oluşturun!</CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
      </HocLoader>
    )  
  }
}

const mapStateToProps = (state) => {
  return {
    loginErr: state.reducer.loginErr
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLoggingin : () => {
          dispatch({type: "LOGIN", payload: "hello"})
      },
    userLoggininErr: () => {
          dispatch({type: "LOGIN-ERROR"})
    },
    logoutUser : () => {
      dispatch({type: "LOGOUT"})
    },
    fillUserInfo: (data) => {
      dispatch({type: "FILL_USER_INFO", payload: data})
    }
  }
}   

export default connect(mapStateToProps, mapDispatchToProps)(Login);
