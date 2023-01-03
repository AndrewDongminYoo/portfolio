import { useEffect, useState } from "react"

const useMobileDetect = () => {
    const platform = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent
    console.debug(platform);
    const [isMobile, setIsMobile] = useState(false);
    const checkItsMobile = (userAgent: NavigatorID['userAgent']) => {
        const isAndroid = Boolean(userAgent.match(/Android/i));
        const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i));
        const isOpera = Boolean(userAgent.match(/Opera Mini/i));
        const isWindows = Boolean(userAgent.match(/IEMobile/i));
        if (isAndroid || isIos || isOpera || isWindows) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }
  useEffect(() => {
    checkItsMobile(platform);
  }, [platform]);

  return [isMobile, setIsMobile];
}

export default useMobileDetect