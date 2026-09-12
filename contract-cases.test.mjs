import {test} from "node:test";
import assert from "node:assert/strict";
import {inspectOrder} from "./contract.ts";
import {contractCases} from "./contract-cases.ts";
for(const c of contractCases)test("boundary: "+c.label,()=>{
 const r=inspectOrder(c.input);
 assert.equal(r.syntaxValid,c.expectedSyntax,c.reason);
 assert.equal(r.contractValid,c.expectedContract,c.reason);
 if(c.issue)assert.ok(r.issues.some(i=>i.toLowerCase().includes(c.issue.toLowerCase())),JSON.stringify(r.issues));
 if(c.expectedContract){assert.notEqual(r.normalized,null);assert.deepEqual(Object.keys(JSON.parse(r.normalized)),["customerId","amountCents","currency"]);}
 else assert.equal(r.normalized,null);
});
test("documents duplicate-key behavior rather than claiming duplicate detection",()=>{
 const r=inspectOrder('{"customerId":"demo","amountCents":0,"amountCents":1,"currency":"USD"}');
 assert.equal(r.contractValid,true);
 assert.equal(JSON.parse(r.normalized).amountCents,1);
});
test("documents numerical precision lost before validation",()=>{
 const r=inspectOrder('{"customerId":"demo","amountCents":1.00000000000000001,"currency":"USD"}');
 assert.equal(r.contractValid,true);
 assert.equal(JSON.parse(r.normalized).amountCents,1);
});

