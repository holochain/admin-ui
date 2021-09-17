export function shortenStrRec(object: any) {
  if (object === undefined || object === null) return object;
  else if (Array.isArray(object)) {
    return object.map(shortenStrRec);
  } else if (typeof object === 'object') {
    for (const key of Object.keys(object)) {
      object[key] = shortenStrRec(object[key]);
    }
    return object;
  } else if (typeof object === 'string' && object.length > 23) {
    return `${object.substring(0, 20)}...`;
  }
  return object;
}
