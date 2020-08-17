import { assign } from '@ember/polyfills';
import { on } from '@ember/object/evented';
import EmberObject, { computed } from '@ember/object';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';
import OccurrenceProxy from './occurrence-proxy';

export default EmberObject.extend({
  dayEndingTime: null,
  dayStartingTime: null,
  occurrences: null,
  startingDate: null,
  timeSlotDuration: null,
  occurrencePreview: null,

  isInCurrentWeek: computed('week', '_currentWeek', function() {
    return this.week.isSame(this._currentWeek);
  }),

  timeSlots: computed(
    'dayStartingTime',
    'dayEndingTime',
    'timeSlotDuration', function() {
    return TimeSlot.buildDay({
      startingTime: this.dayStartingTime,
      endingTime: this.dayEndingTime,
      duration: this.timeSlotDuration
    });
  }),

  days: computed(function() {
    return Day.buildWeek({ calendar: this });
  }),

  week: computed('startingTime', function() {
    return moment(this.startingTime).startOf('isoWeek');
  }),

  _currentWeek: computed(function() {
    return moment().startOf('isoWeek');
  }),

  initializeCalendar: on('init', function() {
    if (this.startingTime == null) {
      this.goToCurrentWeek();
    }
  }),

  createOccurrence: function(options) {
    var content = assign({
      endsAt: moment(options.startsAt)
        .add(this.defaultOccurrenceDuration).toDate(),

      title: this.defaultOccurrenceTitle
    }, options);

    return OccurrenceProxy.create({
      calendar: this,
      content: EmberObject.create(content)
    });
  },

  navigateWeek: function(index) {
    this.set('startingTime', moment(this.startingTime).add(index, 'weeks'));
  },

  goToCurrentWeek: function() {
    this.set('startingTime', moment());
  }
});
