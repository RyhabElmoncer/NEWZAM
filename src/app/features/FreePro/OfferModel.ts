
// free-box.model.ts
export interface FreeBox {
  titre: string;
  sousTitre: string;
  description: string;
  prix: string;
  infoPrix: string;
  infoAdditionnelle: string;
  engagement: string;
  imageUrl: string;
  features: { name: string; }[];
}

