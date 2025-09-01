export interface BoxInternet {
  id: string;
  title: string;
  imageUrl: string;
  linkOfSite: string;
  debit: number;
  typeDebit: string;
  technologieDto?: {
    title: string;
  };
  price?: number;
}
