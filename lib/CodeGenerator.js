export default class CodeGenerator {
  constructor(code){
    this.code = code;
  }

  async generate(lenght) {
    if (lenght < 1) {
      throw new Error("Length must be a positive number.")
    }
    return Math.random().toString(36).substring(2, 2 + lenght);
  }
}