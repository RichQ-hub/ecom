export interface CompanyDetails {
  perm_id: string;
  name: string;
  industry: string;
  headquarter_country: string;
  nb_points_of_observations: number;
  isin_codes: string[];
}

export interface CompanyPDF {
  encoded_pdf: string;
  filename: string;
}

export interface CompanyExcel {
  encoded_excel: string;
  filename: string;
}
