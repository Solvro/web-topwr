/**
 * Determines the fetch configuration to use based on the provided arguments.
 * In some environments, such as vitest, using the FormData approach can cause fetches to freeze,
 * so it is useful to be able to use the direct upload option.
 *
 * @param file the file to upload.
 * @param extension the file extension (optional). If specified, the file is sent directly and the extension is taken from this parameter.
 * @returns an object containing the fetch options.
 */
export function getFileFetchOptions(file: File, extension?: string) {
  if (extension == null) {
    const formData = new FormData();
    formData.append("file", file);
    return { body: formData };
  }
  return {
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  };
}
