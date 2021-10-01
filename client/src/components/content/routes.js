
import {lazy} from 'react';

const Anasayfa = lazy(() => import('../../views/anasayfa/Anasayfa'));
const YeniBasvuru = lazy(() => import("../../views/yenibasvuru/YeniBasvuru"));
const Duyurular = lazy(() => import("../../views/duyurlar/Duyurular"));
const BasvuruTakibi = lazy(() => import("../../views/basvurutakibi/BasvuruTakibi"))
const CihazEkle = lazy(()=> import('../../views/muhasebe/cihazekle/CihazEkle'))
const BasvurularGoruntule = lazy(() => import('../../views/basvurulargoruntule/BasvurularGoruntule'))
const BasvuruDetay = lazy(() => import('../../views/basvurulargoruntule/BasvuruDetay'))
const Rapor= lazy(() => import('../../views/rapor/Rapor'))
const SdcKullanicilar = lazy(() => import('../../views/sdckullanicilar/SdcKullanicilar'))
const SdcKullanici = lazy(() => import('../../views/sdckullanicilar/SdcKullanici'))
const SdcIslemler = lazy(() => import('../../views/sdckullanicilar/SdcIslemler'))
const SdcIslem = lazy(() => import('../../views/sdckullanicilar/SdcIslem'))
const BasvuruID = lazy(() => import('../../views/basvuruid/BasvuruID'))
const Hesap = lazy(() => import("../../views/hesap/Hesap"))
const KazancRapor = lazy(() => import("../../views/rapor/KazancRapor"))
const KazancRaporDetay = lazy(() => import("../../views/rapor/KazancRaporDetay"))
const Hizmetler = lazy(() => import("../../views/hizmetler/Hizmetler"))
const Hedefler = lazy(() => import("../../views/hedefler/Hedefler"))


// FIX THE PATH NAMES
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/anasayfa', exact: true, name: 'anasayfa', component: Anasayfa },
  { path: '/duyurular', exact: true, name: 'duyurular', component: Duyurular },
  { path: '/basvuru/yeni', exact: true, name: 'yeni basvuru', component: YeniBasvuru }, // FIX PATH TO "/bayi/basvuru/yeni"
  { path: '/basvuru/takip', exact: true, name: 'basvuru takibi', component: BasvuruTakibi}, // FIX PATH TO "/bayi/basvuru/takip"
  { path: "/bayi/islemler/rapor", exact: true, name: "Bayi İşlem Raporu", component: Rapor},
  { path: '/basvurular/goruntule', exact: true, name: 'basvurular goruntule', component: BasvurularGoruntule},
  { path: '/basvurular/detay/:id', exact: true, name: 'Basvuru detay', component: BasvuruDetay},
  { path: '/muhasebe/stok/cihazekle', exact: true, name: 'Cihaz Ekle', component: CihazEkle},
  { path: '/sdc/kullanicilar', exact: true, name: 'SDC Kullanıcılar', component: SdcKullanicilar},
  { path: '/sdc/kullanici/:id', exact: true, name: 'SDC Kullanıcı', component: SdcKullanici},
  { path: '/sdc/islemler', exact: true, name: 'SDC İşlemler', component: SdcIslemler},
  { path: '/sd/islem/:id', exact: true, name: 'SDC İşlem', component: SdcIslem},
  { path: '/islem/:id', exact: true, name: 'İşlem ID', component: BasvuruID},
  { path: "/hesap", exact: true, name: 'Hesap Detayları', component: Hesap},
  { path: "/bayi/rapor/kazanc", exact: true, name: 'Bayi kazanç raporları', component: KazancRapor},
  { path: "/bayi/rapor/kazanc/detay/:id", exact: true, name: 'Bayi kazanç raporlar detayı', component: KazancRaporDetay},
  { path: "/sdc/hizmetler", exact: true, name: 'Hizmetler', component: Hizmetler},
  { path: "/sdc/hedefler", exact: true, name: 'Hedefler', component: Hedefler}
];

export default routes;
