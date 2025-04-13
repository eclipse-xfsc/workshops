import { Test, TestingModule } from '@nestjs/testing';
import { MyDrinkController } from './my-drink.controller';

describe('MyDrinkController', () => {
  let controller: MyDrinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyDrinkController],
    }).compile();

    controller = module.get<MyDrinkController>(MyDrinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
