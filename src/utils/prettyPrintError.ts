import PrettyError from "pretty-error";

export function prettyPrintError(error: any) {
  const pe = new PrettyError();
  console.log(pe.render(error));
}