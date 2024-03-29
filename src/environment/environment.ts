import * as EnvironmentJsonFile from './env.json';

export interface IEnvironment {
  app_port: number;
  db_host: string;
  db_port: number;
  db_user: string;
  db_password: string;
  db_name: string;
  db_log_enabled: boolean;
  ApiScheme: 'http' | 'https';
  EnvName: 'development' | 'val' | 'production';
  smtp_host: string;
  smtp_user: string;
  smtp_password: string;
  app_origin_url: string;
  access_token_secret: string;
  refresh_token_secret: string;
}

const EnvironmentData: IEnvironment = {
  app_port: Number(EnvironmentJsonFile.app_port),
  db_host: EnvironmentJsonFile.db_host,
  db_port: EnvironmentJsonFile.db_port,
  db_user: EnvironmentJsonFile.db_user,
  db_password: EnvironmentJsonFile.db_password,
  db_name: EnvironmentJsonFile.db_name,
  db_log_enabled: EnvironmentJsonFile.db_log_enabled,
  ApiScheme: EnvironmentJsonFile.ApiScheme as 'http' | 'https',
  EnvName: EnvironmentJsonFile.EnvName as 'development' | 'val' | 'production',
  smtp_host: EnvironmentJsonFile.smtp_host,
  smtp_user: EnvironmentJsonFile.smtp_user,
  smtp_password: EnvironmentJsonFile.smtp_password,
  app_origin_url: EnvironmentJsonFile.app_origin_url,
  access_token_secret: EnvironmentJsonFile.access_token_secret,
  refresh_token_secret: EnvironmentJsonFile.refresh_token_secret,
};

export const Environment = EnvironmentData;
