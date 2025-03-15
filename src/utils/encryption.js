const base64ToArrayBuffer = (base64) => {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export const importAESKey = async (base64Key) => {
    const key = base64ToArrayBuffer(base64Key);
    return await crypto.subtle.importKey('raw', key, {name: 'AES-GCM'}, false, ['encrypt', 'decrypt']);
}

export const encryptMessage = async (message, base64key) => {
    const key = await importAESKey(base64key);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(message)
    );

    return {
        encryptedMessage: arrayBufferToBase64(encryptedBuffer),
        iv: arrayBufferToBase64(iv)
    }

}


export const decryptMessage = async (encryptedMessage, iv, base64Key) => {
    const key = await importAESKey(base64Key);
    const encryptedBuffer = base64ToArrayBuffer(encryptedMessage);
    const ivBuffer = base64ToArrayBuffer(iv);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        key,
        encryptedBuffer
    );
    return new TextDecoder().decode(decryptedBuffer);
}