// qr_app.js
const fs = require("fs");
const QRCode = require("qrcode");
const Jimp = require("jimp");
const jsQR = require("jsqr");
const csv = require("csv-parser");

const DATA_FILE = "registrations.json";

// CSV Loading
function processCSV(csvFile) {
  const results = [];
  fs.createReadStream(csvFile)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const row of results) {
        // Name and email headers
        const name = row["Your first and last name"];
        const email = row["Your email"];

        if (name && email) {
          await generateQR(name, email);
        } else {
          console.warn("WARNING: Missing name or email in row:", row);
        }
      }
      console.log("\nAll QR codes generated in ./qrcodes");
    });
}

// --- Utility to load or save registrations ---
function loadDB() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function saveDB(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- Generate QR Code ---
async function generateQR(name, email) {
  const id = Math.random().toString(36).substr(2, 9);
  const record = { id, name, email };

  // Save record
  const db = loadDB();
  db.push(record);
  saveDB(db);

  // Generate QR code with unique ID only
  const qrFile = `./qrcodes/${email}.png`;
  await QRCode.toFile(qrFile, `Name: ${name}\nEmail: ${email}`, { width: 300 });
  console.log(`QR code saved as ${qrFile}`);
  console.log(`Registered: ${name} (${email})`);
}

// --- Scan QR Code and validate ---
// Testing stage - do not use
async function scanQR(imagePath) {
  const image = await Jimp.read(imagePath);
  const qrCode = jsQR(
    new Uint8ClampedArray(image.bitmap.data),
    image.bitmap.width,
    image.bitmap.height
  );

  if (!qrCode) {
    console.log("No QR code detected.");
    return;
  }

  const id = qrCode.data.trim();
  const db = loadDB();
  const entry = db.find((e) => e.id === id);

  if (entry) {
    console.log(`Valid QR for: ${entry.name} (${entry.email})`);
  } else {
    console.log("Invalid QR code (not found in database).");
  }
}

// --- CLI Interface ---
const [, , command, ...args] = process.argv;

(async () => {
  // For a singular QR code. Useful for testing or changing emails/names quickly
  if (command === "generate") {
    const [name, email] = args;
    if (!name || !email) {
      console.log("Usage: node qr_app.js generate <name> <email>");
      return;
    }
    await generateQR(name, email);
  }

  // Scan a QR code from your machine
  else if (command === "scan") {
    const [path] = args;
    if (!path) {
      console.log("Usage: node qr_app.js scan <path_to_qr_image>");
      return;
    }
    await scanQR(path);
  }

  // Given a CSV from the Google Sheet responses, generate all the QR codes
  // NOTE: Headers and save path cannot be specified in the CLI. You must modify them directly
  // In the code. I'll think of a better workaround later.
  else if (command === "generate_from_csv") {
    const [path] = args;
    if (!path) {
      console.log("Usage: node qr_app.js generate_from_csv <path_to_csv>");
      return;
    }
    await processCSV(path);
  }

  // Help module
  else {
    console.log("Commands:");
    console.log(
      "  node qr_app.js generate <name> <email>   → Generate QR code"
    );
    console.log(
      "  node qr_app.js scan <path_to_image>     → Scan and validate QR code"
    );
    console.log(
      "  node qr_app.js generate_from_csv <path_to_csv>     → Generate a set of QR codes in a default directory from a CSV"
    );
  }
})();
