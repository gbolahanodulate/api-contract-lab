import {example} from "./contract.ts";
export type ContractCase={id:string;label:string;input:string;expectedSyntax:boolean;expectedContract:boolean;issue?:string;reason:string};
const payload=(changes:Record<string,unknown>)=>JSON.stringify({...example,...changes});
export const contractCases:ContractCase[]=[
{id:"valid",label:"Documented request",input:payload({}),expectedSyntax:true,expectedContract:true,reason:"All three fields satisfy the published rules."},
{id:"string-amount",label:"Number supplied as a string",input:payload({amountCents:"1250"}),expectedSyntax:true,expectedContract:false,issue:"amountCents",reason:"The contract does not convert strings to numbers."},
{id:"fraction",label:"Fractional cents",input:payload({amountCents:1.5}),expectedSyntax:true,expectedContract:false,issue:"amountCents",reason:"The parsed amount must be an integer."},
{id:"zero",label:"Zero amount",input:payload({amountCents:0}),expectedSyntax:true,expectedContract:false,issue:"amountCents",reason:"This example requires a positive amount."},
{id:"negative",label:"Negative amount",input:payload({amountCents:-1}),expectedSyntax:true,expectedContract:false,issue:"amountCents",reason:"Refund semantics are outside this order contract."},
{id:"max-safe",label:"Maximum safe integer",input:payload({amountCents:Number.MAX_SAFE_INTEGER}),expectedSyntax:true,expectedContract:true,reason:"This is the allowed numeric boundary, not a realistic pricing limit."},
{id:"unsafe",label:"Integer above safe range",input:payload({amountCents:9007199254740992}),expectedSyntax:true,expectedContract:false,issue:"amountCents",reason:"The parsed value lies outside JavaScript's safe integer range."},
{id:"blank-id",label:"Whitespace-only customer ID",input:payload({customerId:" \t\n"}),expectedSyntax:true,expectedContract:false,issue:"customerId",reason:"A whitespace-only identifier is empty for this contract."},
{id:"missing-id",label:"Missing customer ID",input:'{"amountCents":1250,"currency":"USD"}',expectedSyntax:true,expectedContract:false,issue:"customerId",reason:"All three fields are required."},
{id:"id-limit",label:"Customer ID at 128 code units",input:payload({customerId:"a".repeat(128)}),expectedSyntax:true,expectedContract:true,reason:"The implementation measures JavaScript UTF-16 string length."},
{id:"id-too-long",label:"Customer ID at 129 code units",input:payload({customerId:"a".repeat(129)}),expectedSyntax:true,expectedContract:false,issue:"customerId",reason:"One unit beyond the documented limit is rejected."},
{id:"extra",label:"Unexpected admin property",input:payload({admin:true}),expectedSyntax:true,expectedContract:false,issue:"Unexpected field",reason:"Only the three documented own properties are accepted."},
{id:"currency",label:"Unsupported currency",input:payload({currency:"CAD"}),expectedSyntax:true,expectedContract:false,issue:"currency",reason:"The supported set is deliberately narrow."},
{id:"lowercase",label:"Lowercase currency",input:payload({currency:"usd"}),expectedSyntax:true,expectedContract:false,issue:"currency",reason:"Currency codes are case-sensitive here."},
{id:"array",label:"Top-level array",input:"[]",expectedSyntax:true,expectedContract:false,issue:"top-level",reason:"Valid JSON does not imply an order-shaped object."},
{id:"syntax",label:"Trailing comma",input:'{"customerId":"demo","amountCents":1,"currency":"USD",}',expectedSyntax:false,expectedContract:false,issue:"syntax",reason:"Parsing fails before contract checks can run."},
{id:"gbp",label:"Supported GBP request",input:payload({currency:"GBP"}),expectedSyntax:true,expectedContract:true,reason:"GBP is in the documented supported set."},
{id:"eur",label:"Supported EUR request",input:payload({currency:"EUR"}),expectedSyntax:true,expectedContract:true,reason:"EUR is in the documented supported set."},
{id:"proto",label:"Unexpected __proto__ property",input:'{"customerId":"demo","amountCents":1,"currency":"USD","__proto__":{"admin":true}}',expectedSyntax:true,expectedContract:false,issue:"Unexpected field",reason:"Parsed input is inspected and reconstructed, not merged into another object."},
{id:"null",label:"Top-level null",input:"null",expectedSyntax:true,expectedContract:false,issue:"top-level",reason:"Null parses successfully but is not an order object."},
{id:"input-limit",label:"Input at 131,072 code units",input:payload({}).padEnd(131072," "),expectedSyntax:true,expectedContract:true,reason:"JSON permits trailing whitespace; the length boundary is inclusive."},
{id:"oversize",label:"Input at 131,073 code units",input:payload({}).padEnd(131073," "),expectedSyntax:false,expectedContract:false,issue:"limit",reason:"The resource gate stops validation before parsing; syntaxValid false here does not prove malformed JSON."}
];

