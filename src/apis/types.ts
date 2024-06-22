export interface OnekeyCard {
    id: number;
    gmail: string;
    card_id: string;
    card_no?: string;
    cvv?: string;
    bin: string;
    last4: string;
    network: string;
    exp_year?: string;
    exp_month?: string;
    owner_wallet?: string;
    transfer_wallet_path: string;
    transfer_wallet: string;
}

export interface TransferHistory {
    type: string,
    amount: number,
    transactionTime: string,
}

export interface CardBalance {
    bin: string;
    last4: string;
    network: string;

    balance: {
        available: number;
    }
}

export interface ChargeHistory {
    amount: number;
    tx_hash: string;
    from_wallet: string;
}

export interface CardSecretData {
    card_no: string;
    cvv: string;
    exp_year: string;
    exp_month: string;
}
