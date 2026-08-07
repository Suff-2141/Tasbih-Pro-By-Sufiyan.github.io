export const increment = counter => Number(counter || 0) + 1;
export const reachedGoal = (count, goal) => Boolean(goal) && count >= goal;
