import { createContext, useContext, useState } from "react";

export const HighlightContext = createContext();

// eslint-disable-next-line react/prop-types
export const HighlightProvider = ({ children }) => {
    const [highlightEnabled, setHighlightEnabled] = useState(false);
  
    // eslint-disable-next-line no-unused-vars
    const toggleHighlight = (newState) => {
      setHighlightEnabled((prevState) => !prevState);
    };

    
    return (
      <HighlightContext.Provider value={{ highlightEnabled, toggleHighlight }}>
        {children}
      </HighlightContext.Provider>
    );
  };
  
export const useHighlight = () => useContext(HighlightContext);
