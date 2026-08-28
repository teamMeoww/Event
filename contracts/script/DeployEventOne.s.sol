// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EventOneTicket.sol";
import "../src/EventOneCredential.sol";

contract DeployEventOne is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address issuerAddress = vm.envAddress("ISSUER_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        EventOneTicket ticket = new EventOneTicket();
        ticket.grantRole(ticket.ISSUER_ROLE(), issuerAddress);

        EventOneCredential credential = new EventOneCredential();
        credential.grantRole(credential.ISSUER_ROLE(), issuerAddress);

        vm.stopBroadcast();
    }
}
