export function haptic(level='light'){const patterns={off:0,light:10,medium:22,strong:38};if(navigator.vibrate&&patterns[level])navigator.vibrate(patterns[level]);}
