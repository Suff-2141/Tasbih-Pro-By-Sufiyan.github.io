export async function requestNotificationPermission(){ return 'Notification' in window ? Notification.requestPermission() : 'denied'; }
export function showReminder(message='Time for your Dhikr 🤲'){ if('Notification' in window && Notification.permission==='granted') new Notification('Tasbih Pro',{body:message}); }
