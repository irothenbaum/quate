# quate

A math path gaming


## TODO: 
- The clock only appears to add 9 seconds when you pass a round. Need to check the logic again
- Want to animate clock time adding
- Want to animate the score increasing
- Need to fix scoring logic, something like:
  - 10 points per term in the puzzle
  - up to 50% bonus for solving in < 5 seconds (5 seconds = 10% bonus, 0 seconds = 50% bonus)
  - streak multiplier (+20% for 2 in a row, +30% for 3 in a row, +40% for 4 in a row, +50% for 5+ in a row)
  - They don't stack
- There's a slight delay when the Term changes from selected to correct compared to the pathways. 
  - I think it may have to do with how the `is-correct` prop is set
