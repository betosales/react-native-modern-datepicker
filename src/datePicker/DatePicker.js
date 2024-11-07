import React, {createContext, useReducer, useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {Calendar, SelectMonth, SelectTime} from './components';
import {utils} from '../utils';

const options = {
  backgroundColor: '#fff',
  textHeaderColor: '#212c35',
  textDefaultColor: '#2d4150',
  selectedTextColor: '#fff',
  mainColor: '#61dafb',
  textSecondaryColor: '#7a92a5',
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
      return {...state, ...action};
    case 'toggleMonth':
      return {...state, monthOpen: !state.monthOpen};
    case 'toggleTime':
      return {...state, timeOpen: !state.timeOpen};
    default:
      throw new Error('Unexpected action');
  }
};

const CalendarContext = createContext();

const useCalendar = () => {
  const contextValue = useContext(CalendarContext);
  return contextValue;
};

const DatePicker = ({
  onSelectedChange = () => null,
  onMonthYearChange = () => null,
  onTimeChange = () => null,
  onDateChange = () => null,
  current = '',
  selected = '',
  minimumDate = '',
  maximumDate = '',
  selectorStartingYear = 0,
  selectorEndingYear = 3000,
  disableDateChange = false,
  isGregorian = true,
  configs = {},
  reverse = 'unset',
  options: userOptions = {},
  mode = 'datepicker',
  minuteInterval = 5,
  style = {},
}) => {
  const calendarUtils = new utils({
    configs,
    isGregorian,
    mode,
    reverse,
    selected,
    current,
    minimumDate,
    maximumDate,
  });
  const contextValue = {
    ...props,
    reverse: reverse === 'unset' ? !isGregorian : reverse,
    options: {...options, ...userOptions},
    utils: calendarUtils,
    state: useReducer(reducer, {
      activeDate: current || calendarUtils.getToday(),
      selectedDate: selected ? calendarUtils.getFormatted(calendarUtils.getDate(selected)) : '',
      monthOpen: mode === 'monthYear',
      timeOpen: mode === 'time',
    }),
  };
  const [minHeight, setMinHeight] = useState(300);
  const styles = createStyles(contextValue.options);

  const renderBody = () => {
    switch (mode) {
      default:
      case 'datepicker':
        return (
          <React.Fragment>
            <Calendar />
            <SelectMonth />
            <SelectTime />
          </React.Fragment>
        );
      case 'calendar':
        return (
          <React.Fragment>
            <Calendar />
            <SelectMonth />
          </React.Fragment>
        );
      case 'monthYear':
        return <SelectMonth />;
      case 'time':
        return <SelectTime />;
    }
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      <View
        style={[styles.container, {minHeight}, style]}
        onLayout={({nativeEvent}) => setMinHeight(nativeEvent.layout.width * 0.9 + 55)}>
        {renderBody()}
      </View>
    </CalendarContext.Provider>
  );
};

const createStyles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundColor,
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
    },
  });

const modeArray = ['datepicker', 'calendar', 'monthYear', 'time'];
const minuteIntervalArray = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];

const optionsShape = {
  backgroundColor: PropTypes.string,
  textHeaderColor: PropTypes.string,
  textDefaultColor: PropTypes.string,
  selectedTextColor: PropTypes.string,
  mainColor: PropTypes.string,
  textSecondaryColor: PropTypes.string,
  borderColor: PropTypes.string,
  defaultFont: PropTypes.string,
  headerFont: PropTypes.string,
  textFontSize: PropTypes.number,
  textHeaderFontSize: PropTypes.number,
  headerAnimationDistance: PropTypes.number,
  daysAnimationDistance: PropTypes.number,
};

DatePicker.propTypes = {
  onSelectedChange: PropTypes.func,
  onMonthYearChange: PropTypes.func,
  onTimeChange: PropTypes.func,
  onDateChange: PropTypes.func,
  current: PropTypes.string,
  selected: PropTypes.string,
  minimumDate: PropTypes.string,
  maximumDate: PropTypes.string,
  selectorStartingYear: PropTypes.number,
  selectorEndingYear: PropTypes.number,
  disableDateChange: PropTypes.bool,
  isGregorian: PropTypes.bool,
  configs: PropTypes.object,
  reverse: PropTypes.oneOf([true, false, 'unset']),
  options: PropTypes.shape(optionsShape),
  mode: PropTypes.oneOf(modeArray),
  minuteInterval: PropTypes.oneOf(minuteIntervalArray),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export {DatePicker, CalendarContext, useCalendar};
