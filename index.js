/*
 * Copyright 2015 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
*/

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

  else { return 0 } }

function entryAmount(year, month, entry) {

  // Entry gives number of billable hours.
  if ('time' in entry) {

    // Entry is within the relevant month.
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
              // Sum time spans.
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
    return Math.min(
      project.service.reduce(
        function(entryTotal, entry) {
          return add(entryTotal, entryAmount(year, month, entry)) },
        0),
      project.cap || Infinity) } }
