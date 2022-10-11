/* eslint-disable react/no-unused-prop-types */
import React, {
  useReducer, useState,
} from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Calendar from './components/Calendar';
import SelectMonth from './components/SelectMonth';
import ContextProvider, { useCalendar } from './context-provider';

import Utils from './utils';

const optionsDefault = {
  backgroundColor: '#fff',
  borderColor: 'rgba(122, 146, 165, 0.1)',
  defaultFont: 'System',
  headerFont: 'System',
  textFontSize: 15,
  textHeaderFontSize: 17,
  headerAnimationDistance: 100,
  daysAnimationDistance: 200,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action };
    case 'toggleMonth':
      return { ...state, monthOpen: !state.monthOpen };
    default:
      throw new Error('Unexpected action');
  }
};

const styles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.backgroundColor,
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
});

function DatePicker(props) {
  const {
    style, reverse, options, current, selected,
  } = props;
  const calendarUtils = new Utils(props);

  const contextValue = {
    ...props,
    reverse: reverse === 'unset' ? false : reverse,
    options: { ...optionsDefault, ...options },
    utils: calendarUtils,
    state: useReducer(reducer, {
      activeDate: current || calendarUtils.getToday(),
      selectedDate: selected || '',
    }),
  };

  const [minHeight, setMinHeight] = useState(300);
  const styleDefault = styles(contextValue.options);

  return (
    <ContextProvider value={contextValue}>
      <View
        style={[styleDefault.container, { minHeight }, style]}
        onLayout={({ nativeEvent }) => setMinHeight(nativeEvent.layout.width * 0.9 + 55)}
      >
        <Calendar />
        <SelectMonth />
      </View>
    </ContextProvider>
  );
}

const optionsShape = {
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  defaultFont: PropTypes.string,
  headerFont: PropTypes.string,
  textFontSize: PropTypes.number,
  textHeaderFontSize: PropTypes.number,
  headerAnimationDistance: PropTypes.number,
  daysAnimationDistance: PropTypes.number,
};

DatePicker.defaultProps = {
  onSelectedChange: () => null,
  onDateChange: () => null,
  current: '',
  selected: '',
  minimumDate: '',
  maximumDate: '',
  selectorStartingYear: 0,
  selectorEndingYear: 3000,
  disableDateChange: false,
  configs: {},
  reverse: 'unset',
  options: {},
  style: {},
};

DatePicker.propTypes = {
  onSelectedChange: PropTypes.func,
  onDateChange: PropTypes.func,
  current: PropTypes.string,
  selected: PropTypes.string,
  minimumDate: PropTypes.string,
  maximumDate: PropTypes.string,
  selectorStartingYear: PropTypes.number,
  selectorEndingYear: PropTypes.number,
  disableDateChange: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  configs: PropTypes.object,
  reverse: PropTypes.oneOf([true, false, 'unset']),
  options: PropTypes.shape(optionsShape),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export { useCalendar };
export const { getToday } = new Utils({});

export default DatePicker;
