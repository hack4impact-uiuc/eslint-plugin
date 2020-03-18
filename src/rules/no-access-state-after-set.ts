import { Rule } from "eslint";
import { Node } from "estree";
import { getRuleMetaData } from "../utils";

export default {
  meta: getRuleMetaData(
    "no-get-state-after-set",
    "disallows access of React state variables after they have been set in a useEffect function body",
    "code"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({
      /*
      Class component - (class) -> function -> usage of setState - any access to modified values in function body afterwards forbidden
      Function component - (function -> useState) -> collect all state variables -> look in all useEffects and declarations - then same as above but look at state variables
      */
      "*": (node: Node): void => {
        if (node.type === undefined) {
          context.report({ node, message: "temporary message" });
        }
      }
    } as Rule.RuleListener)
};
