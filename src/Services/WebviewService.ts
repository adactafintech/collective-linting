export class WebviewService {

    public static getStatWebviewContent(positiveData: string, negativeData: string) {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cat Coding</title>
        </head>
        <body>
            <table style="border: 1px solid white">
                <tr style="border: 1px solid white">
                    <th colspan="3">
                        High Quality Documents
                    </th>
                </tr>
                <tr style="border: 1px solid white">
                    <th>Document</th>
                    <th>Average Score</th>
                    <th>Number of Scores</th>
                </tr>
                <tbody>
                    ${positiveData}
                </tbody>
            </table>
            <br/><br/>
            <table style="border: 1px solid white">
            <tr style="border: 1px solid white">
                <th colspan="3">
                    Low Quality Documents
                </th>
            </tr>
            <tr style="border: 1px solid white">
                <th>Document</th>
                <th>Average Score</th>
                <th>Number of Scores</th>
            </tr>
            <tbody>
                ${negativeData}
            </tbody>
        </table>
        </body>
        </html>`;
    }
}