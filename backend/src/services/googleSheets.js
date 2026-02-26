/**
 * Google Sheets integration for Drape.ai
 * Syncs Users, WardrobeItems, Outfits, Donations, Collections to:
 * https://docs.google.com/spreadsheets/d/1fHk9AdcVi_Chdg2hM6IrjYObMKy1oI9clWczJXqCdOg
 */

const { google } = require('googleapis');

const SPREADSHEET_ID = '1fHk9AdcVi_Chdg2hM6IrjYObMKy1oI9clWczJXqCdOg';

const SHEET_HEADERS = {
  Users: ['id', 'phone', 'name', 'email', 'gender', 'ageRange', 'preferredStyle', 'skinTone', 'location', 'isProfileComplete', 'createdAt'],
  WardrobeItems: ['id', 'userId', 'imageUrl', 'driveFileId', 'category', 'tags', 'color', 'source', 'isDonated', 'createdAt'],
  Outfits: ['id', 'userId', 'itemIds', 'occasion', 'aiExplanation', 'status', 'compositeImageUrl', 'driveFileId', 'tags', 'collectionId', 'createdAt'],
  Donations: ['id', 'userId', 'itemIds', 'partnerId', 'partnerName', 'status', 'scheduledPickupAt', 'createdAt'],
  Collections: ['id', 'userId', 'name', 'icon', 'createdAt'],
};

let sheetsClient = null;

async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  sheetsClient = google.sheets({ version: 'v4', auth: authClient });
  return sheetsClient;
}

async function ensureSheetExists(sheetName) {
  const sheets = await getSheetsClient();
  const { data } = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const exists = data.sheets?.some(s => s.properties.title === sheetName);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{
          addSheet: { properties: { title: sheetName } }
        }]
      }
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:Z1`,
      valueInputOption: 'RAW',
      requestBody: { values: [SHEET_HEADERS[sheetName] || []] }
    });
  }
}

async function appendRow(sheetName, row) {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('Google Sheets: GOOGLE_APPLICATION_CREDENTIALS not set, skipping sync');
    return;
  }
  try {
    const sheets = await getSheetsClient();
    await ensureSheetExists(sheetName);
    const headers = SHEET_HEADERS[sheetName];
    const values = headers.map(h => {
      const v = row[h];
      if (Array.isArray(v)) return v.join(', ');
      return v != null ? String(v) : '';
    });
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] }
    });
  } catch (err) {
    console.error('Google Sheets append error:', err.message);
  }
}

async function createUser(user) {
  await appendRow('Users', {
    id: user.id,
    phone: user.phone,
    name: user.name || '',
    email: user.email || '',
    gender: user.gender || '',
    ageRange: user.ageRange || '',
    preferredStyle: user.preferredStyle?.join(', ') || '',
    skinTone: user.skinTone || '',
    location: user.location ? JSON.stringify(user.location) : '',
    isProfileComplete: user.isProfileComplete || false,
    createdAt: new Date().toISOString(),
  });
}

async function createWardrobeItem(item) {
  await appendRow('WardrobeItems', {
    id: item.id,
    userId: item.userId,
    imageUrl: item.imageUrl || '',
    driveFileId: item.driveFileId || '',
    category: item.category || '',
    tags: item.tags || [],
    color: item.color || '',
    source: item.source ? JSON.stringify(item.source) : '',
    isDonated: item.isDonated || false,
    createdAt: new Date().toISOString(),
  });
}

async function createOutfit(outfit) {
  await appendRow('Outfits', {
    id: outfit.id,
    userId: outfit.userId,
    itemIds: outfit.itemIds || [],
    occasion: outfit.occasion || '',
    aiExplanation: outfit.aiExplanation || '',
    status: outfit.status || 'suggested',
    compositeImageUrl: outfit.compositeImageUrl || '',
    driveFileId: outfit.driveFileId || '',
    tags: outfit.tags || [],
    collectionId: outfit.collectionId || '',
    createdAt: new Date().toISOString(),
  });
}

async function createDonation(donation) {
  await appendRow('Donations', {
    id: donation.id,
    userId: donation.userId,
    itemIds: donation.itemIds || [],
    partnerId: donation.partnerId || '',
    partnerName: donation.partnerName || '',
    status: donation.status || 'scheduled',
    scheduledPickupAt: donation.scheduledPickupAt || '',
    createdAt: new Date().toISOString(),
  });
}

async function createCollection(collection) {
  await appendRow('Collections', {
    id: collection.id,
    userId: collection.userId,
    name: collection.name || '',
    icon: collection.icon || '',
    createdAt: new Date().toISOString(),
  });
}

module.exports = {
  createUser,
  createWardrobeItem,
  createOutfit,
  createDonation,
  createCollection,
};
