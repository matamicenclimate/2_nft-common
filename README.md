# Common code

## Setup

Remember to init the submodules and pull often!

```sh
# Run this in your dependent projects
git submodule update
```

## Smart contract Logic

Normal auction interaction logic (Frontend, backend & blockchain)

```mermaid
sequenceDiagram
    participant I as IPFS
    participant B as Blockchain
    participant C as Creator
    participant M as Marketplace
    link I: IPFS docs @ https://ipfs.io/
    link B: Algorand docs @ https://developer.algorand.org/
    link B: Auction demo @ https://github.com/algorand/auction-demo/blob/407db6a5c0f90a47680c2fca5aaed26dc4592e8d/example.py#L24
    link B: Examples @ https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/apps/
    link C: App repository @ https://github.com/Dekalabs/climate-nft-marketplace-app
    link M: Server repository @ https://github.com/Dekalabs/climate-nft-marketplace-api
    autonumber
    
    activate C
    note right of C: Creates the NFT
    C->>+I: Upload to IPFS
    deactivate C

    activate I
    note left of I: Stores the <br/>  NFT in IPFS
    I-->>-C: NFT url in IPFS

    activate C
    note right of C: Add metadata <br/> to the NFT
    C->>+B: Mint NFT
    deactivate C

    activate B
    note left of B: Load the NFT <br/> into the blockchain
    B-->>-C: Asset ID, Tx
    
    C->>+M: Asset ID
    activate M
    note right of M: List NFT
    note right of M: Setup SC
    M->>+B: SC configuration
    deactivate M

    activate B
    note left of B: Creates Smart Contract
    B->>M: App ID
    deactivate B

    activate M
    note right of M: NFT is listed <br/> in the marketplace
    deactivate M
```
```

## Dependencies

- `algosdk`
- `typedi`
- `reflect-metadata`
- `axios`
