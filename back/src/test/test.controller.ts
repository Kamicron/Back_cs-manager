import { Controller, Get, Post, Body } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
    constructor(private readonly testService: TestService) { }

    // Endpoint GET pour afficher un message simple
    @Get('message')
    getMessage(): string {
        return this.testService.getMessage();
    }

    // Endpoint GET pour récupérer des données mockées
    @Get('mock-data')
    getMockData(): any[] {
        return this.testService.getMockData();
    }

    // Endpoint POST pour ajouter des données mockées
    @Post('add-mock-data')
    addMockData(@Body() user: { name: string; age: number }): any {
      return this.testService.addMockData(user);
    }
}
