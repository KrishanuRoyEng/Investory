import { IsString, IsNotEmpty } from 'class-validator';

export class SubmitDoubtDto {
  @IsString()
  @IsNotEmpty()
  question: string;
}
