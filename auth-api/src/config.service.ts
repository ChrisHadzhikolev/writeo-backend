import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config('../../.env');

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]): any {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      name: 'default',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: (this.getValue('AUTH_DB_TYPE') as any) || 'mysql',
      port: parseInt(this.getValue('AUTH_DB_PORT')) || 3306,
      host: this.getValue('AUTH_DB_HOST') || 'localhost',
      username: this.getValue('AUTH_DB_USERNAME') || 'root',
      password: this.getValue('AUTH_DB_PASSWORD') || '',
      database: this.getValue('AUTH_DB_NAME') || 'auser',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      cli: {
        entitiesDir: 'src/database/entities',
      },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'AUTH_DB_TYPE',
  'AUTH_DB_HOST',
  'AUTH_DB_PORT',
  'AUTH_DB_USERNAME',
  'AUTH_DB_NAME',
]);

export { configService };
