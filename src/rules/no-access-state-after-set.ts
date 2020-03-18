import { Rule } from "eslint";
import { getRuleMetaData } from "../utils";

export = {
  meta: getRuleMetaData(
    "no-get-state-after-set",
    "disallows access of React state variables after they have been set in a useEffect function body",
    "code"
  ),

  create: (context: Rule.RuleContext): Rule.RuleListener =>
    ({} as Rule.RuleListener)
};
