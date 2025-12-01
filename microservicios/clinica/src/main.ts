import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS para permitir requests del Gateway
    app.enableCors({
        origin: ['http://localhost:8081', 'http://localhost:8000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Habilitar validación global
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Configuración de Swagger
    const config = new DocumentBuilder()
        .setTitle('GenoSentinel - Microservicio Clínica')
        .setDescription('API para gestión de información clínica de pacientes oncológicos')
        .setVersion('1.0')
        .addTag('Pacientes', 'Endpoints para gestión de pacientes')
        .addTag('Tipos de Tumor', 'Endpoints para gestión de catálogo de tumores')
        .addTag('Historias Clínicas', 'Endpoints para gestión de historias clínicas')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`\n🚀 Microservicio Clínica iniciado en http://localhost:${port}`);
    console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs\n`);
}
bootstrap();