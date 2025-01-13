import { PartialType } from '@nestjs/swagger';
import { CreateUpdateCommandDto } from './create-update-command.dto';

export class UpdateUpdateCommandDto extends PartialType(
  CreateUpdateCommandDto,
) {}
