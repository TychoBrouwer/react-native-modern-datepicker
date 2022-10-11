import { useRef, useState } from 'react';
import { Animated, Easing, I18nManager } from 'react-native';

const d = new Date();
const gregorianConfigs = {
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  selectedFormat: 'YYYY-MM-DD',
  dateFormat: 'YYYY-MM-DD',
  monthYearFormat: 'YYYY MM',
};

class Utils {
  constructor({
    minimumDate, maximumDate, reverse, configs,
  }) {
    this.data = {
      minimumDate,
      maximumDate,
      reverse: reverse === 'unset' ? false : reverse,
    };
    this.config = gregorianConfigs;
    this.config = { ...this.config, ...configs };
    this.formatDate = (input) => {
      const year = input.toLocaleString('default', { year: 'numeric' });
      const month = input.toLocaleString('default', { month: '2-digit' });
      const day = input.toLocaleString('default', { day: '2-digit' });

      return `${year}-${month}-${day}`;
    };
    this.getToday = () => this.formatDate(d);
    this.numberOfDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.useMonthAnimation = (activeDate, distance, onEnd = () => null) => {
      const [lastDate, setLastDate] = useState(activeDate);
      const [changeWay, setChangeWay] = useState(null);
      const monthYearAnimation = useRef(new Animated.Value(0)).current;

      const changeMonthAnimation = (type) => {
        setChangeWay(type);
        setLastDate(activeDate);
        monthYearAnimation.setValue(1);
        Animated.timing(monthYearAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.bezier(0.33, 0.66, 0.54, 1),
        }).start(onEnd);
      };

      const shownAnimation = {
        opacity: monthYearAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1],
        }),
        transform: [
          {
            translateX: monthYearAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, changeWay === 'NEXT' ? -distance : distance],
            }),
          },
        ],
      };

      const hiddenAnimation = {
        opacity: monthYearAnimation,
        transform: [
          {
            translateX: monthYearAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [changeWay === 'NEXT' ? distance : -distance, 0],
            }),
          },
        ],
      };

      return [{ lastDate, shownAnimation, hiddenAnimation }, changeMonthAnimation];
    };
  }

  get flexDirection() {
    const direction = I18nManager.isRTL ? 'row' : 'row-reverse';
    return { flexDirection: this.data.reverse ? direction : 'row' };
  }

  getMonthName = (month) => this.config.monthNames[month];

  getMonthYearText = (time) => {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = this.getMonthName(date.getMonth());

    return `${month} ${year}`;
  };

  checkMonthDisabled = (time) => {
    const { minimumDate, maximumDate } = this.data;
    const date = new Date(time);
    let disabled = false;

    if (minimumDate) {
      disabled = date.setDate(29) < new Date(minimumDate);
    }
    if (maximumDate && !disabled) {
      disabled = date.setDate(1) > new Date(maximumDate);
    }
    return disabled;
  };

  checkArrowMonthDisabled = (time, next) => {
    const date = new Date(time);

    return this.checkMonthDisabled(
      this.formatDate(new Date(date.setMonth(date.getMonth() + (next ? -1 : 1)))),
    );
  };

  checkYearDisabled = (year, next) => {
    const { minimumDate, maximumDate } = this.data;

    const y = new Date(next ? maximumDate : minimumDate).getFullYear();
    return next ? year >= y : year <= y;
  };

  checkSelectMonthDisabled = (time, month) => {
    const date = new Date(time);
    const dateWithNewMonth = new Date(date.setMonth(month));

    return this.checkMonthDisabled(this.formatDate(dateWithNewMonth));
  };

  validYear = (time, year) => {
    const { minimumDate, maximumDate } = this.data;
    const date = new Date(new Date(time).setFullYear(year));

    let validDate = this.formatDate(date);
    if (minimumDate && date < new Date(minimumDate)) {
      validDate = minimumDate;
    }
    if (maximumDate && date > new Date(maximumDate)) {
      validDate = maximumDate;
    }
    return validDate;
  };

  getMonthDays = (time) => {
    const { minimumDate, maximumDate } = this.data;

    const date = new Date(time);
    const currentMonthDays = this.numberOfDaysInMonth(date).getDate();
    const dayOfWeek = date.getDay();

    return [
      ...new Array(dayOfWeek),
      ...[...new Array(currentMonthDays)].map((i, n) => {
        const thisDay = new Date(new Date(date).setDate(n + 1));

        let disabled = false;
        if (minimumDate) {
          disabled = thisDay < new Date(minimumDate);
        }
        if (maximumDate && !disabled) {
          disabled = thisDay > new Date(maximumDate);
        }

        return {
          dayString: n + 1,
          day: n + 1,
          date: this.formatDate(thisDay),
          disabled,
        };
      }),
    ];
  };
}

export default Utils;
