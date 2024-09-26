import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthenticationGuard } from './common/guards/authentication.guard';
import { AuthorizationGuard } from './common/guards/authorization.guard';
import { AuthService } from './api/auth/auth.service';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/http.exception-filters/http.exception-filters';
import { UserService } from './api/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );
  //swagger configurations
  const config = new DocumentBuilder()
    .setTitle('APIs')
    .setDescription('The account API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'Token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const reflector = app.get(Reflector);
  const authService = app.get(AuthService);
  const userService = app.get(UserService);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new AuthenticationGuard(reflector, authService));
  app.useGlobalGuards(
    new AuthorizationGuard(reflector, authService, userService),
  );
  await app.listen(8080);
}
bootstrap();
