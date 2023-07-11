import { PartialType } from '@nestjs/swagger';
import { CreateDoingDto } from './create-doing.dto';

export class UpdateDoingDto extends PartialType(CreateDoingDto) {}
