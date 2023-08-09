// "use strict";

import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Calendar from 'react-calendar';
import timezones from '../../JsonData/timezone.js';

import 'react-datepicker/dist/react-datepicker.css';
import '../../../src/assets/custom/AppointmentStyles.css';

class AppointmentPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      currentDate: new Date(),
      errorTxt: 'This question is required',
      translatedData: {},
      controlData: '',
      eventTitle: 'Meeting',
      appointmentMode: 'minutes',
      blackoutDates: [],
      startTimeInterval: '',
      maximumAppointmentsInDay: '',
      appointmentTimeZone: '',
      showTimePicker: false,
      showDatePicker: true,
      showTimeSlotsPicker: false,
      showStartEndTimePicker: false,
      appointmentDataObj: {
        day: '',
        date: '',
        timeslot: '',
        timezone: '',
      },
      timeSlotsList: [],
      appointmentTimelist: [],
      appointmentTimeFormat: 'h:mm A',
      isStartTimeSelected: false,
      showError: true,
      startTimeInterval: '15',
      startTimeCustomInterval: '',
      lengthOfTimeMinutes: '15',
      lengthOfTimeDays: '15',
      lengthOfTimeCustomMinutes: '',
      lengthOfTimeCustomDays: '',
      timeLengthBySubmitter: 'no',
      minLengthOfAppointment: 'none',
      maxLengthOfAppointment: 'none',
      sendInviteFromDefactoform: true,
      generalMinutesAvailability: {
        sunday: [],
        monday: ['09:00AM-05:00PM'],
        tuesday: ['09:00AM-05:00PM'],
        wednesday: ['09:00AM-05:00PM'],
        thursday: ['09:00AM-05:00PM'],
        friday: ['09:00AM-05:00PM'],
        saturday: [],
      },
      generalDaysAvailability: {
        sunday: false,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
      },
      startTimeMeridiem: 'AM',
      endTimeMeridiem: 'PM',
      availabilityStartTime: {
        hours: '09',
        minutes: '00',
      },
      availabilityEndTime: {
        hours: '05',
        minutes: '00',
      },
      selectedAvailibiltyDay: 'monday',
      showSelectTimeSection: false,
      currentDate: new Date(),
      blackoutDates: [],
      advanceAppointmentDays: '90',
      minimumNoticeHours: '2',
      minimumNoticeDays: '1',
      maximumAppointmentsInDay: '10',
      minimumTimeBetweenAppointments: '15',
    };

    this.weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  }

  componentWillMount() {
    console.log('mount', this.props);
    this.setStateValues(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.translationInfo &&
      Object.keys(nextProps.translationInfo).length &&
      Object.keys(nextProps.translationInfo).length !== Object.keys(this.state.translatedData).length
    ) {
      this.setState({
        translatedData: nextProps.translationInfo,
      });
    }
    // this.setStateValues(nextProps);
  }

  async setStateValues(nextProps) {
    const propsData = nextProps.data;
    if (nextProps.from == 'previewForm') {
      this.setState({
        controlData: propsData,
        eventTitle: propsData.eventTitle || this.state.eventTitle,
        appointmentMode: propsData.appointmentMode || this.state.appointmentMode,
        timeLengthBySubmitter: propsData.timeLengthBySubmitter || this.state.timeLengthBySubmitter,
        appointmentTimeZone: propsData.appointmentTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      if (propsData.appointmentMode === 'minutes' || propsData.appointmentMode == undefined) {
        const timeFormat = propsData.appointmentTimeFormat == 'am/pm' ? 'h:mm A' : 'HH:mm';
        this.setState({
          appointmentTimeFormat: timeFormat,
        });
        if (propsData.minimumNoticeHours) {
          this.setState({
            minimumNoticeHours: propsData.minimumNoticeHours,
          });
        }
        if (propsData.startTimeInterval) {
          this.setState({
            startTimeInterval: propsData.startTimeInterval,
          });
        }
        if (propsData.maximumAppointmentsInDay) {
          this.setState({
            maximumAppointmentsInDay: propsData.maximumAppointmentsInDay,
          });
        }
        if (propsData.generalMinutesAvailability) {
          this.setState({
            generalMinutesAvailability: propsData.generalMinutesAvailability,
          });
        }
        if (propsData.timeLengthBySubmitter === 'no' || propsData.timeLengthBySubmitter == undefined) {
          this.setState({
            startTimeInterval: propsData.startTimeInterval,
          });
          await this.setTimeSlotsList(
            propsData.generalMinutesAvailability || this.state.generalMinutesAvailability,
            propsData.lengthOfTimeMinutes || this.state.lengthOfTimeMinutes,
            propsData.startTimeInterval || this.state.startTimeInterval,
            timeFormat
          );
        } else {
          this.setState({
            minLengthOfAppointment: propsData.minLengthOfAppointment || this.state.minLengthOfAppointment,
            maxLengthOfAppointment: propsData.maxLengthOfAppointment || this.state.maxLengthOfAppointment,
          });
          this.setSingleTypeTimeList(
            propsData.generalMinutesAvailability || this.state.generalMinutesAvailability,
            propsData.minLengthOfAppointment || this.state.minLengthOfAppointment,
            propsData.maxLengthOfAppointment || this.state.maxLengthOfAppointment,
            propsData.startTimeInterval || this.state.startTimeInterval,
            timeFormat
          );
        }
        await this.disableDates(
          propsData.blackoutDates || [],
          propsData.appointmentMode || this.state.appointmentMode,
          propsData.generalDaysAvailability || this.state.generalDaysAvailability
        );
      }

      if (propsData.appointmentMode === 'days') {
        this.setState({
          generalDaysAvailability: propsData.generalDaysAvailability || this.state.generalDaysAvailability,
          minimumNoticeDays: propsData.minimumNoticeDays || this.state.minimumNoticeDays,
        });
        await this.disableDates(
          propsData.blackoutDates || [],
          propsData.appointmentMode || this.state.appointmentMode,
          propsData.generalDaysAvailability || this.state.generalDaysAvailability
        );
      }
    }
  }

  getCurrentTime(slotTime) {
    if (moment().format('MMMM D, YYYY') == this.state.appointmentDataObj.date) {
      return moment().isBefore(moment(slotTime, this.state.appointmentTimeFormat));
    } else {
      return true;
    }
  }

  async setTimeSlotsList(minutesAvailabilityData, slotLength, timeInterval, timeFormat) {
    const cDate = new Date();
    const currentDayIndex = cDate.getDay();
    const currentDayName = this.weekDays[currentDayIndex];
    const timeAvailability = minutesAvailabilityData[currentDayName];
    if (timeAvailability.length) {
      const startTime = timeAvailability[0].split('-')[0];
      const endTime = timeAvailability[0].split('-')[1];
      const timeSlotsArray = await this.getTimeSlotsWithStartEnd(
        this.am_pm_to_hours(startTime),
        this.am_pm_to_hours(endTime),
        slotLength,
        timeInterval,
        timeFormat
      );
      this.setState({
        timeSlotsList: timeSlotsArray,
      });
    }
  }

  getTimeSlotsWithStartEnd(start, end, slotLength, timeInterval, timeFormat) {
    var startTime = moment(start, 'HH:mm');
    var slotStart = moment(start, 'HH:mm');
    var slotEnd = moment(start, 'HH:mm').add(slotLength, 'minutes');
    var endTime = moment(end, 'HH:mm');

    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }
    var timeStops = [];
    while (startTime <= endTime && slotEnd < endTime) {
      timeStops.push({ start: new moment(slotStart).format(timeFormat), end: new moment(slotEnd).format(timeFormat) });
      startTime.add(timeInterval, 'minutes');
      slotStart.add(timeInterval, 'minutes');
      slotEnd.add(timeInterval, 'minutes');
    }
    return timeStops;
  }

  async setSingleTypeTimeList(minutesAvailabilityData, minLength, maxLength, timeInterval, timeFormat) {
    const cDate = new Date();
    const currentDayIndex = cDate.getDay();
    const currentDayName = this.weekDays[currentDayIndex];
    const timeAvailability = minutesAvailabilityData[currentDayName];
    if (timeAvailability.length) {
      const startTime = timeAvailability[0].split('-')[0];
      const endTime = timeAvailability[0].split('-')[1];
      const timeListArray = await this.getAppointmentTimeList(
        this.am_pm_to_hours(startTime),
        this.am_pm_to_hours(endTime),
        minLength,
        timeInterval,
        timeFormat
      );
      this.setState({
        appointmentTimelist: timeListArray,
        isStartTimeSelected: false,
      });
    }
  }

  getAppointmentTimeList(start, end, minLength, timeInterval, timeFormat) {
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');

    if (endTime.isBefore(startTime)) {
      endTime.add(1, 'day');
    }
    var timeStops = [];
    while (startTime <= endTime) {
      timeStops.push(new moment(startTime).format(timeFormat));
      startTime.add(minLength, 'minutes');
    }
    return timeStops;
  }

  disableDates(blackoutDates, appointmentMode, daysAvailability) {
    //get all dates from given ranges
    let dates = [];
    if(blackoutDates.length > 0) {
      blackoutDates.map((blackoutDate) => {
        let currDate = moment(blackoutDate.start, 'MMM D YYYY')
          .subtract(1, 'days')
          .startOf('day');
        let lastDate = moment(blackoutDate.end, 'MMM D YYYY')
          .add(1, 'days')
          .startOf('day');
        while (currDate.add(1, 'days').diff(lastDate) < 0) {
          dates.push(currDate.clone().toDate());
        }
      });
    }

    //combine range dates and day dates to be disabled
    if (appointmentMode == 'days') {
      if (daysAvailability) {
        let datesByDay = this.disableDatesByDay(daysAvailability);
        dates.push(...datesByDay);
      }
    }
    this.setState({
      blackoutDates: dates,
    });
    return dates;
  }

  //disable particular date by name
  disableDatesByDay(daysAvailability) {
    let start = moment(); //
    let end = moment().add(Number(this.state.controlData.advanceAppointmentDays || this.state.advanceAppointmentDays), 'days');
    let result = [];
    Object.keys(daysAvailability).forEach((day, index) => {
      if (daysAvailability[day] == false) {
        const day = Number(index);
        let current = start.clone();
        let num = 0;
        if (index < start.day()) {
          num = 7;
        }
        while (current.day(num + index).isBefore(end + 1)) {
          result.push(current.clone().toDate());
          if (num === 0) {
            num = 7;
          }
        }
      }
    });
    return result;
  }

  am_pm_to_hours(time) {
    const momentObj = moment(time, ['h:mm A']);
    return momentObj.format('HH:mm');
  }

  hours_to_am_pm(time) {
    const momentObj = moment(time, ['HH:mm']);
    return momentObj.format('h:mm A');
  }

  handleDateSelect = (date) => {
    const weekdayName = moment(date).format('dddd');
    const seletedDate = moment(date).format('MMMM D, YYYY');
    const newAppointmentObj = {
      ...this.state.appointmentDataObj,
      day: weekdayName,
      date: seletedDate,
      mode: this.state.appointmentMode,
      timezone: this.state.appointmentTimeZone,
      calendarSetupId: this.state.controlData.calender ? this.state.controlData.calender.setupId : null,
      inviteEmails: this.state.controlData.inviteEmails ? this.state.controlData.inviteEmails.split(',') : '',
      connectedCalenderId: this.state.controlData.calender ? this.state.controlData.calender.id : null,
      title: this.state.controlData.eventTitle || this.state.eventTitle,
      eventDescription: this.state.controlData.eventDescription ? this.state.controlData.eventDescription : '',
      notificationBefore: this.state.appointmentMode == 'minutes' ? this.state.minimumNoticeHours : Number(this.state.minimumNoticeDays) * 24 * 60,
    };

    this.setState({
      appointmentDataObj: newAppointmentObj,
    });
    if (this.state.appointmentMode == 'minutes') {
      this.setState({
        showDatePicker: false,
        appointmentConfirm: false,
        showTimePicker: true,
        showError: true,
      });
      if (this.state.timeLengthBySubmitter == 'no') {
        this.setState({
          showTimeSlotsPicker: true,
          showStartEndTimePicker: false,
        });
      } else {
        this.setState({
          showTimeSlotsPicker: false,
          showStartEndTimePicker: true,
        });
      }
    } else {
      const isAllValuesDone = this.checkValidation(newAppointmentObj);
      if (isAllValuesDone) {
        this.setState({
          showDatePicker: false,
          appointmentConfirm: true,
          showError: false,
        });
        this.props.handleChange(this.props.id, newAppointmentObj);
      }
    }
  };

  openDatePicker() {
    this.setState({
      showDatePicker: true,
      showTimePicker: false,
      showStartEndTimePicker: false,
      isStartTimeSelected: false,
      showError: true,
    });
  }

  handleTimeSlotSelect(slot) {
    const newAppointmentObj = { ...this.state.appointmentDataObj, timeslot: slot };
    this.setState({
      appointmentDataObj: newAppointmentObj,
    });
    this.setState({
      showDatePicker: false,
      appointmentConfirm: true,
      showTimePicker: false,
      showTimeSlotsPicker: false,
      showError: false,
    });
    this.props.handleChange(this.props.id, newAppointmentObj);
  }

  handleStartTimeSelect(startTime) {
    const timeSlotValue = { start: startTime };
    const newAppointmentObj = { ...this.state.appointmentDataObj, timeslot: timeSlotValue };
    this.setState({
      appointmentDataObj: newAppointmentObj,
    });
    this.setState({
      showDatePicker: false,
      appointmentConfirm: false,
      isStartTimeSelected: true,
      showError: true,
    });
  }

  handleEndTimeSelect(endTime) {
    const timeSlotValue = { start: this.state.appointmentDataObj.timeslot.start, end: endTime };
    const newAppointmentObj = { ...this.state.appointmentDataObj, timeslot: timeSlotValue };
    this.setState({
      appointmentDataObj: newAppointmentObj,
    });
    const isAllValuesDone = this.checkValidation(newAppointmentObj);
    if (isAllValuesDone) {
      this.setState({
        showDatePicker: false,
        showTimePicker: false,
        isStartTimeSelected: false,
        appointmentConfirm: true,
        showError: false,
      });
    }
    this.props.handleChange(this.props.id, newAppointmentObj);
  }

  disableTime(timeValue) {
    const start = this.state.appointmentDataObj.timeslot.start;
    const startTime = moment(start, 'HH:mm');
    const endTime = moment(start, 'HH:mm').add(this.state.maxLengthOfAppointment, 'minutes');
    return (
      start == timeValue ||
      moment(timeValue, this.state.appointmentTimeFormat).isBefore(startTime) ||
      moment(timeValue, this.state.appointmentTimeFormat).isAfter(endTime)
    );
  }

  handleTimeZoneChange(event) {
    this.setState({
      appointmentTimeZone: event.target.value,
    });
  }

  checkValidation(appointmentDataObj) {
    if (this.state.appointmentMode == 'minutes') {
      if (
        appointmentDataObj.day == '' ||
        appointmentDataObj.date == '' ||
        appointmentDataObj.timeslot == '' ||
        appointmentDataObj.timezone == '' ||
        (appointmentDataObj.timeslot && (!appointmentDataObj.timeslot.start || !appointmentDataObj.timeslot.end))
      ) {
        this.setState({
          showError: true,
        });
        return false;
      } else {
        this.setState({
          showError: false,
        });
        return true;
      }
    }

    if (this.state.appointmentMode == 'days') {
      if (appointmentDataObj.day == '' || appointmentDataObj.date == '' || appointmentDataObj.timezone == '') {
        return false;
      } else {
        return true;
      }
    }
  }

  editAppointment() {
    this.setState({
      showDatePicker: true,
      showTimePicker: false,
      showStartEndTimePicker: false,
    });
  }

  render() {
    return (
      <>
        <div className="Appointment__wrapper">
          {this.state.showDatePicker && (
            <div className="Appointment__day-wrapper" style={{ width: '600px', margin: 'auto' }}>
              <div className="calender-section">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{this.state.eventTitle}</h3>
                  <select
                    className="form-control"
                    style={{ width: '50%' }}
                    defaultValue={this.state.appointmentTimeZone}
                    onChange={(e) => this.handleTimeZoneChange(e)}
                  >
                    {timezones.map((timezone, index) => {
                      return (
                        <option key={timezone + '-' + index} value={timezone}>
                          {timezone}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="row">
                  <Calendar
                    onChange={this.handleDateSelect}
                    value={this.state.currentDate}
                    tileDisabled={({ date, view }) =>
                      view === 'month' && // Block day tiles only
                      this.state.blackoutDates.some(
                        (disabledDate) =>
                          date.getFullYear() === disabledDate.getFullYear() &&
                          date.getMonth() === disabledDate.getMonth() &&
                          date.getDate() === disabledDate.getDate()
                      )
                    }
                    minDate={moment().toDate()}
                    maxDate={moment()
                      .add(this.state.advanceAppointmentDays, 'days')
                      .toDate()}
                  />
                </div>
              </div>
            </div>
          )}
          {this.state.appointmentMode == 'minutes' && this.state.showTimePicker && (
            <div>
              {this.state.showTimeSlotsPicker && (
                <div className="Appointment__time-picker time-slots">
                  <div className="Appointment__time-picker Appointment__time-picker--minutes-view">
                    <div className="Appointment__time-picker-item">
                      <div
                        role="button"
                        className="BtnV2 BtnV2--raised BtnV2--fullwidth Appointment__time-button Appointment__time-picker-back"
                        tabIndex="-1"
                        style={{ width: '50%', margin: '0 auto' }}
                        onClick={(e) => this.openDatePicker()}
                      >
                        <span>
                          <i className="fa fa-arrow-left" style={{ verticalAlign: 'middle' }} />
                          <span style={{ fontWeight: 'bold' }}>{this.state.appointmentDataObj.day}, </span>
                          <span style={{ fontWeight: 'bold' }}>{this.state.appointmentDataObj.date}</span>
                        </span>
                      </div>
                    </div>
                    <div className="Appointment__time-picker-inner">
                      {this.state.timeSlotsList.map((slot, index) => {
                        return (
                          <div className="Appointment__time-picker-item" key={'timeSlot' + slot.start}>
                            <div
                              role="button"
                              className={
                                'BtnV2 btn-raised BtnV2--light BtnV2--fullwidth Appointment__time-button ' +
                                (this.getCurrentTime(slot.start) ? '' : 'disabled-time')
                              }
                              tabIndex="-1"
                              style={{ width: '50%', margin: '0 auto' }}
                              onClick={(e) => this.handleTimeSlotSelect(slot)}
                            >
                              <span>
                                {slot.start} — {slot.end}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {this.state.showStartEndTimePicker && (
                <div className="Appointment__time-picker time-start-end">
                  <div className="Appointment__time-picker Appointment__time-picker--minutes-view">
                    <div className="Appointment__time-picker-item">
                      <div
                        role="button"
                        className="BtnV2 BtnV2--raised BtnV2--fullwidth Appointment__time-button Appointment__time-picker-back"
                        tabIndex="-1"
                        style={{ width: '50%', margin: '0 auto' }}
                        onClick={(e) => this.openDatePicker()}
                      >
                        <span>
                          <i className="fa fa-arrow-left" style={{ verticalAlign: 'middle' }} />
                          <span style={{ fontWeight: 'bold' }}>{this.state.appointmentDataObj.day}, </span>
                          <span style={{ fontWeight: 'bold' }}>{this.state.appointmentDataObj.date}</span>
                        </span>
                      </div>
                    </div>
                    <div className="Appointment__time-picker-inner">
                      {this.state.appointmentTimelist.map((time, index) => {
                        return (
                          <div key={'time-picker-item-' + time}>
                            {this.state.isStartTimeSelected == false && (
                              <div className="Appointment__time-picker-item" key={'timestart' + time}>
                                <div
                                  role="button"
                                  className={
                                    'BtnV2 btn-raised BtnV2--light BtnV2--fullwidth Appointment__time-button ' +
                                    (this.getCurrentTime(time) ? '' : 'disabled-time')
                                  }
                                  tabIndex="-1"
                                  style={{ width: '50%', margin: '0 auto' }}
                                  onClick={(e) => this.handleStartTimeSelect(time)}
                                >
                                  <span>{time}</span>
                                </div>
                              </div>
                            )}
                            {this.state.isStartTimeSelected && (
                              <div className="Appointment__time-picker-item" key={'timeend' + time}>
                                <div
                                  role="button"
                                  className={
                                    'BtnV2 btn-raised BtnV2--light BtnV2--fullwidth Appointment__time-button ' +
                                    (this.disableTime(time) ? 'disabled-time' : '') +
                                    ' ' +
                                    (this.state.appointmentDataObj.timeslot.start == time ? 'selected-time' : '')
                                  }
                                  tabIndex="-1"
                                  style={{ width: '50%', margin: '0 auto' }}
                                  onClick={(e) => this.handleEndTimeSelect(time)}
                                >
                                  <span>{time}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {!this.state.showDatePicker && !this.state.showTimePicker && this.state.appointmentConfirm && (
            <div className="Appointment__confirmation">
              <div className="Appointment__confirmation_title">
                <i className="fa fa-calendar-check" style={{ fontSize: '20px', marginRight: '10px' }} />
                <span className="AnswerPipe AnswerPipe--eti">{this.state.eventTitle}</span>
              </div>
              <div className="Appointment__confirmationtime">
                <i className="fa fa-clock" style={{ fontSize: '20px', marginRight: '10px' }} />
                {/* Wednesday, September 23, 2020, 12:30 PM — 12:45 PM */}
                <span>{this.state.appointmentDataObj.day}, </span>
                <span>{this.state.appointmentDataObj.date}, </span>
                {this.state.appointmentMode == 'minutes' && (
                  <span>
                    {this.state.appointmentDataObj.timeslot.start} - {this.state.appointmentDataObj.timeslot.end}{' '}
                  </span>
                )}
                <small className="Appointment__confirmationtz">{this.state.appointmentDataObj.timezone}</small>
              </div>
              <a className="btn-raised Appointment__edit" onClick={(e) => this.editAppointment()} style={{ cursor: 'pointer' }}>
                <i className="fa fa-pencil-alt" />
              </a>
            </div>
          )}
        </div>
        {this.props.from !== 'Settings' && this.state.showError && (
          <div className="field__error" id={'appointmentError' + this.props.id}>
            {this.state.errorTxt || ''}
          </div>
        )}
      </>
    );
  }
}

export default AppointmentPicker;
