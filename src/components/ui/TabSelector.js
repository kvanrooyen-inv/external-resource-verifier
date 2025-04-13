import React from "react";
import TabButton from "./TabButton";
import AlertBadge from "./AlertBadge";

const TabSelector = ({
  activeTab,
  onTabChange,
  librariesCount,
  alertsCount,
}) => {
  return (
    <div className="flex rounded-lg overflow-hidden">
      <TabButton
        active={activeTab === "resources"}
        onClick={() => onTabChange("resources")}
      >
        External Resources ({librariesCount})
      </TabButton>

      <TabButton
        active={activeTab === "alerts"}
        onClick={() => onTabChange("alerts")}
        type="alert"
      >
        <div className="flex items-center justify-center">
          JavaScript Alerts
          {alertsCount > 0 && <AlertBadge count={alertsCount} />}
        </div>
      </TabButton>
    </div>
  );
};

export default TabSelector;
