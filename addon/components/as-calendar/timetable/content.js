import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  classNameBindings: [':as-calendar-timetable-content'],
  attributeBindings: ['_style:style'],

  days: oneWay('model.days'),
  model: null,
  timeSlotDuration: oneWay('model.timeSlotDuration'),
  timeSlots: oneWay('model.timeSlots'),
  timetable: null,

  timeSlotStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`height: ${this.timeSlotHeight}px`);
  }),

  dayWidth: computed(function() {
    if (this._wasInserted) {
      return this.$().width() / this.get('days.length');
    } else {
      return 0;
    }
  }).volatile(),

  _wasInserted: false,

  _style: computed(
  'timeSlotHeight',
  'timeSlots.length', function() {
    return htmlSafe(`height: ${this.get('timeSlots.length') *
                       this.timeSlotHeight}px;`);
  }),

  didInsertElement() {
    this._super(...arguments);
    this.set('_wasInserted', true);
  },

  init() {
    this._super(...arguments);
    this.set('timetable.contentComponent', this);
  },

  click(event) {
    var offset = this.$().offset();
    var offsetX = event.pageX - Math.floor(offset.left);
    var offsetY = event.pageY - Math.floor(offset.top);

    var dayIndex = Math.floor(offsetX / this.dayWidth);
    var timeSlotIndex = Math.floor(offsetY / this.timeSlotHeight);
    var day = this.days[dayIndex];

    var timeSlot = this.timeSlots.objectAt(timeSlotIndex);

    this.onSelectTime(
      moment(day.value).add(timeSlot.time)
    );
  },

  today: computed('days', function() {
    return this.days.find(day => {
      return day.isToday;
    });
  }),

  todayTop: computed(
    'today.startingTime',
    'model.timeSlotDuration',
    'timeSlotHeight', function() {
    const now = moment();
    return (now.diff(this.get('today.startingTime')) /
            this.get('model.timeSlotDuration').as('ms')) *
            this.timeSlotHeight;
  }),

  todayStyle: computed('_top', function() {
    return htmlSafe(`top: ${this.todayTop}px;`);
  })
});
