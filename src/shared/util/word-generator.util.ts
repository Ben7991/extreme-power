import { Injectable } from '@nestjs/common';

@Injectable()
export class WordGenerator {
  generator(length: number): string {
    let word = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const upperBound = characters.length - 1;

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * upperBound);
      word += characters[index];
    }

    return word;
  }
}
