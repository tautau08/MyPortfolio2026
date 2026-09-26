import type { ComponentType } from "react";
import type { DemoId } from "@/data/projects";
import { CrypTauContractDemo, CrypTauSaleDemo } from "./cryptau";
import { FlPhasesDemo, FlRoundsDemo, FlSplitDemo, FlTerminalDemo } from "./fl";
import { HelpdeskEscalationDemo, HelpdeskJwtDemo, HelpdeskStatusDemo } from "./helpdesk";
import { InstructFlowClarifyDemo, InstructFlowE2EDemo, InstructFlowSchemaDemo } from "./instructflow";
import { KhatiFilterDemo, KhatiGatewayDemo, KhatiOrderDemo } from "./khati";
import { RfixMenuDemo, RfixPermissionDemo } from "./rfix";
import { DeliveryAnbiRecommendDemo, DeliveryAnbiVoiceDemo, NikeSectionsDemo } from "./small";

export const demos: Record<DemoId, ComponentType> = {
  "khati-gateway": KhatiGatewayDemo,
  "khati-order": KhatiOrderDemo,
  "khati-filter": KhatiFilterDemo,
  "fl-rounds": FlRoundsDemo,
  "fl-phases": FlPhasesDemo,
  "fl-split": FlSplitDemo,
  "fl-terminal": FlTerminalDemo,
  "helpdesk-escalation": HelpdeskEscalationDemo,
  "helpdesk-jwt": HelpdeskJwtDemo,
  "helpdesk-status": HelpdeskStatusDemo,
  "instructflow-clarify": InstructFlowClarifyDemo,
  "instructflow-schema": InstructFlowSchemaDemo,
  "instructflow-e2e": InstructFlowE2EDemo,
  "cryptau-sale": CrypTauSaleDemo,
  "cryptau-contract": CrypTauContractDemo,
  "rfix-permission": RfixPermissionDemo,
  "rfix-menu": RfixMenuDemo,
  "nike-sections": NikeSectionsDemo,
  "deliveryanbi-voice": DeliveryAnbiVoiceDemo,
  "deliveryanbi-recommend": DeliveryAnbiRecommendDemo,
};
