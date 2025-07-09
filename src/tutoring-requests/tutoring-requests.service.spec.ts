import { Test, TestingModule } from '@nestjs/testing';
import { TutoringRequestsService } from './tutoring-requests.service';

describe('TutoringRequestsService', () => {
  let service: TutoringRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutoringRequestsService],
    }).compile();

    service = module.get<TutoringRequestsService>(TutoringRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
