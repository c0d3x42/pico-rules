import { Context } from "./context";

//export function logVisit(context: Context) {
export function logVisit(
  target: Object,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor
): PropertyDescriptor {
  const method = propertyDescriptor.value;

  propertyDescriptor.value = function(...args: any[]) {
    // @ts-ignore
    const id = this.id;
    const result = method.apply(this, args);
    if (result === true) {
      args.forEach(arg => {
        if (arg instanceof Context) {
          if (target.hasOwnProperty("id")) {
            arg.logVisit("lop");
          }
        } else {
          console.log("no");
        }
      });
    }
    return result;
  };

  return propertyDescriptor;
}
//}
