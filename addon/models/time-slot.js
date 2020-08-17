import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import moment from 'moment';

var TimeSlot = EmberObject.extend({
  duration: null,
  time: null,

  endingTime: computed('time', 'duration', function() {
    return moment.duration(this.time).add(this.duration);
  }),

  day: computed(function() {
    return moment().startOf('day');
  }),

  value: computed('day', 'time', function() {
    return moment(this.day).add(this.time);
  }),

  endingValue: computed('day', 'endingTime', function() {
    return moment(this.day).add(this.endingTime);
  }),

  isInRange: function(startingTime, endingTime) {
    var value = this.value;
    var day = this.day;

    return value >= moment(day).add(startingTime) &&
           this.endingValue <= moment(day).add(endingTime);
  },

  next: function() {
    var duration = this.duration;

    return TimeSlot.create({
      time: moment.duration(this.time).add(duration),
      duration: duration
    });
  }
});

TimeSlot.reopenClass({
  buildDay: function(options) {
    var timeSlots = A();

    var currentTimeSlot = this.create({
      time: options.startingTime,
      duration: options.duration
    });

    while (currentTimeSlot.isInRange(
      options.startingTime,
      options.endingTime
    )) {
      timeSlots.pushObject(currentTimeSlot);
      currentTimeSlot = currentTimeSlot.next();
    }

    return timeSlots;
  }
});

export default TimeSlot;
