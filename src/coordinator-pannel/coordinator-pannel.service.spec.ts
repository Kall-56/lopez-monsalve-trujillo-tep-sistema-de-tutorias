import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorPannelService } from './coordinator-pannel.service';

describe('CoordinatorPannelService', () => {
  let service: CoordinatorPannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoordinatorPannelService],
    }).compile();

    service = module.get<CoordinatorPannelService>(CoordinatorPannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
