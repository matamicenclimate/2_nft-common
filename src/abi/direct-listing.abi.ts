import algosdk from 'algosdk'

function getContract() {
  return new algosdk.ABIContract({
    name: 'climate_nft_direct_listing',
    methods: [
      {
        name: 'on_setup',
        desc: 'TODO:',
        args: [],
        returns: { type: 'void' },
      },
      {
        name: 'on_bid',
        desc: 'TODO:',
        args: [],
        returns: { type: 'void' },
      },
    ],
  })
}

function getMethodByName(name: string) {
  const contract = getContract()
  const m = contract.methods.find((mt: { name: string }) => {
    return mt.name == name
  })
  if (m === undefined) throw Error('Method undefined: ' + name)
  return m
}

export default { getMethodByName }
