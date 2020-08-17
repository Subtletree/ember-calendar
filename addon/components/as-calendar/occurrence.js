import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import computedDuration from 'ember-calendar/macros/computed-duration';
import moment from 'moment';

export default Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'article',

  model: null,
  timeSlotDuration: null,
  timeSlotHeight: null,
  title: oneWay('model.title'),
  content: oneWay('model.content'),
  computedTimeSlotDuration: computedDuration('timeSlotDuration'),

  titleStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`line-height: ${this.timeSlotHeight}px;`);
  }),

  _dayStartingTime: oneWay('day.startingTime'),

  _dayEndingTime: oneWay('day.endingTime'),

  _startingTime: computed('model.startingTime', '_dayStartingTime', function() {
    if (this.get('model.startingTime').isBefore(this._dayStartingTime)) {
      return this._dayStartingTime;
    } else {
      return this.get('model.startingTime');
    }
  }),

  _endingTime: computed('model.endingTime', '_dayEndingTime', function() {
    if (this.get('model.endingTime').isAfter(this._dayEndingTime)) {
      return this._dayEndingTime;
    } else {
      return this.get('model.endingTime');
    }
  }),

  _duration: computed('_startingTime', '_endingTime', function() {
    return moment.duration(
      this._endingTime.diff(this._startingTime)
    );
  }),

  _occupiedTimeSlots: computed(
    '_duration',
    'computedTimeSlotDuration', function() {
      return this._duration.as('ms') /
             this.computedTimeSlotDuration.as('ms');
  }),

  _height: computed('_occupiedTimeSlots', function() {
    return this.timeSlotHeight * this._occupiedTimeSlots;
  }),

  _top: computed(
    '_startingTime',
    '_dayStartingTime',
    'computedTimeSlotDuration',
    'timeSlotHeight', function() {
    return (this._startingTime.diff(this._dayStartingTime) /
            this.computedTimeSlotDuration.as('ms')) *
            this.timeSlotHeight;
  }),

  _style: computed('_height', '_top', function() {
    return htmlSafe(`top: ${this._top}px;
            height: ${this._height}px;`);
  }),

  click(event) {
    event.stopPropagation();
  }
});
