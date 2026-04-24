export function removeUriLastSlash(uri: string): string | null {
  if(uri.endsWith("/") || uri.endsWith("\\")){
    const array = new Array(uri);
    array.pop();
    return array.toString();
  }
  return null;
}