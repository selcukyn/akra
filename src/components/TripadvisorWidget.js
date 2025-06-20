"use client";
import React, { useEffect } from "react";

const TripadvisorWidget = () => {
  useEffect(() => {
    // Aynı script iki kere eklenmesin diye kontrol
    if (!document.getElementById("tripadvisor-widget-script")) {
      const script = document.createElement("script");
      script.id = "tripadvisor-widget-script";
      script.src = "https://www.jscache.com/wejs?wtype=cdsreviews&uniq=383&locationId=572231&lang=tr&border=true&display_version=2";
      script.async = true;
      document.getElementById("TA_cdsreviews383")?.appendChild(script);
    }
    return () => {
      // Sayfa değişimlerinde widget temizliği
      const container = document.getElementById("TA_cdsreviews383");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div className="flex justify-center items-center my-8">
      <div id="TA_cdsreviews383" className="TA_cdsreviews"></div>
    </div>
  );
};

export default TripadvisorWidget;
