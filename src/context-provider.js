import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const CalendarContext = createContext();

export const useCalendar = () => {
  const contextValue = useContext(CalendarContext);
  return contextValue;
};

function ContextProvider({ children, value }) {
  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

ContextProvider.defaultProps = {
  value: {},
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.object]),
};

export default ContextProvider;
