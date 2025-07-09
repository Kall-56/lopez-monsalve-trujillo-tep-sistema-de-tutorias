import { Test, TestingModule } from '@nestjs/testing';
import { TutoringRequestsController } from './tutoring-requests.controller';
import { TutoringRequestsService } from './tutoring-requests.service';

describe('TutoringRequestsController', () => {
  let controller: TutoringRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TutoringRequestsController],
      providers: [TutoringRequestsService],
    }).compile();

    controller = module.get<TutoringRequestsController>(TutoringRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
