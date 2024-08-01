import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const readToGoogleSheets = async (data) => {
  try {
    const auth = new GoogleAuth({
      keyFile: "../gg.json",
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();

    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = '1Yu_XJbLLVjL66XWiWjRzbtcN0eGqMjqxq98iM_Vrp5I';
    const range = 'Danh mục từ khóa!A1:A';

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
  
      const rows = response.data.values;
      if (rows.length) {
        console.log('Dữ liệu từ Google Sheets:');
        rows.forEach((row) => {
          console.log(row[0]); // In ra từng giá trị trong cột A
        });
      } else {
        console.log('Không tìm thấy dữ liệu.');
      }
  } catch (err) {
    console.error('An error occurred:', err);
  }
}

readToGoogleSheets()