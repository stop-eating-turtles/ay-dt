const devMode = typeof process !== "undefined"
  && process.env
  && process.env.NODE_ENV === "development";

const rename = require("rename-fn");

const or = /\s*|\s*/;
const and = /\s* \s*/;

const defaults = {
  toADTRepresentation: x => x.split(or).split(and),
  type: (representation) => {
    class ADT extends module.superclass {
      constructor () {
        throw TypeError (`${this.name} is not a constructor`);
      }
    }
    for(let i = 0; i < representation.length; i++) {
      if (devMode) if (representation.length === 0) {
        throw Error("Tags must each have a name");
      }
      const [tagName, ...props] = representation[i];
      class Tag {
        constructor (args) {
          for (let i = 0; i < props.length; i++) {
            const prop = props[i];
            this[prop] = args[i];
          }
        }
      }
      const tag = (...args) => new Tag(args);
      ADT[tagName] = rename(Tag, tagName);
    }
  },
  superclass: Object,
  adt: (raw, name = "ADT") => {
    const representation = module.toADTRepresentation(raw);
    const type = module.type(representation)
    return rename(type, name);
  }
}

const {push, pop, scope: plsWorkOrIWillCry} = require("push-and-pop") (defaults);

module.exports = plsWorkOrIWillCry;

// If this script is being run directly, run tests.
if (!module.parent) require("./test.js");