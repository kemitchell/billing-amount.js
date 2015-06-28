var amount = require('.')

require('tape')(function(test) {

  test.equal(
    amount(
      2015, 6,
      { method: 'estimate',
        estimate: 500,
        completed: '2015-06-28' }),
    500,
    'amount for a project completed in month is the estimate')

  test.equal(
    amount(
      2015, 7,
      { method: 'estimate',
        estimate: 500,
        completed: '2015-06-28' }),
    0,
    'amount for project completed outside the month is zero')

  test.equal(
    amount(
      2015, 6,
      { method: 'hourly',
        service: [
          { spans: [
              { start: '2015-06-28 08:00',
                end:   '2015-06-28 09:00' } ],
            rate: 100 } ] }),
    100,
    'amount for hourly project is time multiplied by rate')

  test.equal(
    amount(
      2015, 7,
      { method: 'hourly',
        service: [
          { spans: [
              { start: '2015-06-28 08:00',
                end:   '2015-06-28 09:00' } ],
            rate: 100 } ] }),
    0,
    'amount for hourly project outside month is zero')

  test.equal(
    amount(
      2015, 6,
      { method: 'hourly',
        service: [
          { spans: [
            { start: '2015-06-28 07:00',
              end:   '2015-06-28 07:07' },
            { start: '2015-06-28 08:00',
              end:   '2015-06-28 08:07' } ],
          rate: 100 } ] }),
    25,
    'time is rounded')

  test.end() })
