import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: parseInt(process.env.MYSQL_PORT || '3307'),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB,
            entities: [],
            synchronize: true,
            logging: true,
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}