export const dateKey = date => date.toISOString().slice(0, 10);
export const dailyTotal = record => Object.values(record?.items || {}).reduce((sum, value) => sum + value, 0);
