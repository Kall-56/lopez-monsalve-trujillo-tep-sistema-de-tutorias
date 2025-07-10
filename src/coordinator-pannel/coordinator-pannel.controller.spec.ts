import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorPannelController } from './coordinator-pannel.controller';
import { CoordinatorPannelService } from './coordinator-pannel.service';

describe('CoordinatorPannelController', () => {
  let controller: CoordinatorPannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoordinatorPannelController],
      providers: [CoordinatorPannelService],
    }).compile();

    controller = module.get<CoordinatorPannelController>(CoordinatorPannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
