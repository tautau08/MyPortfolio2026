/**
 * Metrics copied from the FL repo:
 * - rounds: models/phase4_personalized/phase4_metrics.json (adopted Phase 5b run)
 * - phases, clients: worktracker.md
 */

export const flRounds = [
  { round: 1, mae: 3.3272, rmse: 5.758 },
  { round: 2, mae: 3.3103, rmse: 5.7395 },
  { round: 3, mae: 3.2808, rmse: 5.6977 },
  { round: 4, mae: 3.2235, rmse: 5.6677 },
  { round: 5, mae: 3.1907, rmse: 5.6164 },
  { round: 6, mae: 3.1822, rmse: 5.5741 },
  { round: 7, mae: 3.1455, rmse: 5.5394 },
  { round: 8, mae: 3.1299, rmse: 5.5301 },
  { round: 9, mae: 3.1146, rmse: 5.4984 },
  { round: 10, mae: 3.0985, rmse: 5.4851 },
];

export interface FlPhase {
  phase: string;
  name: string;
  mae: number;
  note: string;
}

/** Best MAE per phase. Phase 1 is the centralized baseline everything is compared to. */
export const flPhases: FlPhase[] = [
  { phase: "1", name: "Centralized stacking", mae: 3.774, note: "baseline" },
  { phase: "2", name: "FedAvg, DL only", mae: 4.209, note: "+11.5%, drifted after R1" },
  { phase: "3", name: "FedProx, DL only", mae: 4.282, note: "+13.5%, stable over 10 rounds" },
  { phase: "4", name: "Split-Fed + FedProx", mae: 2.157, note: "−42.8%, local-client eval" },
  { phase: "5", name: "+ log1p target", mae: 2.067, note: "−45.2%, local-client eval" },
  { phase: "5b", name: "+ fraction_fit 1.0", mae: 3.099, note: "−17.9%, macro over all 16 clients" },
];

export const flBaselineMae = 3.774;

/** Per-client MAE, Phase 4 → Phase 5 (log1p). */
export const flClients = [
  { name: "appceleratorstudio", n: 584, p4: 2.406, p5: 2.281 },
  { name: "aptanastudio", n: 166, p4: 3.773, p5: 4.37 },
  { name: "bamboo", n: 105, p4: 1.268, p5: 1.053 },
  { name: "clover", n: 77, p4: 3.971, p5: 3.549 },
  { name: "datamanagement", n: 934, p4: 8.389, p5: 6.668 },
  { name: "duracloud", n: 134, p4: 1.247, p5: 0.97 },
  { name: "jirasoftware", n: 71, p4: 2.814, p5: 2.223 },
  { name: "mesos", n: 336, p4: 1.574, p5: 1.5 },
  { name: "moodle", n: 234, p4: 14.799, p5: 11.436 },
  { name: "mule", n: 178, p4: 2.55, p5: 2.567 },
  { name: "mulestudio", n: 147, p4: 4.968, p5: 3.796 },
  { name: "springxd", n: 706, p4: 2.753, p5: 2.104 },
  { name: "talenddataquality", n: 277, p4: 3.414, p5: 3.248 },
  { name: "talendesb", n: 174, p4: 0.916, p5: 0.882 },
  { name: "titanium", n: 451, p4: 3.178, p5: 3.093 },
  { name: "usergrid", n: 97, p4: 0.933, p5: 0.919 },
];
