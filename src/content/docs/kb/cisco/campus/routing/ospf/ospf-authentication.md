---
title: OSPF Authentication
tags:
  - ospf
status: draft
version: 0.0.1
---

Regardless of the type of authentication method, the method is encoded in the standard OSPF packet header as the authentication type field shown in the capture below:

```
Internet Protocol Version 4, Src: 12.1.1.1, Dst: 224.0.0.5
Open Shortest Path First
    OSPF Header
        Version: 2
        Message Type: Hello Packet (1)
        Packet Length: 48
        Source OSPF Router: 0.0.0.1
        Area ID: 0.0.0.0 (Backbone)
        Checksum: 0xd292 [correct]
        *Auth Type: Null (0)
        Auth Data (none): 0000000000000000
    OSPF Hello Packet
    OSPF LLS Data Block
```
## Type 1 Authentication

With the Type 1 authentication or the null authentication, OSPF protocol packets exchanged between neighbors are not authenticated. This is the default authentication method in OSPF

## Type 2 Authentication

Type 2 authentication, or the simple password authentication (more commonly referred to as plain-text authentication), makes use of plain-text passwords carried in OSPF protocol packets between neighbors for authentication. These passwords are sent “in the clear” meaning they are not encrypted or otherwise obfuscated when sent between neighbors. For a neighbor to accept a protocol packet, the packet must contain the same plain-text password that is configured on the local router.

1. Enable authentication in the OSPF router configuration mode
2. Enable authentication on the interface

```
router ospf 1
 area <area-number> authentication

interfac Gig x/y
 ip ospf authentication-key xxx
```

## Type 3 authentication Message Digest

Type 3 authentication, also known as cryptographic authentication, generates an MD5 hash using a key ID and 128-bit password inserted as a digest into OSPF protocol packets. This digest is then used to authenticate packets on the receiving end. If the receiving router calculates the same MD5 digest, then the packet is accepted.

```
router ospf 1
 area 0 authentication message-digest

interface Gig x/y
 ip ospf message-digest-key <id> md5 <password>
```
#### Key Rollover

OSPF uses these key IDs to keep track of which key should be specified for use in the authentication section of the OSPF header. Receiving routers read the key ID specified and use a matching, locally configured key ID to generate its own MD5 hash. This process may seem unnecessarily complicated, but it exists for the specific purpose of initiating key rollover, or the process of changing shared secret key values.

It may be necessary to change a shared secret key if, for example, the key is compromised or as a good security practice on a regular basis. As the new shared secret key is implemented, some routers will have only the new shared secret configured while others will have the old, shared secret configured. In the interim time, those routers with mismatched keys (new compared to old), will not form OSPF adjacencies. In fact, the OSPF adjacency will go down between those routers, leading to incomplete routing information in the network.

OSPF counters this through the use of multiple shared secret keys configured on an interface or network using multiple key IDs. Applied to IOS, the `ip ospf message-digest-key` command can be entered multiple times with different key ID/shared secret values. The router will use the youngest key ID, or the key ID that was configured last, in all of its protocol packet

1. Configure Key ID 2 R1's on interface g0/2
2. R1 will begin trying to use Key 2 for authentication as its youngest key
3. The output of `show ip ospf interface g0/2` however states “1 neighbor(s) using the old key(s)”. This is because Key ID 2 hasn’t been configured on R2 and it is still sending OSPF packets with key ID 1
4. R1 will sign its own packets sent to R2 with Key ID 1 as R2 is still sending Key ID 1 in the packet header.
5. At the same time R1 will also sign the same packet with key ID 2 and send it to R2,
   effectively sending two duplicate packets authenticated with two different key IDs to R2.
6. This duplicate packet transmission will continue until R2 also starts using key ID 2

## Type 3 authentication Key Chain

RFC 5709 is an extension to the cryptographic authentication options in OSPF. It adds support for the National Institute of Science and Technology Secured Hash Standard (NIST SHS) family of algorithms in the NIST Hash-based Message Authentication Code (HMAC) mode. More specifically, the SHA-1, SHA-224, SHA- 256, SHA-384 and SHA-512 algorithms operating in HMAC modes. On Cisco routers, SHA-224 is NOT available.

To configure HMAC-SHA authentication, a different shared secret construct is used in IOS, the key chain.

Key chains are used in IOS to organize and configure shared-secret keys that can be used for various applications. They are configured with the key chain command. Each key chain contains individual shared secret keys that are given unique key ID values using the key command in keychain configuration mode. After configuring a valid key ID, the router enters “keychain-key” configuration mode. It is in this configuration mode that advanced key parameters such as encryption algorithm, accept and send lifetimes, and the actual shared key string value can be configured for that particular key ID. Using key chains, multiple shared key strings can be configured with unique key IDs and cryptographic parameters. Each key can be automatically set to be accepted or sent only during a specific interval allowing dynamic key rotation for authentication.

The cryptographic algorithm using the cryptographic- algorithm command in “keychain-key” configuration mode. This sets the hashing algorithm that should be used along with the shared secret key specified using the key-string command in “keychain-key” configuration mode.

```
key chain tst
 key 1
  key-string PSWD
  cryptographic-algorithm hmac-sha-512
interface g0/4
 ip ospf authentication key-chain tst
```
## Virtual Link Authorization

The virtual link VL0 is configured as a member of Area 0. This designation is not by accident. All Virtual-links configured on a router are considered to be in Area 0.

Since the virtual-link is a member of Area 0, when authentication is configured for area 0 it also matches for virtual links and  it should be authenticated using MD5 authentication.

```
14:19:18.171: %OSPF-4-NOVALIDKEY: No valid authentication send key is available on interface OSPF_VL0
```

The far endpoint of the virtual-link, has not been configured for authentication. This is the reason the log message is displayed above. This problem can be fixed in multiple ways:

1. Enable authentication under the OSPF router configuration on R3. Enabling authentication on R3, would then also require that authentication be enabled on R4
2. Enable authentication on the virtual link interfaces directly on R3 and R4

```
R3(config)#router ospf 1
R3(config-router)#area 1 virtual-link 0.0.0.2 authentication message-digest R3(config-router)#area 2 virtual-link 0.0.0.4 authentication message-digest

R4(config)#router ospf 1
R4(config-router)#area 2 virtual-link 0.0.0.3 authentication message-digest
```

Because no shared secret key ID has been configured, the virtual-links will use the default key ID of 0, allowing them to come up.

3. Disable authentication on R2’s virtual link

```
area 1 virtual-link 0.0.0.3 authentication null
```
