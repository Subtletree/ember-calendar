import EmberObject from '@ember/object';
import { A } from '@ember/array';
import { on } from '@ember/object/evented';
import Controller from '@ember/controller';

export default Controller.extend({
  selections: null,
  occurrences: null,

  _initializeDefaults: on('init', function() {
    if (this.selections == null) {
      this.set('selections', A());
    }

    if (this.occurrences == null) {
      this.set('occurrences', A());
    }
  }),

  actions: {
    calendarAddOccurrence: function(occurrence) {
      this.occurrences.pushObject(EmberObject.create({
        title: occurrence.title,
        startsAt: occurrence.startsAt,
        endsAt: occurrence.endsAt
      }));
    },

    calendarUpdateOccurrence: function(occurrence, properties) {
      occurrence.setProperties(properties);
    },

    calendarRemoveOccurrence: function(occurrence) {
      this.occurrences.removeObject(occurrence);
    }
  }
});
