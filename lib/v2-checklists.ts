export const checklists = {
  property: {
    fileName: "property-document-preparation-checklist.html",
    title: "Property document preparation checklist",
    description: "A general organizer for documents and questions to discuss during a property transaction.",
    groups: [
      { title: "Property and ownership records", items: ["Current title deed or ownership document", "Prior transfer documents available to you", "Property card or relevant land/revenue record", "Latest property tax and utility receipts", "Approved plan, permissions, or completion documents where applicable"] },
      { title: "People and transaction", items: ["Names and contact details of the parties to the transaction", "Draft agreement, sale deed, or other proposed document", "Payment schedule and proof of payments already made", "Any loan, mortgage, charge, or lender correspondence", "Written list of questions or unresolved points"] },
      { title: "Checks to discuss", items: ["Whether the description and boundaries match the records", "Whether all required owners or representatives are identified", "Whether possession, timelines, and conditions are recorded clearly", "Whether any encumbrance or pending issue needs independent checking"] },
    ],
  },
  contract: {
    fileName: "contract-signing-preparation-checklist.html",
    title: "Contract signing preparation checklist",
    description: "A general review organizer. The right checks depend on the contract, parties, and applicable law.",
    groups: [
      { title: "Before review", items: ["Complete draft with every schedule and attachment", "Names and authority details for all signing parties", "Written summary of the intended transaction", "Any referenced policy, technical document, or prior agreement", "List of commercial points already agreed"] },
      { title: "Terms to understand", items: ["Scope, deliverables, and acceptance criteria", "Price, taxes, invoices, and payment dates", "Start date, duration, renewal, and termination", "Responsibilities, approvals, and dependencies", "Confidentiality, data, intellectual property, and permitted use"] },
      { title: "Before signing", items: ["Check that referenced schedules are attached and final", "Resolve blank fields, inconsistent dates, and defined terms", "Confirm signatory authority and execution requirements", "Keep a final signed copy and related payment records", "Record any agreed changes in the final written document"] },
    ],
  },
} as const;

export type ChecklistKind = keyof typeof checklists;