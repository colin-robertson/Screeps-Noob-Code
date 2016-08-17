const delayPathfinding = 2;
const RESOURCE_SPACE = "space";

module.exports = function() {
    // find nearest requested resource and return object


	Creep.prototype.findResource =
	function(resource, sourceTypes) {
	    if (this.memory.targetBuffer != undefined && this.memory.resourceBuffer != undefined && this.memory.resourceBuffer == resource && this.memory.resourceTicker != undefined && this.memory.resourceTicker >= Game.time - delayPathfinding)
        {
            //return buffered resource
            return Game.getObjectById(this.memory.targetBuffer);
        }
        else {
            var IDBasket = new Array();
            var tempArray = new Array();

            for (var argcounter = 1; argcounter < arguments.length; argcounter++) {
                // Go through requested sourceTypes
                switch (arguments[argcounter]) {
                    case FIND_SOURCES:
                        if (resource == RESOURCE_ENERGY) {
                            tempArray = this.room.memory.roomArraySources;
                            for (var s in tempArray) {
                                if (Game.getObjectById(tempArray[s]).energy > 0) {
                                    IDBasket.push(Game.getObjectById(tempArray[s]));
                                }
                            }
                        }
                        break;

                    case STRUCTURE_EXTENSION:
                        if (resource == RESOURCE_ENERGY) {
                            tempArray = this.room.memory.roomArrayExtensions;
                            for (var s in tempArray) {
                                if (Game.getObjectById(tempArray[s]).energy > 0) {
                                    IDBasket.push(Game.getObjectById(tempArray[s]));
                                }
                            }
                        }
                        else if (resource == RESOURCE_SPACE) {
                            // Look for links with space left
                            tempArray = creep.room.memory.roomArrayExtensions;
                            for (var s in tempArray) {
                                let container = Game.getObjectById(tempArray[s]);
                                if (container.energy > 0) {
                                    IDBasket.push(container);
                                }
                            }
                        }
                        break;

                    case STRUCTURE_SPAWN:
                        if (resource == RESOURCE_ENERGY) {
                            tempArray = this.room.memory.roomArraySpawns;
                            for (var s in tempArray) {
                                if (Game.getObjectById(tempArray[s]).energy > 0) {
                                    IDBasket.push(Game.getObjectById(tempArray[s]));
                                }
                            }
                        }
                        else if (resource == RESOURCE_SPACE) {
                            // Look for spawns with space left
                            tempArray = creep.room.memory.roomArraySpawns;
                            for (var s in tempArray) {
                                let container = Game.getObjectById(tempArray[s]);
                                if (container.energy > 0) {
                                    IDBasket.push(container);
                                }
                            }
                        }
                        break;

                    case STRUCTURE_LINK:
                        if (resource == RESOURCE_ENERGY) {
                            tempArray = this.room.memory.roomArrayLinks;
                            for (var s in tempArray) {
                                if (Game.getObjectById(tempArray[s]).energy > 0) {
                                    IDBasket.push(Game.getObjectById(tempArray[s]));
                                    //console.log(this.memory.role + " " + this.name + " link: " + Game.getObjectById(tempArray[s]).energy);
                                }
                            }
                        }
                        else if (resource == RESOURCE_SPACE) {
                            // Look for links with space left
                            tempArray = creep.room.memory.roomArrayLinks;
                            for (var s in tempArray) {
                                let container = Game.getObjectById(tempArray[s]);
                                if (container.energy > 0) {
                                    IDBasket.push(container);
                                }
                            }
                        }
                        break;

                    case STRUCTURE_CONTAINER:
                        if (resource == RESOURCE_SPACE) {
                            // Look for containers with space left
                            tempArray = creep.room.memory.roomArrayContainers;
                            for (var s in tempArray) {
                                let container = Game.getObjectById(tempArray[s]);
                                if (container.storeCapacity - _.sum(container.store) > 0) {
                                    IDBasket.push(container);
                                }
                            }
                        }
                        else {
                            // Look for containers with resource
                            tempArray = this.room.memory.roomArrayContainers;
                            for (var s in tempArray) {
                                if (Game.getObjectById(tempArray[s]).store[resource] > 0) {
                                    IDBasket.push(Game.getObjectById(tempArray[s]));
                                }
                            }
                        }
                        break;

                    case STRUCTURE_STORAGE:
                        if (resource == RESOURCE_SPACE) {
                            // Look for storage with space left
                            if (this.room.storage.storeCapacity - _.sum(this.room.storage.store) > 0) {
                                IDBasket.push(this.room.storage);
                            }
                        }
                        else {
                            // Look for containers with resource
                            if (this.room.storage != undefined && this.room.storage[resource] > 0) {
                                IDBasket.push(Game.getObjectById(tempArray[s]));
                            }
                        }
                        break;

                    case STRUCTURE_TERMINAL:
                        if (resource == RESOURCE_SPACE) {
                            // Look for storage with space left
                            if (this.room.terminal.storeCapacity - _.sum(this.room.terminal.store) > 0) {
                                IDBasket.push(this.room.terminal);
                            }
                        }
                        else {
                            // Look for containers with resource
                            if (this.room.terminal.store[resource] > 0) {
                                IDBasket.push(this.room.terminal);
                            }
                        }
                        break;
                }
            }

            //Get path to collected objects
            var target = this.pos.findClosestByPath(IDBasket);
            if (target != null && target.cooldown != undefined) {
                //console.log(this.memory.role + " " + this.name + " target: " + target);
            }
            this.memory.resourceBuffer = resource;
            this.memory.resourceTicker = Game.time;
            if (target != null) {
                this.memory.targetBuffer = target.id;
            }
            else {
                return null;
            }

            return target;
        }
	}
};