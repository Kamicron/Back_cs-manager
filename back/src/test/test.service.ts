import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  // Méthode pour afficher un message simple
  getMessage(): string {
    return 'Hello, bienvenue dans le module Test !';
  }

  // Méthode pour récupérer des données mockées
  getMockData(): any[] {
    return [
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 30 },
      { id: 3, name: 'Charlie', age: 35 },
    ];
  }

  // Méthode pour ajouter un utilisateur mocké
  addMockData(user: { name: string; age: number }): any {
    // Dans un vrai projet, tu stockerais ces données dans une base de données
    return { id: Math.floor(Math.random() * 1000), ...user };
  }
}
