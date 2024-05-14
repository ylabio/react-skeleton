export function parseControls (control?: string): Map<string, string | number> {
  if (!control) return new Map();
  return new Map(
    control.split(',').map((item): [string, string | number] => {
      let [name, value] = item.split('=', 2);
      name = name.trim();
      value = value ? value.trim() : name;

      const numberValue = Number(value);
      if (!Number.isNaN(numberValue) && numberValue !== null) {
        return [name, numberValue];
      }
      return [name, value];
    }),
  );
}

export function parseAcceptEncoding (value?: string): string[] {
  if (!value) return [];
  return value.split(',').map((item) => item.trim());
}

export function getHeadersValues (
  headers: { [index: string]: unknown },
  names: string[],
) {
  const result = [] as string[];
  names.forEach((name) => {
    name = name.toLowerCase();
    if (typeof headers[name] === 'string') {
      result.push(headers[name] as string);
    }
  });
  return result;
}
