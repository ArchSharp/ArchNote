import * as mammoth from "mammoth";
import * as pdf from "html-pdf";

export function convertToPdf(
  inputDocFilePathWithFileName: string,
  outputDocFilePathWithFileName: string,
  callback: (error: Error | null, result?: any) => void
): void {
  mammoth
    .convertToHtml({ path: inputDocFilePathWithFileName })
    .then((result) => {
      const html = result.value; // The generated HTML
      pdf
        .create(html)
        .toFile(outputDocFilePathWithFileName, function (err, res) {
          if (err) {
            callback(err);
            console.log("Error: ", err);
            return;
          }
          callback(null, res);
        });
      const messages = result.messages; // Any messages, such as warnings during conversion
      console.log("success, ", messages);
    });
}
