import { KeyManager, KeyManagerPlugins, KeyType } from '@stellar/wallet-sdk'
import { Networks } from 'stellar-sdk'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { persisted } from 'svelte-local-storage-store'

function createWallet() {
    const { subscribe, set, update } = persisted('local:walletStore', {})

    return {
        subscribe,

        register: (publicKey, secretKey, pincode) => {
            const keyManager = setupKeyManager()

            keyManager
                .storeKey({
                    key: {
                        type: KeyType.plaintextKey,
                        publicKey: publicKey,
                        privateKey: secretKey,
                    },

                    password: pincode,
                    encrypterName: KeyManagerPlugins.ScryptEncrypter.name,
                })
                .then((keyMetadata) => {
                    set({
                        keyId: keyMetadata.id,
                        publicKey,
                        // remove this before publishing, it's just to make the secret key accessible
                        // in case we need to do some manual transactions or something.
                        devInfo: {
                            secretKey,
                        },
                    })
                })
                .catch((err) => {
                    console.error('Error saving key', err.toString())
                    throw error(400, err.toString())
                })
        },

        sign: (transaction, pincode) => {
            const keyManager = setupKeyManager()
            let signedTransaction = keyManager
                .signTransaction({
                    transaction,
                    id: get(walletStore).keyId,
                    password: pincode,
                })
                .then((transaction) => {
                    return transaction
                })
                .catch((err) => {
                    console.error('Error signing transaction', err)
                    throw error(400, err)
                })

            return signedTransaction
        },
    }
}

export const walletStore = createWallet()

export const confirmCorrectPincode = (pincode, firstPincode = null, signup = false) => {
    if (signup) {
        if (pincode === firstPincode) {
            return true
        } else {
            throw error(400, 'pincode mismatch')
        }
    } else {
        throw error(400, 'only signups now')
    }
}

const setupKeyManager = () => {
    const localKeyStore = new KeyManagerPlugins.LocalStorageKeyStore()
    localKeyStore.configure({
        prefix: 'local',
        storage: localStorage,
    })
    const keyManager = new KeyManager({
        keyStore: localKeyStore,
    })
    keyManager.registerEncrypter(KeyManagerPlugins.ScryptEncrypter)

    return keyManager
}
