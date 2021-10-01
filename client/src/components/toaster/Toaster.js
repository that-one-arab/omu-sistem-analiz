import { CToaster, CToast, CToastBody } from "@coreui/react"

const Toaster = ({color, body, show}) => {
    return (
        <CToaster position="top-right">
            <CToast show={show} autohide={3000} fade={true} color={color} style = {{textAlign: "center"}}>
                <CToastBody>{body}</CToastBody>
            </CToast>
        </CToaster>
    )
}

export default Toaster