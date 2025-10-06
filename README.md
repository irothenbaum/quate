# quate

A math path game


## TODO:
- TIMES UP (game over) screen.
- High Score tracking.
- Score styling / incrementing.
- Streak styling / incrementing.
- There's a flash delay when starting the first level. I think this is related to the world around it staring its animation on "game_action === starting", but then the path renders at game_action === transition-level and starts its animation for the same duration except it's transition_step_ms late. Not sure whether to make it recognize level 0 and animate faster? Or to have the other world stuff recognize its menu and animate longer?
