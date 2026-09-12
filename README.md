# API Contract Lab

A small, dependency-free TypeScript demonstration by **Gbolahan Odulate** that separates valid JSON syntax from an application's request contract.

[Try the interactive lab](https://gbolahan-odulate.gbolisco.chatgpt.site/lab) · [Read the design note](https://gbolahan-odulate.gbolisco.chatgpt.site/writing/api-contracts-beyond-valid-json) · [Professional background](https://www.linkedin.com/in/gbolahanodulate/)

## Run the tests

Use Node.js 22.6 or later. No dependency installation is needed.

```sh
node --experimental-strip-types --test contract.test.mjs contract-cases.test.mjs
node --experimental-strip-types report.mjs
```

The 30 tests comprise six regression tests, 22 explicit fixture checks, and two checks documenting duplicate-key and numeric-precision limitations. All passed in the recorded Node.js 24.19.0 run. The report command regenerates contract-report.json with fixture decisions, hashes, and runtime details.

[Read the tested case study and walkthrough](https://gbolahan-odulate.gbolisco.chatgpt.site/lab/case-study).

## Contract

```json
{
  "customerId": "demo-customer",
  "amountCents": 1250,
  "currency": "USD"
}
```

- The top-level value must be an object with no additional fields.
- customerId must be a non-empty string, up to 128 UTF-16 code units.
- amountCents must be a positive JavaScript safe integer, supplied as a JSON number.
- currency must be USD, GBP, or EUR.
- Input is limited to 131,072 UTF-16 code units, not bytes or user-perceived characters.

Import inspectOrder from contract.ts and pass it a JSON string. The result separates syntaxValid from contractValid and returns specific issues. It does not silently coerce values.

## Scope and provenance

Created in September 2026 with AI-assisted implementation as a professional demonstration. It is not a client case study, evidence of previous client work, a complete JSON Schema implementation, or a production payment service. The browser version processes input locally.

The parser uses JSON.parse and does not independently detect duplicate keys or recover numerical precision lost during parsing. Validation does not establish customer identity, authorization, product pricing, or business legitimacy. Production systems need separate controls appropriate to those concerns.

The word normalized in the result names the accepted object; values are not trimmed, rewritten, or otherwise normalized.

## About

Gbolahan Odulate is an independent software developer and technical consultant based in The Colony, Texas.

[Website](https://gbolahan-odulate.gbolisco.chatgpt.site) · [LinkedIn](https://www.linkedin.com/in/gbolahanodulate/)
