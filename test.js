var amount = require('./')

require('tape')(function(test) {

  test.equal(
    amount(
      new Date('2015-06-01T00:00-0700'),
      new Date('2015-06-30T23:59-0700'),
      100,
      { method: 'estimate',
        estimate: 500,
        completed: '2015-06-28' }),
    500,
    'estimate for project completed within month')

  test.equal(
    amount(
      new Date('2015-06-01'),
      new Date('2015-06-30'),
      100,
      { method: 'estimate',
        estimate: 500,
        completed: '2015-06-01' }),
    500,
    'estimate for project completed at start of month')

  test.equal(
    amount(
      new Date('2015-06-01'),
      new Date('2015-06-30'),
      100,
      { method: 'estimate',
        estimate: 500,
        completed: '2015-06-30' }),
    500,
    'estimate for project completed at end of month')

  test.equal(
    amount(
      new Date('2015-07-01T00:00-0700'),
      new Date('2015-07-31T23:59-0700'),
      100,
      { method: 'estimate',
        estimate: 500,
        completed: '2015-06-28' }),
    0,
    'amount for project completed outside the month is zero')

  test.equal(
    amount(
      new Date('2015-06-01T00:00-0700'),
      new Date('2015-06-30T23:59-0700'),
      100,
      { method: 'hourly',
        service: [
          { spans: [
              { start: '2015-06-28T08:00-0700',
                end:   '2015-06-28T09:00-0700' } ] } ] }),
    100,
    'amount for hourly project is time multiplied by rate')

  test.equal(
    amount(
      new Date('2015-06-01T00:00-0700'),
      new Date('2015-06-30T23:59-0700'),
      100,
      { method: 'hourly',
        service: [
          { time: 0.5,
            date: '2015-06-02',
            adjustment: -0.25 } ] }),
    25,
    'applies adjustments to flat-amount entries')

  test.equal(
    amount(
      new Date('2015-06-01T00:00-0700'),
      new Date('2015-06-30T23:59-0700'),
      100,
      { method: 'hourly',
        cap: 50,
        service: [
          { spans: [
              { start: '2015-06-28T08:00-0700',
                end:   '2015-06-28T09:00-0700' } ] } ] }),
    50,
    'amount for capped hourly project limited to cap')

  test.equal(
    amount(
      new Date('2015-07-01T00:00-0700'),
      new Date('2015-07-31T23:59-0700'),
      100,
      { method: 'hourly',
        service: [
          { spans: [
              { start: '2015-06-28T08:00-0700',
                end:   '2015-06-28T09:00-0700' } ] } ] }),
    0,
    'amount for hourly project outside month is zero')

  test.equal(
    amount(
      new Date('2015-06-01T00:00-0700'),
      new Date('2015-06-30T23:59-0700'),
      100,
      { method: 'hourly',
        service: [
          { spans: [
            { start: '2015-06-28T07:00-0700',
              end:   '2015-06-28T07:07-0700' },
            { start: '2015-06-28T08:00-0700',
              end:   '2015-06-28T08:07-0700' } ] } ] }),
    25,
    'time is rounded')

  test.end() })
