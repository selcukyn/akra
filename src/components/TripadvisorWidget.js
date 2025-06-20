import React, { useEffect } from "react";

const TripadvisorWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.jscache.com/wejs?wtype=cdsreviews&uniq=383&locationId=572231&lang=tr&border=true&display_version=2";
    script.async = true;
    document.getElementById("ta-widget-container").appendChild(script);
    return () => {
      const container = document.getElementById("ta-widget-container");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div id="ta-widget-container">
      <div id="TA_cdsreviews383" className="TA_cdsreviews"></div>
    </div>
  );
};

export default TripadvisorWidget;
