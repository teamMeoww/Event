package com.eventone.blockchainservice.contract;

import org.web3j.protocol.core.methods.response.TransactionReceipt;

public class EventOneCredential {
    
    public static EventOneCredential load(String address, Object web3j, Object credentials, Object gasProvider) {
        return new EventOneCredential();
    }
    
    public RemoteFunctionCall<TransactionReceipt> issueCredential(String attendee, byte[] eventId, byte[] credentialType, String metadataUri) {
        return new RemoteFunctionCall<>();
    }

    public RemoteFunctionCall<TransactionReceipt> revokeCredential(String attendee, String tokenId) {
        return new RemoteFunctionCall<>();
    }
    
    public static class RemoteFunctionCall<T> {
        public T send() throws Exception {
            TransactionReceipt receipt = new TransactionReceipt();
            receipt.setTransactionHash("0xmockCredTx");
            receipt.setBlockNumber("0x1");
            receipt.setStatus("0x1"); // OK
            return (T) receipt;
        }
    }
}
