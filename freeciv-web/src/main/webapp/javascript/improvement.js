/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://play.freeciv.org/
    Copyright (C) 2009-2015  The Freeciv-web project

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

***********************************************************************/

// incomplete list of (well defined) building names - populate as needed
// Remove in favor of [Effects](https://github.com/freeciv/freeciv-web/issues/208) when implemented.
// IDs are dynamic based on ruleset
const B_AIRPORT_NAME = 'Airport';
const B_RECYCLING_CENTER = "Recycling Center";
const B_PALACE_NAME = 'Palace';
const B_ECC_PALACE_NAME = 'Ecclesiastical Palace';
const B_STATUE_OF_LIBERTY_NAME = "Statue of Liberty";
const B_ADAM_SMITH_NAME = "A.Smith's Trading Co.";
const B_TESLAS_LABORATORY = "Tesla's Laboratory";
const B_COLOSSUS = "Colossus";
const B_LIGHTHOUSE = "Lighthouse";


var B_LAST = MAX_NUM_BUILDINGS;

const improvements = {};
/** @private */
const improvements_name_index = {};

/**************************************************************************
 Prepare improvements for use, resetting state from any previous ruleset
 **************************************************************************/
function improvements_init()
{
  Object.keys(improvements).forEach(k => delete improvements[k]);
  Object.keys(improvements_name_index).forEach(k => delete improvements_name_index[k]);
}

/**************************************************************************
 Add a new improvement definition
 **************************************************************************/
function improvements_add_building(improvement) {
  improvements[improvement.id] = improvement;
  improvements_name_index[improvement.name] = improvement.id
}

/**************************************************************************
 Returns a list containing improvements which are available from a tech.
**************************************************************************/
function get_improvements_from_tech(tech_id)
{
  var result = [];
  for (var improvement_id in improvements) {
    var pimprovement = improvements[improvement_id];
    var reqs = get_improvement_requirements(improvement_id);
    for (var i = 0; i < reqs.length; i++) {
      if (reqs[i] == tech_id) {
        result.push(pimprovement);
      }
    }
  }
  return result;
}

/**************************************************************************
...
**************************************************************************/
function is_wonder(improvement)
{
  return (improvement['soundtag'][0] == 'w');
}

/**************************************************************************
 returns list of tech ids which are a requirement for the given improvement
**************************************************************************/
function get_improvement_requirements(improvement_id)
{
  var result = [];
  var improvement = improvements[improvement_id];
  if (improvement != null && improvement['reqs'] != null) {
    for (var i = 0; i < improvement['reqs'].length; i++) {
      if (improvement['reqs'][i]['kind'] == 1
          && improvement['reqs'][i]['present']) {
        result.push(improvement['reqs'][i]['value']);
      }
    }
  }
  return result;
}

/**************************************************************************
 Finds improvement id by exact name, or -1 if not found.
 **************************************************************************/
function improvement_id_by_name(name)
{
  // 0 is a valid id, so cannot use `|| -1`
  return improvements_name_index.hasOwnProperty(name)
    ? improvements_name_index[name]
    : -1;
}
