# Common code

## Setup

Remember to init the submodules and pull often!

```sh
# Run this in your dependent projects
git submodule update
```

## Logic

Normal auction interaction logic (Frontend, backend & blockchain)

```mermaid
sequenceDiagram
    participant B as Blockchain
    participant C as Creator
    participant M as Marketplace
    link B: Algorand docs @ https://developer.algorand.org/
    link B: Auction demo @ https://github.com/algorand/auction-demo/blob/407db6a5c0f90a47680c2fca5aaed26dc4592e8d/example.py#L24
    link B: Examples @ https://developer.algorand.org/docs/get-details/dapps/smart-contracts/frontend/apps/
    link C: App repository @ https://github.com/Dekalabs/climate-nft-marketplace-app
    link M: Server repository @ https://github.com/Dekalabs/climate-nft-marketplace-api
    autonumber
    activate C
    note right of C: Creates the NFT
    C->>+B: Mint NFT
    deactivate C
    note left of B: Stores the NFT
    B-->>-C: Asset ID, Tx
    C->>+M: Asset ID
    note right of M: Crear subasta
    note right of M: Enviar fondos
    note right of M: Llamar a 'setup'
    M-->>-C: App ID
    C->B: Asset ID
    note over B, C: Asset transfer to App wallet
```

## Dependencies

- `algosdk`
- `typedi`
- `reflect-metadata`
