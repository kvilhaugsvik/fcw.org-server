/**********************************************************************
    Freeciv-web - the web version of Freeciv. http://play.freeciv.org/
    Copyright (C) 2009-2016  The Freeciv-web project

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

var sound_path = "/sounds/";

/**************************************************************************
 Plays the unit sound for movement, if the unit has moved and is visible. 
**************************************************************************/
function check_unit_sound_play(old_unit, new_unit)
{
  if (!sounds_enabled) return;
  if (old_unit == null || new_unit == null) return;
  /* unit is in same position. */
  if (new_unit['tile'] == old_unit['tile']) return;
  if (!is_unit_visible(new_unit)) return;

  if (soundset == null) {
    console.error("soundset not found.");
    return;
  }

  var ptype = unit_type(new_unit);
  if (soundset[ptype['sound_move']] != null) {
    play_sound(soundset[ptype['sound_move']]);
  } else if (soundset[ptype['sound_move_alt']] != null) {
    play_sound(soundset[ptype['sound_move_alt']]);
  }

}

/**************************************************************************
 Plays the unit sound for movement.
**************************************************************************/
function unit_move_sound_play(unit)
{
  if (!sounds_enabled) return;
  if (unit == null) return;

  if (soundset == null) {
    console.error("soundset not found.");
    return;
  }

  var ptype = unit_type(unit);
  move_sound = soundset[ptype['sound_move']];  

  // PARTIAL MOVE SOUNDS.  Some units are loud and/or often move one tile at a time. 
  // Use "partial move sounds" to avoid annoyance:
  if ( unit['movesleft'] < ptype['move_rate'] )  { 
    switch(ptype['name']) {
      case "Medium Bomber":
      case "Heavy Bomber": 
      case "Strategic Bomber": 
      case "Bomber":
        move_sound = "pm_prop_bombers.ogg"; 
        break;

      case "Fighter":  
      case "Escort Fighter":
        move_sound = "pm_prop_fighters.ogg";
        break;

      // TO DO:  Helicopter, Armor, Jet aircraft, Cruise Missile, Nuclear 
    }
  }

  // PLAY MOVE SOUND
  if (move_sound != null) {
    play_sound(move_sound);
  } else if (soundset[ptype['sound_move_alt']] != null) {
    play_sound(soundset[ptype['sound_move_alt']]);
  }

}

/**************************************************************************
 Plays the combat sound for the unit if visible.
**************************************************************************/
function play_combat_sound(unit) 
{
  if (!sounds_enabled) return;
  if (unit == null) return;
  if (!is_unit_visible(unit) && renderer != RENDERER_WEBGL) 
  {
    console.error("skipped playing a sound because unit not visible or RENDERER_WEBGL");
    return;
  }

  if (soundset == null) {
    console.error("Soundset not found.");
    return;
  }

  var ptype = unit_type(unit);
  if (soundset[ptype['sound_fight']] != null) {
    play_sound(soundset[ptype['sound_fight']]);
  } else if (soundset[ptype['sound_fight_alt']] != null) {
    play_sound(soundset[ptype['sound_fight_alt']]);
    console.error("Combat sound not found for "+unit_types[unit['type']]['name']+", played alt-sound instead.");
  } else console.error("No Combat sound or alt sound for "+unit_types[unit['type']]['name']+" found.");
}

/**************************************************************************
 Plays a sound file based on a gived filename.
**************************************************************************/
function play_sound(sound_file) 
{
  try {
    if (!sounds_enabled || !(document.createElement('audio').canPlayType) || Audio == null) {
      console.error("function play_sound() was called but failed to play.")
      return;
    }
    var audio = new Audio(sound_path + sound_file);
    var promise = audio.play();
    if (promise != null) {
      promise.catch(sound_error_handler);
    }

  } catch(err) {
    sound_error_handler(err);
  }
}

/**************************************************************************
 Logs a sound error in the tracker
**************************************************************************/
function sound_error_handler(err)
{
  sounds_enabled = false;
  if (window.trackJs) {
    trackJs.console.log(err);
    trackJs.track("Sound problem");
  } else {
    console.log(err);
  }
}
