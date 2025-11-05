# QiSkit-Fall-Fest
Codebase for QR code generation, Email sending, and image hosting.

## Prerequisites
- Node.js (23.0.0+)
- Python 3.9 or higher

Make sure the following packages are installed for Node:
- qrcode
- jsqr
- csv-parser

**If you want to run this yourself, you need a Google Cloud account! After creation, download the JSON file, which contains all your secrets and the project ID (file name will be credentials_(giant hash)) and put it in the same directory as the cloned repo.  
  !! *NEVER SHARE YOUR CREDENTIALS JSON FILE OR ANY SENSITIVE DATA WITH OTHERS* !!**

## How to use
Make sure all the files referred to in the instructions are inside the same directory as the cloned repo.
### QR Code Generation
Call commands from the CLI. Basic usage:  
`node qr_app.js <command> <args>`  

Examples:   

To generate a single QR code:
`node qr_app.js generate "John Doe" johndoe@gmail.com`   

To generate a directory of QR codes from a CSV:
`node qr_app.js generate_from_csv path/to/csv/responses.csv`  

To generate a list of QR codes from a CSV, ensure that the file includes two headers: "Your first and last name" and "Your email". Otherwise, the code won't work correctly.  

All the QR codes will save in a directory called "qrcodes". *This is the only directory it will save in, so make sure you save each batch if you don't want your QR codes saving all in one place!*

### Email Sending
Only works from local machines (no collab or online notebooks will work).  

Jupyter notebook that sends emails. Read through the notebook to get an idea of what each cell does and what you need to modify to change the message body/attachments/etc.  

*Important: Running sequentially will prompt you to sign in to your Gmail account with your currently active browser. This is just to authenticate your Gmail account with your Google Cloud app, which allows you to use the Gmail API. Sign in with the email you wish to use for sending. You may get a security warning telling you that the app is potentially unsafe, but as long as you recognize the name of the app and the app creator's email is an email you recognize, you are fine.*
