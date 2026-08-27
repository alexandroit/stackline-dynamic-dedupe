import dynamicDedupe = require('../../index')

dynamicDedupe.activate()
dynamicDedupe.activate('.ts', 2)
dynamicDedupe.deactivate('.ts')
dynamicDedupe.reset()
