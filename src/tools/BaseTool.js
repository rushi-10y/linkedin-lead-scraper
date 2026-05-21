export class BaseTool {
  constructor({ name, description, parameters }) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
  }

  get definition() {
    return {
      type: "function",
      function: {
        name: this.name,
        description: this.description,
        parameters: this.parameters
      }
    };
  }

  async execute() {
    throw new Error(`${this.name} must implement execute()`);
  }
}
