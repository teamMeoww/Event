package com.eventone.blockchainservice.contract;

import org.web3j.protocol.core.methods.response.TransactionReceipt;

public class EventOneTicket {
    
    public static EventOneTicket load(String address, Object web3j, Object credentials, Object gasProvider) {
        return new EventOneTicket();
    }
    
    public RemoteFunctionCall<TransactionReceipt> mintTicket(String attendee, byte[] eventId) {
        return new RemoteFunctionCall<>();
    }
    
    public static class RemoteFunctionCall<T> {
        public T send() throws Exception {
            TransactionReceipt receipt = new TransactionReceipt();
            receipt.setTransactionHash("0xmockTkt");
            receipt.setBlockNumber("0x1");
            receipt.setStatus("0x1"); // OK
            return (T) receipt;
        }
    }
}
