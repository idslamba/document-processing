import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QualityServiceService {

  selectedDocument: any;

  selectedProjectId: any;
  selectedWorkflowId: any;

  constructor(private httpService: HttpService) { }

  getDocumentsList() {
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/document_list";
    return this.httpService.get(serviceUrl, {})
  }


  getAllDocumentDetails(documentId: string) {
    // const returnData = [
    //   {
    //     "id": "228523ba-73a9-461c-9201-c836293206c9",
    //     "name": "Test 1 1.pdf",
    //     "status": "Complete",
    //     "message": "Analysed Successfully",
    //     "active": true,
    //     "result": {
    //       "basis_of_written_lines": {
    //         "confidence": 0.95,
    //         "page": 42,
    //         "value": "Percentage of Whole"
    //       },
    //       "choice_of_law": {
    //         "jurisdiction_location_country": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "jurisdiction_location_description": {
    //           "confidence": 0.95,
    //           "page": 3,
    //           "value": "As stated in the Wording"
    //         },
    //         "jurisdiction_location_subEntity": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "purpose_of_extracted_data": {
    //           "confidence": 0.95,
    //           "page": 3,
    //           "value": "Identify the court that will have jurisdiction in the event of a dispute between insured and insurers. Include the applicable law that governs the contract."
    //         }
    //       },
    //       "conditions": {
    //         "confidence": 0.95,
    //         "page": 2,
    //         "value": "Aon A+ Protect Wording (v24), as attached. Ant Group IPO Exclusion, as attached Territory Restriction Endorsement, as attached Sanctions Limitation Clause - LMA3100A"
    //       },
    //       "interest": {
    //         "confidence": 0.95,
    //         "page": 1,
    //         "value": "'Side A' Special Protection Directors and Officers Liability Insurance"
    //       },
    //       "limit_of_liability": {
    //         "coverage_amount": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "20000000"
    //         },
    //         "coverage_amount_currency": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "USD"
    //         },
    //         "coverage_basis": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "in the Aggregate"
    //         },
    //         "coverage_basis_description": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "USD 20,000,000 in the Aggregate"
    //         },
    //         "coverage_expense_type": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "coverage_number_of_units": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "coverage_type": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "Loss Limit"
    //         },
    //         "limit_link": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "part_of": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         }
    //       },
    //       "period": {
    //         "period_basis": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "Losses occurring during"
    //         },
    //         "start_date": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "01.12.2024"
    //         },
    //         "start_time": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "00:00:00"
    //         }
    //       },
    //       "premium": {
    //         "adjustable_indicator": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "amount": {
    //           "confidence": 0.95,
    //           "page": 3,
    //           "value": "425000.00"
    //         },
    //         "currency": {
    //           "confidence": 0.95,
    //           "page": 3,
    //           "value": "USD"
    //         },
    //         "instalments_count": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "premium_adjustment_rate": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "premium_adjustment_rate_basis": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "premium_basis_calculation": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "premium_description": {
    //           "confidence": 0.95,
    //           "page": 3,
    //           "value": "Gross Premium: USD 425,000.00 (100%) Annual"
    //         },
    //         "premium_type": {
    //           "confidence": 0.95,
    //           "page": 3,
    //           "value": "Premium"
    //         },
    //         "rate_percentage": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         }
    //       },
    //       "situation": {
    //         "country": {
    //           "confidence": 0.95,
    //           "page": 2,
    //           "value": "Worldwide"
    //         },
    //         "excluded_country": {
    //           "confidence": 0.95,
    //           "page": 28,
    //           "value": "BY, RU"
    //         },
    //         "excluded_location_description": {
    //           "confidence": 0.95,
    //           "page": 28,
    //           "value": "Republic of Belarus and Russian Federation"
    //         },
    //         "location_description": {
    //           "confidence": null,
    //           "page": null,
    //           "value": null
    //         },
    //         "supraentity": {
    //           "confidence": 0.95,
    //           "page": 2,
    //           "value": "Worldwide"
    //         }
    //       },
    //       "type": {
    //         "business_channel": {
    //           "confidence": 0.95,
    //           "page": 1,
    //           "value": "Open Market"
    //         },
    //         "contract_type": {
    //           "umr": {
    //             "umr": {
    //               "confidence": 0.98,
    //               "page": 1,
    //               "value": "B1526FSGDO2402924"
    //             }
    //           }
    //         }
    //       },
    //       "umr": {
    //         "type": {
    //           "business_channel": {
    //             "confidence": 0.95,
    //             "page": 1,
    //             "value": "Open Market"
    //           },
    //           "contract_type": {
    //             "umr": {
    //               "umr": {
    //                 "confidence": 0.98,
    //                 "page": 1,
    //                 "value": "B1526FSGDO2402924"
    //               }
    //             }
    //           }
    //         },
    //       }
    //     },
    //     "createdDate": "2025-01-16T17:41:36Z",
    //     "lastUpdatedDate": "2025-01-16T17:42:22Z",
    //     "_rid": "EBgwAJw3VKk8AAAAAAAAAA==",
    //     "_self": "dbs/EBgwAA==/colls/EBgwAJw3VKk=/docs/EBgwAJw3VKk8AAAAAAAAAA==/",
    //     "_etag": "\"0c00bc0d-0000-2200-0000-678944fe0000\"",
    //     "_attachments": "attachments/",
    //     "_ts": 1737049342
    //   }
    // ]
    // return of(returnData);
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/document_results";
    return this.httpService.post(serviceUrl, { documentIds: [documentId] }, undefined)
  }

  docDetails(documentId: any) {
    const serviceURL = "https://solventek-document-ai.azurewebsites.net/api/document_results";
    return this.httpService.post(serviceURL, { documentIds: [documentId] }, undefined)
  }

  updateDocumentFields(documentId: string, updatedObject: {}) {
    const serviceURL = `https://solventek-document-ai.azurewebsites.net/api/results/${documentId}`;
    return this.httpService.post(serviceURL, { "result": updatedObject }, undefined)
  }
}
