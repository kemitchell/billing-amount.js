var round = require('round')

var BILLING_INCREMENT = 15
var MINUTES_PER_HOUR = 60
var MILLISECONDS_PER_MINUTE = MINUTES_PER_HOUR * 1000

// Define LISP-style math functions.
function add(x, y) { return x + y }
function subtract(x, y) { return x - y }
function multiply(x, y) { return x * y }
function divide(x, y) { return x / y }

function dateMatches(year, month, date) {
  return (
    date.getFullYear() === year &&
    // getMonth() is zero-indexed.
    // The month argument is one-indexed.
    add(date.getMonth(), 1) === month) }

function spanAmount(year, month, span) {
  var start = new Date(span.start)
  var end = new Date(span.end)

  // Span is within the relevant month.
  if (dateMatches(year, month, start) &&
      dateMatches(year, month, end)) {
    return round(
      divide(subtract(end, start), MILLISECONDS_PER_MINUTE)) }

  // Span is outside the relevant month.
  else { return 0 } }

function entryAmount(year, month, entry) {

  // Entry gives number of billable hours.
  if ('time' in entry) {
    if (dateMatches(year, month, new Date(entry.date))) {
      return round.down(multiply(entry.time, entry.rate), 1) }
    else { return 0 } }

  // Entry lists spans of billable time.
  else {
    return (
      round.down(
        multiply(
          entry.rate,
          divide(
            // Round billable minutes.
            round(
              entry.spans.reduce(
                function(total, span) {
                  return add(total, spanAmount(year, month, span)) },
                0),
              BILLING_INCREMENT),
            MINUTES_PER_HOUR)),
        1)) } }

module.exports = function(year, month, project) {

  // Bill per a a flat estimate.
  if (project.method === 'estimate') {
    var complete = new Date(project.completed)
    // Was the project completed in the relevant month?
    if (complete && dateMatches(year, month, complete)) {
      return project.estimate }
    else { return 0 } }

  // Bill time on the project.
  else {
    return project.service.reduce(
      function(entryTotal, entry) {
        return add(entryTotal, entryAmount(year, month, entry)) },
      0) } }
