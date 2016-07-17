var roleCollector = require('role.collector');

module.exports = {
    // state working = Returning energy to structure

    run: function(creep) {
        // if creep is bringing energy to a structure but has no energy left
        if (creep.carry.energy == 0) {

            // switch state to harvesting
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.carry.energy == creep.carryCapacity) {
            // switch statevar numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION
                || s.structureType == STRUCTURE_TOWER)
                && s.energy < s.energyCapacity
        });

            // if we found one
            if (structure != undefined) {

                if (structure.structureType == STRUCTURE_SPAWN && structure.energy == structure.energyCapacity) {
                    roleUpgrader.run(creep);
                }
                // try to transfer energy, if it is not in range
                else if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure, {reusePath: 5});

                }
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            // Find exit to target room
            var spawn = Game.getObjectById(creep.memory.spawn);
            if (creep.room.name != spawn.room.name) {
                //still in old room
            }
            else {
                //new room reached, start harvesting
            }
            if(!creep.memory.path) {
                creep.memory.path = creep.pos.findPathTo(Game.flags.remoteSource);
            }
            creep.moveByPath(creep.memory.path);
        }
    }
};