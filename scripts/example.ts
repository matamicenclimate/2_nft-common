// Smart contract ABI wrapper

/**
 * Smart contract call wrap interface.
 */
export interface SmartContractInvoker {
  invoke(name: string, params: any[]): Promise<any>
}

/**
 * Smart contract ABI wrapper super-awesome-contract.
 * Generated Thu Jun 16 2022 11:48:33 GMT+0200 (Hora d’estiu del Centre d’Europa)
 */
export class SuperAwesomeContract {
  constructor(private readonly smartContract: SmartContractInvoker) {}
  /**
   * # add
   * Add 2 integers
   */
  async add(arg0: number, arg1: number): Promise<number> {
    return await this.smartContract.invoke("add", [arg0, arg1]);
  }
  
  /**
   * # sub
   * Subtract 2 integers
   */
  async sub(arg0: number, arg1: number): Promise<number> {
    return await this.smartContract.invoke("sub", [arg0, arg1]);
  }
  
  /**
   * # mul
   * Multiply 2 integers
   */
  async mul(arg0: number, arg1: number): Promise<number> {
    return await this.smartContract.invoke("mul", [arg0, arg1]);
  }
  
  /**
   * # div
   * Divide 2 integers, throw away the remainder
   */
  async div(arg0: number, arg1: number): Promise<number> {
    return await this.smartContract.invoke("div", [arg0, arg1]);
  }
  
  /**
   * # qrem
   * Divide 2 integers, return both the quotient and remainder
   */
  async qrem(arg0: number, arg1: number): Promise<[number,number]> {
    return await this.smartContract.invoke("qrem", [arg0, arg1]);
  }
  
  /**
   * # reverse
   * Reverses a string
   */
  async reverse(arg0: string): Promise<string> {
    return await this.smartContract.invoke("reverse", [arg0]);
  }
  
  /**
   * # txntest
   * just check it
   */
  async txntest(arg0: number, arg1: Uint8Array, arg2: number): Promise<number> {
    return await this.smartContract.invoke("txntest", [arg0, arg1, arg2]);
  }
  
  /**
   * # concat_strings
   * concat some strings
   */
  async concat_strings(arg0: string[]): Promise<string> {
    return await this.smartContract.invoke("concat_strings", [arg0]);
  }
  
  /**
   * # manyargs
   * Try to send 20 arguments
   */
  async manyargs(arg0: number, arg1: number, arg2: number, arg3: number, arg4: number, arg5: number, arg6: number, arg7: number, arg8: number, arg9: number, arg10: number, arg11: number, arg12: number, arg13: number, arg14: number, arg15: number, arg16: number, arg17: number, arg18: number, arg19: number): Promise<number> {
    return await this.smartContract.invoke("manyargs", [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11, arg12, arg13, arg14, arg15, arg16, arg17, arg18, arg19]);
  }
  
  /**
   * # min_bal
   * Get the minimum balance for given account
   */
  async min_bal(arg0: Uint8Array): Promise<number> {
    return await this.smartContract.invoke("min_bal", [arg0]);
  }
  
  /**
   * # tupler
   * 
   */
  async tupler(arg0: [string,number,string]): Promise<number> {
    return await this.smartContract.invoke("tupler", [arg0]);
  }
  
}
