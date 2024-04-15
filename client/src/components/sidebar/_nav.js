import React from 'react'
import  CIcon  from "@coreui/icons-react"


export const satisdestek_nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Ana Sayfa',
    to: '/anasayfa',
    icon: <i className="fas fa-home c-sidebar-nav-icon"></i>,
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['İşlemler Ve Evraklar']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Başvuru İşlemleri',
    route: '/basvuru',
    icon: <i className="fas fa-file-alt c-sidebar-nav-icon"></i>,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Başvuruları Görüntüle',
        to: '/basvurular/goruntule',
      }
    ],
  },
]

export const satisdestekchef_nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Ana Sayfa',
    to: '/anasayfa',
    icon: <i className="fas fa-home c-sidebar-nav-icon"></i>
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['İşlemler Ve Evraklar']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Başvuru İşlemleri',
    route: '/basvuru',
    icon: <i className="fas fa-file-alt c-sidebar-nav-icon"></i>,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Başvuruları Görüntüle',
        to: '/basvurular/goruntule',
      }
    ],
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Kullanıcılar']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Kullanıcılar',
    to: '/sdc/kullanicilar',
    icon: <i className="fas fa-home c-sidebar-nav-icon"></i>
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['İşlemler']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hizmetler',
    to: '/sdc/hizmetler',
    icon: <i className="fas fa-home c-sidebar-nav-icon"></i>
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Hedefler',
    to: '/sdc/hedefler',
    icon: <i className="fas fa-home c-sidebar-nav-icon"></i>
  }
]


export const bayi_nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Ana Sayfa',
    to: '/anasayfa',
    icon: <i className="fas fa-home c-sidebar-nav-icon"></i>
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['İşlemler Ve Evraklar']
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Başvuru İşlemleri',
    route: '/basvuru',
    icon: <i className="fas fa-file-alt c-sidebar-nav-icon"></i>,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Yeni Başvuru',
        to: '/basvuru/yeni',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Başvuru Takibi',
        to: '/basvuru/takip',
      }
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Raporlar',
    route: '/rapor/islemler/onaylanan',
    icon: <i className="fas fa-copy c-sidebar-nav-icon"></i>,
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: "Onaylayan işlemler",
        to: '/bayi/islemler/rapor?status=approved',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'İptal edilen işlemler',
        to: '/bayi/islemler/rapor?status=rejected',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Beklemede olan işlemler',
        to: '/bayi/islemler/rapor?status=processing',
      }
    ],
  }
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Evrak Yönetimi',
  //   route: '/evrak',
  //   icon: <i className="fas fa-copy c-sidebar-nav-icon"></i>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: "EDM'ye yeni evrak gönder",
  //       to: '/evrak/gonder',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Evrak Gönderim Listesi',
  //       to: '/evrak/liste',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Arşiv Eksiğiye Cekilen Evraklar',
  //       to: '/evrak/eksik',
  //     }
  //   ],
  // },

  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Raporlar']
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Aylik Satış Raporları',
  //   route: '/rapor/satis',
  //   icon: <i className="fas fa-chart-bar c-sidebar-nav-icon"></i>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Kasa Yap',
  //       to: '/rapor/un',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Hakediş Raporları',
  //   route: '/rapor/hakedis',
  //   icon: <i className="fas fa-lira-sign c-sidebar-nav-icon"></i>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Kasa Yap',
  //       to: '/rapor/unk1',
  //     },
  //   ],
  // },

  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Stok Ve Aksesuar']
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Stok İşlemleri',
  //   route: '/stok',
  //   icon: <i className="fas fa-cubes c-sidebar-nav-icon"></i>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Cihaz Listeleme',
  //       to: '/stok/cihazliste',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Elinizdeki Cihazlar',
  //       to: '/stok/elimdekicihaz',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: "EDM'ye Cihaz İadesi",
  //       to: '/stok/cihaziade',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Teslimatlar',
  //       to: '/stok/teslimat',
  //     }
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Diğer']
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Fatura Kontrol İşlemleri',
  //   route: '/faturakontrol',
  //   icon: <i className="fas fa-archive c-sidebar-nav-icon"></i>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'AKSESUAR ALIŞVERİŞ ROUTE',
  //       to: '/faturakontrol/1',
  //     }
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Bayi Borç-Ceza İşlemleri',
  //   route: '/borcceza',
  //   icon: <i className="fas fa-exclamation-circle c-sidebar-nav-icon"></i>,
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'AKSESUAR ALIŞVERİŞ ROUTE',
  //       to: '/borcceza/1',
  //     }
  //   ],
  // },














  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   }
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Theme']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: 'cil-drop',
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: 'cil-pencil',
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Components']
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Base',
  //   route: '/base',
  //   icon: 'cil-puzzle',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Carousel',
  //       to: '/base/carousels',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Collapse',
  //       to: '/base/collapses',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Forms',
  //       to: '/base/forms',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Jumbotron',
  //       to: '/base/jumbotrons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'List group',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Navs',
  //       to: '/base/navs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Navbars',
  //       to: '/base/navbars',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Pagination',
  //       to: '/base/paginations',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Progress',
  //       to: '/base/progress-bar',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Switches',
  //       to: '/base/switches',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tabs',
  //       to: '/base/tabs',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Buttons',
  //   route: '/buttons',
  //   icon: 'cil-cursor',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Brand buttons',
  //       to: '/buttons/brand-buttons',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Dropdowns',
  //       to: '/buttons/button-dropdowns',
  //     }
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: 'cil-chart-pie'
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Icons',
  //   route: '/icons',
  //   icon: 'cil-star',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Notifications',
  //   route: '/notifications',
  //   icon: 'cil-bell',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Toaster',
  //       to: '/notifications/toaster'
  //     }
  //   ]
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: 'cil-calculator',
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   _tag: 'CSidebarNavDivider'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Extras'],
  // },
  // {
  //   _tag: 'CSidebarNavDropdown',
  //   name: 'Pages',
  //   route: '/pages',
  //   icon: 'cil-star',
  //   _children: [
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       _tag: 'CSidebarNavItem',
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Disabled',
  //   icon: 'cil-ban',
  //   badge: {
  //     color: 'secondary',
  //     text: 'NEW',
  //   },
  //   addLinkClass: 'c-disabled',
  //   'disabled': true
  // },
  // {
  //   _tag: 'CSidebarNavDivider',
  //   className: 'm-2'
  // },
  // {
  //   _tag: 'CSidebarNavTitle',
  //   _children: ['Labels']
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label danger',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-danger'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label info',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-info'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavItem',
  //   name: 'Label warning',
  //   to: '',
  //   icon: {
  //     name: 'cil-star',
  //     className: 'text-warning'
  //   },
  //   label: true
  // },
  // {
  //   _tag: 'CSidebarNavDivider',
  //   className: 'm-2'
  // }
]

// export default bayi_nav