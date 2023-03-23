import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('getAllGames', () => {
    it('should return 3 games', () => {
      expect(service.getAllGames().length).toEqual(3);
    });
  });
});
