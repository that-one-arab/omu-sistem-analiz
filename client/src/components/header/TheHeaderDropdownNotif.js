import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const TheHeaderDropdownNotif = () => {
  const itemsCount = 0
  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell"/>
        <CBadge shape="pill" color="danger">{itemsCount}</CBadge>
      </CDropdownToggle>
      <CDropdownMenu  placement="bottom-end" className="pt-0">
        <CDropdownItem
          header
          tag="div"
          className="text-center"
          color="light"
        >
          <strong>Sizin {itemsCount} yeni bildiriminiz var</strong>
        </CDropdownItem>
        {/* <CDropdownItem><CIcon name="cil-user-follow" className="mr-2 text-success" /> (NAME) eczane Yeni bir teklif girildi (LINK) </CDropdownItem> */}
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <CIcon name="cil-user-follow" className="mr-2 text-info" />
            <small><b>(NAME) eczane Yeni bir teklif girildi (LINK)</b></small>
          </div>
          <CProgress size="xs" color="info" value={70} />
          <small className="text-muted">11444GB/16384MB</small>
        </CDropdownItem>

        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <CIcon name="cil-user-unfollow" className="mr-2 text-danger" />
            <small><b> (NAME) Eczane teklif sildi (LINK) </b></small>
          </div>
          <CProgress size="xs" color="danger" value={70} />
          <small className="text-muted">11444GB/16384MB</small>
        </CDropdownItem>

        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <CIcon name="cil-check-circle" className="mr-2 text-success" />
            <small><b>(ID) Teklifinizi Onaylayabilirsiniz! (LINK)</b></small>
          </div>
          <CProgress size="xs" color="success" value={70} />
          <small className="text-muted">11444GB/16384MB</small>
        </CDropdownItem>
        {/* <CDropdownItem
          header
          tag="div"
          color="light"
        >
          <strong>Server</strong>
        </CDropdownItem>
        <CDropdownItem className="d-block">

        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>Memory Usage</b></small>
          </div>
          <CProgress size="xs" color="warning" value={70} />
          <small className="text-muted">11444GB/16384MB</small>
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small><b>SSD 1 Usage</b></small>
          </div>
          <CProgress size="xs" color="danger" value={90} />
          <small className="text-muted">243GB/256GB</small>
        </CDropdownItem> */}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownNotif