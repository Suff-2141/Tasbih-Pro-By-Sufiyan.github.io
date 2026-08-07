export const average = values => values.length ? Math.round(values.reduce((a,b) => a + b, 0) / values.length) : 0;
export const maximum = values => Math.max(0, ...values);
