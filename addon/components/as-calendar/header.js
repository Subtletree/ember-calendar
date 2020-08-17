import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

  isInCurrentWeek: oneWay('model.isInCurrentWeek'),
  model: null,
  title: '',

  showPrevWeekButton: computed('disablePast', 'isInCurrentWeek', function() {
    return !this.disablePast && !this.isInCurrentWeek;
  }),

  actions: {
    navigateWeek: function(index) {
      this.model.navigateWeek(index);

      if (this.onNavigateWeek) {
        this.onNavigateWeek(index);
      }
    },

    goToCurrentWeek: function() {
      this.model.goToCurrentWeek();

      if (this.onNavigateWeek) {
        this.onNavigateWeek(0);
      }
    }
  }
});
