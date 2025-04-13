export interface Settings {
  site_name: string;
  site_description: string;
  site_keywords: string;
  site_logo: string;
  site_favicon: string;
  allow_register: string;
  default_theme: string;
  images_per_page: string;
  max_file_size: string;
  allowed_file_types: string;
  [key: string]: string;
}

export interface SettingsResponse {
  settings: Settings;
}

export interface SettingUpdatePayload {
  key: string;
  value: string;
}
