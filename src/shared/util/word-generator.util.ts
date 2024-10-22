import { Injectable } from '@nestjs/common';

@Injectable()
export class WordGenerator {
  generator(length: number): string {
    let word = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * characters.length - 1);
      word += characters[index];
    }

    return word;
  }
}
