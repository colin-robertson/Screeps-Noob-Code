const delayPathfinding = 2;
const delayRoomScanning = 10;
const RESOURCE_SPACE = "space";

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		// check for picked up minerals
        if (creep.memory.sleep != undefined) {
            creep.memory.sleep--;
            if (creep.memory.sleep < 1) {
                delete creep.memory.sleep;
            }
        }
        else if (creep.memory.statusHarvesting == undefined || creep.memory.statusHarvesting == false) {
            var container;
            if (creep.memory.role == "harvester" || creep.memory.role == "energyTransporter") {
                // find closest container with energy
                if (creep.room.energyCapacityAvailable > creep.room.energyAvailable) {
                    if (creep.room.memory.terminalTransfer != undefined) {
                        //spawn not full, terminal transfer ongoing -> find source, container or storage if available
                        if (creep.memory.role == "harvester") {
                            container = creep.findResource(RESOURCE_ENERGY, FIND_SOURCES, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_STORAGE);
                        }
                        if (creep.memory.role == "energyTransporter") {
                            container = creep.findResource(RESOURCE_ENERGY, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_STORAGE);
                        }
                    }
                    else {
                        //spawn not full, no terminal transfer ongoing -> find source, container, terminal or storage if available
                        if (creep.memory.role == "harvester") {
                            container = creep.findResource(RESOURCE_ENERGY, FIND_SOURCES, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL);
                        }
                        if (creep.memory.role == "energyTransporter") {
                            container = creep.findResource(RESOURCE_ENERGY, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL);
                        }
                    }

                }
                else if (creep.room.storage != undefined && creep.room.storage.storeCapacity - _.sum(creep.room.storage.store > 0)) {
                    if (creep.room.memory.terminalTransfer != undefined) {
                        //spawn full and storage with space exists or towers need energy
                        if (creep.memory.role == "harvester") {
                            container = creep.findResource(RESOURCE_ENERGY, FIND_SOURCES, STRUCTURE_LINK, STRUCTURE_CONTAINER);
                        }
                        if (creep.memory.role == "energyTransporter") {
                            container = creep.findResource(RESOURCE_ENERGY, STRUCTURE_LINK, STRUCTURE_CONTAINER);
                        }
                    }
                    else {
                        //spawn full and storage with space exists or towers need energy
                        if (creep.memory.role == "harvester") {
                            container = creep.findResource(RESOURCE_ENERGY, FIND_SOURCES, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_TERMINAL);
                        }
                        if (creep.memory.role == "energyTransporter") {
                            container = creep.findResource(RESOURCE_ENERGY, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_TERMINAL);
                        }
                    }
                }
                else {
                    if (creep.room.memory.terminalTransfer != undefined) {
                        if (creep.memory.role == "harvester") {
                            container = creep.findResource(RESOURCE_ENERGY, FIND_SOURCES, STRUCTURE_LINK);
                        }
                        if (creep.memory.role == "energyTransporter") {
                            container = creep.findResource(RESOURCE_ENERGY, STRUCTURE_LINK);
                        }
                    }
                    else {
                        if (creep.memory.role == "harvester") {
                            container = creep.findResource(RESOURCE_ENERGY, FIND_SOURCES, STRUCTURE_LINK, STRUCTURE_TERMINAL);
                        }
                        if (creep.memory.role == "energyTransporter") {
                            container = creep.findResource(RESOURCE_ENERGY, STRUCTURE_LINK, STRUCTURE_TERMINAL);
                        }
                    }
                }
                if (container == undefined) {
                    //console.log(creep.name + "(" + creep.room.name + "): no resource found");
                    creep.memory.sleep = 5;
                    return -1;
                }
                else if (container.ticksToRegeneration == undefined && (container.energy == undefined || container.energy < 3000)) {
                    //container
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {reusePath: delayPathfinding});
                    }
                }
                else {
                    //Source
                    if (creep.harvest(container) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {reusePath: delayPathfinding});
                    }
                }
            }
            else {
                //no harvester role
                // find closest source
                container = creep.findResource(RESOURCE_ENERGY, FIND_SOURCES, STRUCTURE_LINK, STRUCTURE_CONTAINER, STRUCTURE_STORAGE);
                if (container != undefined) {
                    var res = creep.withdraw(container, RESOURCE_ENERGY);

                    if (res != OK && res != ERR_NOT_IN_RANGE) {
                        res = creep.harvest(container)
                    }

                    if (res == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {reusePath: delayPathfinding});
                    }
                }
            }
        }
        else {
            // Creep is harvesting, try to keep harvesting
            if (creep.harvest(Game.getObjectById(creep.memory.statusHarvesting)) != OK) {
                creep.memory.statusHarvesting = false;
            }
        }
        return OK;
    }
};