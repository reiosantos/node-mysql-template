
export class Utils {
  static sortListOfObjects(list: Array<Record<string, any>>, onAttribute: string) {
    list.sort((a, b) => {
      if (a[onAttribute].toLowerCase() < b[onAttribute].toLowerCase()) return -1;
      if (a[onAttribute].toLowerCase() > b[onAttribute].toLowerCase()) return 1;
      return 0;
    });
  }
}
