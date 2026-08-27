import dynamicDedupe, { activate, deactivate, reset } from '@stackline/dynamic-dedupe'

activate('.js', 2)
deactivate('.js')
reset()
dynamicDedupe.activate()
