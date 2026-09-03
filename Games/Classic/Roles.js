/*
  Copyright 2017-2018 James V. Craster
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../Core/utils");
var Alignment;
(function (Alignment) {
    Alignment["town"] = "town";
    Alignment["mafia"] = "mafia";
    Alignment["neutral"] = "neutral";
    Alignment["undefined"] = "undefined";
})(Alignment = exports.Alignment || (exports.Alignment = {}));
var Passives;
(function (Passives) {
    //cannot be killed at night
    Passives["nightImmune"] = "nightImmune";
    Passives["roleblockImmune"] = "roleblockImmune";
})(Passives || (Passives = {}));
var GameEndConditions;
(function (GameEndConditions) {
    //town wins if no mafia remain
    GameEndConditions.townWin = (game) => {
        for (let player of game.players) {
            if (player.alignment == Alignment.mafia && player.alive) {
                return false;
            }
        }
        return true;
    };
    //mafia wins if there are no town left alive, or there is just 1 town and 1 mafia (which would otherwise cause stalemate)
    GameEndConditions.mafiaWin = (game) => {
        let townCount = 0;
        let mafiaCount = 0;
        let alive = 0;
        for (let player of game.players) {
            if (player.alignment == Alignment.town && player.alive) {
                townCount += 1;
            }
            if (player.alignment == Alignment.mafia && player.alive) {
                mafiaCount += 1;
            }
            if (player.alive) {
                alive += 1;
            }
        }
        return townCount == 0 || (townCount == 1 && mafiaCount == 1 && alive == 2);
    };
})(GameEndConditions = exports.GameEndConditions || (exports.GameEndConditions = {}));
var WinConditions;
(function (WinConditions) {
    WinConditions.town = (player, game) => {
        return GameEndConditions.townWin(game);
    };
    WinConditions.mafia = (player, game) => {
        return GameEndConditions.mafiaWin(game);
    };
    WinConditions.survive = (player, game) => {
        return player.alive;
    };
    WinConditions.hanged = (player, game) => {
        return player.hanged;
    };
    //make last one standing exclusive, except for survivors
    WinConditions.lastOneStanding = (player, game) => {
        let aliveCount = 0;
        for (let player of game.players) {
            if (player.alive) {
                aliveCount += 1;
            }
        }
        return player.alive && aliveCount <= 2;
    };
    WinConditions.undefined = (player, game) => {
        return false;
    };
})(WinConditions = exports.WinConditions || (exports.WinConditions = {}));
var Conditions;
(function (Conditions) {
    Conditions.alwaysTrue = (targetPlayer, game) => {
        return true;
    };
})(Conditions || (Conditions = {}));
var Abilities;
(function (Abilities) {
    Abilities.kill = {
        condition: (targetPlayer, game, player) => {
            if (targetPlayer.healed && player) {
                player.user.send("Your target was healed!");
            }
            return !targetPlayer.healed;
        },
        action: (targetPlayer, game) => {
            game.kill(targetPlayer);
        },
    };
    Abilities.heal = {
        condition: Conditions.alwaysTrue,
        action: (targetPlayer, game) => {
            targetPlayer.healed = true;
        },
    };
    Abilities.getAlignment = {
        condition: Conditions.alwaysTrue,
        action: (targetPlayer, game, player) => {
            if (player) {
                player.user.send("You investigated your target:");
                player.user.send(targetPlayer.user.username + " is a " + targetPlayer.alignment);
            }
        },
    };
    Abilities.roleBlock = {
        condition: Conditions.alwaysTrue,
        action: (targetPlayer, game) => {
            targetPlayer.roleBlocked = true;
        },
    };
})(Abilities || (Abilities = {}));
var Roles;
(function (Roles) {
    Roles.vigilante = {
        roleName: "ashigaru",
        alignment: Alignment.town,
        winCondition: WinConditions.town,
        abilities: [{ ability: Abilities.kill, uses: 2 }],
        passives: [],
    };
    Roles.mafioso = {
        roleName: "nekomata",
        alignment: Alignment.mafia,
        winCondition: WinConditions.mafia,
        abilities: [{ ability: Abilities.kill }],
        passives: [],
    };
    Roles.godfather = {
        roleName: "kitsune",
        alignment: Alignment.mafia,
        winCondition: WinConditions.mafia,
        abilities: [{ ability: Abilities.kill }],
        passives: [Passives.nightImmune],
    };
    Roles.doctor = {
        roleName: "doctor",
        alignment: Alignment.town,
        winCondition: WinConditions.town,
        abilities: [{ ability: Abilities.heal }],
        passives: [],
    };
    Roles.sheriff = {
        roleName: "samurai",
        alignment: Alignment.town,
        winCondition: WinConditions.town,
        abilities: [{ ability: Abilities.getAlignment }],
        passives: [],
    };
    Roles.townie = {
        roleName: "villager",
        alignment: Alignment.town,
        winCondition: WinConditions.town,
        abilities: [],
        passives: [],
    };
    Roles.escort = {
        roleName: "geisha",
        alignment: Alignment.town,
        winCondition: WinConditions.town,
        abilities: [{ ability: Abilities.roleBlock }],
        passives: [Passives.roleblockImmune],
    };
    Roles.survivor = {
        roleName: "survivor",
        alignment: Alignment.neutral,
        winCondition: WinConditions.survive,
        color: utils_1.Colors.brightYellow,
        backgroundColor: utils_1.Colors.yellow,
        abilities: [],
        passives: [],
    };
    Roles.medium = {
        roleName: "onmyoji",
        alignment: Alignment.town,
        winCondition: WinConditions.town,
        abilities: [],
        passives: [],
    };
    Roles.jester = {
        roleName: "jester",
        alignment: Alignment.neutral,
        winCondition: WinConditions.hanged,
        color: utils_1.Colors.magenta,
        abilities: [],
        passives: [],
    };
    Roles.serialKiller = {
        roleName: "ronin",
        alignment: Alignment.neutral,
        winCondition: WinConditions.lastOneStanding,
        color: utils_1.Colors.magenta,
        abilities: [],
        passives: [],
    };
    Roles.anyTown = {
        roleName: "Any Town",
        alignment: Alignment.town,
        winCondition: WinConditions.undefined,
        abilities: [],
        passives: [],
    };
    Roles.any = {
        roleName: "Any",
        alignment: Alignment.undefined,
        winCondition: WinConditions.undefined,
        abilities: [],
        passives: [],
    };
})(Roles = exports.Roles || (exports.Roles = {}));
exports.priorities = [
    Roles.escort,
    Roles.doctor,
    Roles.godfather,
    Roles.mafioso,
    Roles.vigilante,
    Roles.sheriff,
    Roles.townie,
    Roles.survivor,
    Roles.jester,
];
//# sourceMappingURL=Roles.js.map