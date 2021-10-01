import {
    CToaster,
    CToast,
    CToastBody,
} from '@coreui/react';

const Toaster = ({color, body}, i) => {
    return (
        <CToaster position="top-right" key = {i}>
            <CToast show={true} autohide={3000} fade={true} color={color} className = "applicationToaster">
                <CToastBody>{body}</CToastBody>
            </CToast>
        </CToaster>
    )
}

export default Toaster