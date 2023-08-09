import React from "react";
import EchosCell from "./echosCell";

const EchosList = ({
  echosList,
  handleCheckState,
  trashPocketSelected,
  allPockets,
  updateEchoData,
  fetchAllEchos,
  updateCheckedEchos,
  fetchAllPockets
}) => {  
  return (
    <div className="contact-main-content echos-list-section">
      {echosList.map((echo, index) => (
        <EchosCell
          key={index}
          echo={echo}
          handleCheckState={handleCheckState}
          trashPocketSelected={trashPocketSelected}
          allPockets={allPockets}
          updateEchoData={updateEchoData}
          fetchAllEchos={fetchAllEchos}
          fetchAllPockets={fetchAllPockets}
          updateCheckedEchos={updateCheckedEchos}
        />
      ))}
    </div>
  );
};

export default EchosList;
