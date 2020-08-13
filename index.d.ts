import { NamedTupleMember, Node } from "typescript";
declare module "typescript" {
  type NamedTupleMember = Node;
}
