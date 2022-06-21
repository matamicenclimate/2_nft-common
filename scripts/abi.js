#!node

const { readFileSync, writeFileSync } = require('fs')

// A simple ABI typescript wrapper generator.

String.prototype.toClassName = function () {
  return this.replace(/-([a-z])/g, (_, s) => s.toUpperCase())
    .replace(/^./, s => s.toUpperCase())
    .replace(/ /g, '_')
}

String.prototype.indent = function (by = 2) {
  const space = ' '.repeat(by)
  return space + this.replace(/\n/g, `\n${space}`)
}

function generateType({ type }) {
  return type
    .replace(/^\(/, '[')
    .replace(/\)$/, ']')
    .replace(/uint64/g, 'number')
    .replace(/account/g, 'Uint8Array')
    .replace(/pay/g, 'Uint8Array')
}

function generateArg(arg, i) {
  return `arg${i}: ${generateType(arg)}`
}

function generateMethod({ name, desc, args, returns }) {
  return `/**
 * # ${name}
 * ${desc}
 */
async ${name}(${args.map(generateArg).join(', ')}): Promise<${generateType(
    returns
  )}> {
  return await this.smartContract.invoke("${name}", [${args
    .map((_, i) => `arg${i}`)
    .join(', ')}]);
}
`.indent()
}

function createCode({ name, methods }) {
  return `// Smart contract ABI wrapper

/**
 * Smart contract call wrap interface.
 */
export interface SmartContractInvoker {
  invoke(name: string, params: any[]): Promise<any>
}

/**
 * Smart contract ABI wrapper ${name}.
 * Generated ${new Date()}
 */
export class ${name.toClassName()} {
  constructor(private readonly smartContract: SmartContractInvoker) {}
${methods.map(generateMethod).join('\n')}
}
`
}

const [, , fileName] = process.argv

const input = readFileSync(fileName).toString()
const output = createCode(JSON.parse(input))
writeFileSync(fileName.replace(/\.json$/i, '.ts'), output)
