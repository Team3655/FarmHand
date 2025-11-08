import { invoke } from "@tauri-apps/api/core";

export function isFieldInvalid(
  required: boolean,
  type: string,
  defaultValue: any,
  value: any
) {
  return (
    required &&
    (value === "" ||
      (type === "checkbox" && value === false) ||
      (type === "counter" && value === defaultValue))
  );
}

export function EmbedDataInSvg(code: QrCode) {
  let svgToSave = code.image;
  if (svgToSave && code.data) {
    const cdataPayload = `<![CDATA[${code.data}]]>`;
    const descRegex = /<desc>.*?<\/desc>/s;

    if (descRegex.test(svgToSave)) {
      svgToSave = svgToSave.replace(descRegex, `<desc>${cdataPayload}</desc>`);
    } else {
      const dataPayload = `<desc>${cdataPayload}</desc>`;
      const svgTagIndex = svgToSave.indexOf("<svg");
      if (svgTagIndex !== -1) {
        const endOfOpeningSvgTag = svgToSave.indexOf(">", svgTagIndex);
        if (endOfOpeningSvgTag !== -1) {
          svgToSave =
            svgToSave.slice(0, endOfOpeningSvgTag + 1) +
            dataPayload +
            svgToSave.slice(endOfOpeningSvgTag + 1);
        }
      }
    }
  }
  return svgToSave;
}

/**
 * Gets the <desc> tag from inside an SVG
 * @param contents the SVG to use
 * @returns the contents of the <desc> tag
 */
export function GetDescFromSvg(contents: string) {
  const match = contents.match(/<desc><!\[CDATA\[(.*?)\]\]><\/desc>/s);
  return match ? match[1] : "";
}

/**
 * Creates a unique hashed ID for a given schema
 * @param schema The schema to hash
 * @returns
 */
export async function createSchemaHash(schema: Schema): Promise<string> {
  const schemaHash = await invoke<string>("hash_schema", {
    schema: JSON.stringify(schema),
  });
  return schemaHash;
}

/**
 * Compresses JSON for embedding into a qr code
 * @param data JSON object to compress
 * @returns compressed string
 */
export async function compressData(data: any): Promise<string> {
  const json = JSON.stringify(data);
  return await invoke<string>("compress_fields", { fields: json });
}

/**
 * Decompress base64-encoded compressed string
 * @param encoded string to decompress
 * @returns the decompressed, encoded string
 */
export async function decompressData(encoded: string): Promise<any> {
  const json = await invoke<string>("decompress_data", { data: encoded });
  return JSON.parse(json);
}

/**
 * Gets a field from match data without using its ID, it then returns its ID.
 * @param fieldName name of field to get
 * @param schema current schema
 * @param matchData the data of the match
 * @returns the field without any special characters or spaces
 */
export function getFieldValueByName(
  fieldName: string,
  schema: Schema,
  matchData: Map<number, any>
): string | null {
  let fieldId;
  schema.sections.forEach((schema) => {
    schema.fields.find((f) => {
      if (f.name.toLowerCase().trim() === fieldName.toLowerCase().trim()) {
        fieldId = f.id;
      }
    });
  });
  if (!fieldId) return null;
  const value = matchData.get(fieldId);
  return value !== undefined
    ? String(value).replace(/[^a-zA-Z0-9_-]/g, "")
    : null;
}

export function matchDataJsonToMap(object: any) {
  const map = new Map<number, any>();
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      map.set(Number.parseInt(key), object[key]);
    }
  }

  return map;
}
