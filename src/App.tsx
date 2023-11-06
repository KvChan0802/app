import React from 'react';

// app 導覽的所有頁面
import Navigation from './navigations';

// 用來存放 global beacons 變數的資料
// 然後有用上 useBeacon 的 component 就可以 rerender 並從這裡取得 beacons
import BeaconContext from './context/BeaconContext';

// android 和 ios 會用不同的檔案
// android: src/hooks/useBeacon.android.ts
// ios: src/hooks/useBeacon.ios.ts
import useBeacon from './hooks/useBeacon';

// 載入多語言
// init i18next 的設定
import './i18n';


export default function App() {
  // 因為有 useBeacon
  // 所以 beacons 更新時，會 rerender
  const beacons = useBeacon();

  // k-test
  // if (beacons.length > 0) console.log(JSON.stringify(beacons))
  // k-test

  return (
    <BeaconContext.Provider value={{beacons}}>
      <Navigation />
    </BeaconContext.Provider>
  );
}
