import {writeFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {inspectOrder} from "./contract.ts";
import {contractCases} from "./contract-cases.ts";
const cases=contractCases.map(c=>{const actual=inspectOrder(c.input);return {id:c.id,label:c.label,inputLengthCodeUnits:c.input.length,inputSha256:createHash("sha256").update(c.input).digest("hex"),expected:{syntaxValid:c.expectedSyntax,contractValid:c.expectedContract},actual,matched:actual.syntaxValid===c.expectedSyntax&&actual.contractValid===c.expectedContract,reason:c.reason};});
const report={generatedAtUtc:new Date().toISOString(),nodeVersion:process.version,project:"API Contract Lab",kind:"Deterministic fixture observations; not a performance benchmark",fixtures:cases.length,matched:cases.filter(c=>c.matched).length,accepted:cases.filter(c=>c.actual.contractValid).length,rejected:cases.filter(c=>!c.actual.contractValid).length,cases};
writeFileSync(new URL("./contract-report.json",import.meta.url),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({fixtures:report.fixtures,matched:report.matched,accepted:report.accepted,rejected:report.rejected,nodeVersion:report.nodeVersion,generatedAtUtc:report.generatedAtUtc}));
if(report.matched!==report.fixtures)process.exitCode=1;

