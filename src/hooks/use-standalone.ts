import * as React from "react";

export function useStandalone() {
  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");

    const update = () => {
      const standalone =
        media.matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
      setIsStandalone(standalone);
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isStandalone;
}
