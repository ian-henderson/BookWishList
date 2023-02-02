export default function formatNames(names: string[]) {
  function toAuthorString(acc: string, name: string, index: number) {
    // Some names are "lastName, firstName" - the comma makes the formatting
    // inconsistent commas will be used to enumerate multiple names
    if (name.includes(",")) {
      const [lastName, firstName] = name.split(",");
      name = [firstName, lastName].join(" ");
    }

    if (index === 0) return name;

    if (names.length === 2 && index === 1) return `${acc} and ${name}`;

    if (names.length > 2 && index === names?.length - 1)
      return `${acc}, and ${name}`;

    return `${acc}, ${name}`;
  }

  return names.reduce(toAuthorString, "");
}
