import React, { createContext, useContext, useState } from "react";

const AIImageContext = createContext();

export function AIImageProvider({ children }) {
  const [AIImageUrl, setAIImageUrl] = useState("");

  const updateAIImageUrl = (newUrl) => {
    setAIImageUrl(newUrl);
  };

  const sharedData = {
    AIImageUrl,
    updateAIImageUrl,
  };

  return (
    <AIImageContext.Provider value={sharedData}>
      {children}
    </AIImageContext.Provider>
  );
}

export function useAIImage() {
  return useContext(AIImageContext);
}
