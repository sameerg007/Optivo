/**
 * SMS Reader Plugin for Capacitor
 * Native bridge to read SMS messages on Android
 */

import { registerPlugin } from '@capacitor/core';

/**
 * @typedef {Object} SMSMessage
 * @property {string} id - Message ID
 * @property {string} address - Sender address/number
 * @property {string} body - Message body
 * @property {number} date - Timestamp in milliseconds
 * @property {string} type - Message type (1=inbox, 2=sent)
 */

/**
 * @typedef {Object} SMSReaderPlugin
 */
const SMSReader = registerPlugin('SMSReader', {
    web: () => import('./smsReaderWeb').then(m => new m.SMSReaderWeb())
});

export default SMSReader;

/**
 * Check if SMS permission is granted
 * @returns {Promise<{granted: boolean}>}
 */
export async function checkPermission() {
    return SMSReader.checkPermission();
}

/**
 * Request SMS read permission
 * @returns {Promise<{granted: boolean}>}
 */
export async function requestPermission() {
    return SMSReader.requestPermission();
}

/**
 * Get recent SMS messages
 * @param {Object} options
 * @param {number} options.limit - Max number of messages to return
 * @param {number} options.since - Only get messages after this timestamp
 * @returns {Promise<{messages: SMSMessage[]}>}
 */
export async function getMessages(options = {}) {
    return SMSReader.getMessages(options);
}

/**
 * Start listening for new SMS messages
 * @param {Function} callback - Called when new SMS arrives
 * @returns {Promise<void>}
 */
export async function startListening(callback) {
    await SMSReader.addListener('smsReceived', callback);
    return SMSReader.startListening();
}

/**
 * Stop listening for SMS messages
 * @returns {Promise<void>}
 */
export async function stopListening() {
    return SMSReader.stopListening();
}

/**
 * Get bank transaction SMS only
 * @param {Object} options
 * @param {number} options.limit - Max messages
 * @param {number} options.days - Get messages from last N days
 * @returns {Promise<{messages: SMSMessage[]}>}
 */
export async function getBankMessages(options = { limit: 100, days: 30 }) {
    return SMSReader.getBankMessages(options);
}
