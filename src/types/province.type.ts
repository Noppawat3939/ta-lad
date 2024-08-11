export interface IProvince {
  id: number;
  name_th: string;
  name_en: string;
}

export interface IDistrict {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface ISubDistrict {
  id: number;
  zip_code: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}
