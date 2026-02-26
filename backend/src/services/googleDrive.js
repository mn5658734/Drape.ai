/**
 * Google Drive integration for Drape.ai
 * Stores cloth photos and generated outfit photos in:
 * https://drive.google.com/drive/u/0/folders/1lKPyq3zHIo9Oytr6EEcwqWl03XyebwRP
 *
 * Folder structure:
 *   /Drape.ai Photos/
 *     /{userId}/
 *       /clothes/     - wardrobe item photos
 *       /outfits/     - saved outfit composite images
 */

const { google } = require('googleapis');
const path = require('path');

const ROOT_FOLDER_ID = '1lKPyq3zHIo9Oytr6EEcwqWl03XyebwRP';

let driveClient = null;
const userFolderCache = {};

async function getDriveClient() {
  if (driveClient) return driveClient;
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });
  const authClient = await auth.getClient();
  driveClient = google.drive({ version: 'v3', auth: authClient });
  return driveClient;
}

async function ensureUserFolders(userId) {
  if (userFolderCache[userId]) return userFolderCache[userId];
  const drive = await getDriveClient();

  const userFolder = await findOrCreateFolder(drive, `${userId}`, ROOT_FOLDER_ID);
  const clothesFolder = await findOrCreateFolder(drive, 'clothes', userFolder.id);
  const outfitsFolder = await findOrCreateFolder(drive, 'outfits', userFolder.id);

  userFolderCache[userId] = { user: userFolder.id, clothes: clothesFolder.id, outfits: outfitsFolder.id };
  return userFolderCache[userId];
}

async function findOrCreateFolder(drive, name, parentId) {
  const { data } = await drive.files.list({
    q: `'${parentId}' in parents and name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
  });
  if (data.files?.length) return data.files[0];
  const { data: created } = await drive.files.create({
    requestBody: { name, parents: [parentId], mimeType: 'application/vnd.google-apps.folder' },
  });
  return created;
}

async function uploadFile(drive, folderId, fileName, mimeType, body) {
  const { data } = await drive.files.create({
    requestBody: { name: fileName, parents: [folderId] },
    media: { mimeType, body: body instanceof Buffer ? body : Buffer.from(body) },
  });
  return data.id;
}

async function uploadClothPhoto(userId, buffer, filename, mimeType = 'image/jpeg') {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('Google Drive: GOOGLE_APPLICATION_CREDENTIALS not set');
    return null;
  }
  try {
    const drive = await getDriveClient();
    const { clothes } = await ensureUserFolders(userId);
    const uniqueName = `${Date.now()}_${path.basename(filename || 'photo')}`;
    const fileId = await uploadFile(drive, clothes, uniqueName, mimeType, buffer);
    const { data } = await drive.files.get({ fileId, fields: 'webViewLink' });
    return { fileId, url: data.webViewLink };
  } catch (err) {
    console.error('Google Drive upload error:', err.message);
    return null;
  }
}

async function uploadOutfitPhoto(userId, buffer, filename, mimeType = 'image/jpeg') {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn('Google Drive: GOOGLE_APPLICATION_CREDENTIALS not set');
    return null;
  }
  try {
    const drive = await getDriveClient();
    const { outfits } = await ensureUserFolders(userId);
    const uniqueName = `${Date.now()}_${path.basename(filename || 'outfit')}`;
    const fileId = await uploadFile(drive, outfits, uniqueName, mimeType, buffer);
    const { data } = await drive.files.get({ fileId, fields: 'webViewLink' });
    return { fileId, url: data.webViewLink };
  } catch (err) {
    console.error('Google Drive upload error:', err.message);
    return null;
  }
}

async function uploadFromUrl(userId, imageUrl, type = 'clothes') {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl);
    const buffer = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get('content-type') || 'image/jpeg';
    return type === 'outfits'
      ? uploadOutfitPhoto(userId, buffer, 'outfit.jpg', mime)
      : uploadClothPhoto(userId, buffer, 'cloth.jpg', mime);
  } catch (err) {
    console.error('Upload from URL error:', err.message);
    return null;
  }
}

module.exports = {
  uploadClothPhoto,
  uploadOutfitPhoto,
  uploadFromUrl,
  ensureUserFolders,
};
