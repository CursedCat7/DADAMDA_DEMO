// Minimal ambient typing for the subset of the Kakao Maps JS SDK this app
// uses. The real SDK ships no official TypeScript types.
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

export interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  panTo(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
}

export interface KakaoCustomOverlay {
  setMap(map: KakaoMap | null): void;
}

export interface KakaoMapsSDK {
  maps: {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
    CustomOverlay: new (options: {
      position: KakaoLatLng;
      content: HTMLElement;
      yAnchor?: number;
      xAnchor?: number;
      zIndex?: number;
    }) => KakaoCustomOverlay;
    load(callback: () => void): void;
  };
}

declare global {
  interface Window {
    kakao: KakaoMapsSDK;
  }
}

let loadPromise: Promise<KakaoMapsSDK> | null = null;

/**
 * Lazily injects the Kakao Maps JS SDK <script> tag and resolves once
 * `window.kakao.maps` is ready. Safe to call multiple times - the script
 * is only ever injected once (singleton promise), which matters because
 * this is invoked from the map view mount, not once per app lifetime.
 */
export function loadKakaoMaps(appKey: string): Promise<KakaoMapsSDK> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadKakaoMaps can only run in the browser"));
  }
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao);
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error("카카오맵 SDK를 불러오지 못했습니다."));
    };
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
