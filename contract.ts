export type Inspection={syntaxValid:boolean;contractValid:boolean;issues:string[];normalized:string|null};
export const example={customerId:"demo-customer",amountCents:1250,currency:"USD"};
export function inspectOrder(text:string):Inspection{
 const fail=(syntaxValid:boolean,issues:string[]):Inspection=>({syntaxValid,contractValid:false,issues,normalized:null});
 if(text.length>131072)return fail(false,["Input exceeds this demo's 131,072-character limit."]);
 let value:unknown;
 try{value=JSON.parse(text);}catch{return fail(false,["Invalid JSON syntax. Check commas, quotes, and brackets."]);}
 if(value===null||Array.isArray(value)||typeof value!=="object")return fail(true,["The top-level value must be an object."]);
 const v=value as Record<string,unknown>; const issues:string[]=[];
 if(typeof v.customerId!=="string"||v.customerId.trim().length===0||v.customerId.length>128)issues.push("customerId must be a non-empty string of at most 128 characters.");
 if(typeof v.amountCents!=="number"||!Number.isSafeInteger(v.amountCents)||v.amountCents<=0)issues.push("amountCents must be a positive safe integer, supplied as a JSON number.");
 if(typeof v.currency!=="string"||!["USD","GBP","EUR"].includes(v.currency))issues.push("currency must be USD, GBP, or EUR.");
 for(const key of Object.keys(v))if(!["customerId","amountCents","currency"].includes(key))issues.push("Unexpected field: "+key);
 return {syntaxValid:true,contractValid:issues.length===0,issues,normalized:issues.length?null:JSON.stringify({customerId:v.customerId,amountCents:v.amountCents,currency:v.currency},null,2)};
}
