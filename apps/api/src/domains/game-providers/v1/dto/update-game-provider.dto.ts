import { PartialType } from '@nestjs/swagger';
import { CreateGameProviderDto } from './create-game-provider.dto';

export class UpdateGameProviderDto extends PartialType(CreateGameProviderDto) {}
