module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        var nameFlag = creep.findMyFlag("protector");
        var protectorFlag = Game.flags[nameFlag];
        if (creep.room.memory.hostiles.length > 0) {
            // Attack code
            var hostiles = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), function (c) { return isHostile(c)});
            var target = creep.pos.findClosestByPath(hostiles);

            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: moveReusePath()});
            }
        }
        else if (protectorFlag != undefined) {
            //Move to flag if not there
            let range = creep.pos.getRangeTo(protectorFlag);
            if (range > 5) {
                creep.moveTo(protectorFlag, {ignoreCreeps: false, reusePath: moveReusePath()});
            }
        }
        else {
            //No flag for protector anymore
            if (creep.goToHomeRoom() == true) {
                let range = creep.pos.getRangeTo(creep.room.controller);
                if (range > 1) {
                    creep.moveTo(creep.room.controller, {reusePath: moveReusePath(), ignoreCreeps: true});
                }
            }
        }
    }
};