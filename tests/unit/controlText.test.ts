import { describe, expect, it } from 'vitest';
import { forTouch } from '../../src/ui/controlText';
import { CAPTIONS } from '../../src/content/data/dialogue.tr';

describe('touch wording of instructions', () => {
  it('names the on-screen buttons instead of keys', () => {
    expect(forTouch('Tomurcuğun yanında F’ye bas. Deseni dinle, sonra aynı sırayla söyle: ← derin, ↓ orta, → yüksek (A, S, D).')).toBe(
      'Tomurcuğun yanında Şarkı’ya dokun. Deseni dinle, sonra aynı sırayla söyle: derin, orta ve yüksek nota düğmeleriyle.',
    );
    expect(forTouch('Konsolda E’ye bas; ← → ile gözü çevir, iz ile örtüşünce E.')).toBe('Konsolda Eylem’e dokun; yön koluyla gözü çevir, iz ile örtüşünce Eylem.');
    expect(forTouch('A / D ya da ← →: yürü   ·   Boşluk: zıpla   ·   E: incele')).toBe('Yön kolu: yürü   ·   Zıpla düğmesi: zıpla   ·   Eylem: incele');
    expect(forTouch('Nefesini tut (Q): kristal basamaklar belirir.')).toBe('Nefesini tut (Nefes): kristal basamaklar belirir.');
    expect(forTouch('Kapının ötesindeki dairede kök bedene dön (R), sonra düğümlere E ile uzan.')).toBe(
      'Kapının ötesindeki dairede kök bedene dön (Biçim), sonra düğümlere Eylem ile uzan.',
    );
    expect(forTouch('← →: anahtar gözünü çevir  ·  E: hizala  ·  Esc / Boşluk: bırak')).toBe('Yön kolu: anahtar gözünü çevir  ·  Eylem: hizala  ·  Zıpla: bırak');
    expect(forTouch('Bacakların yanında E’yi basılı tut.')).toBe('Bacakların yanında Eylem’i basılı tut.');
  });

  it('leaves texts without key references untouched', () => {
    expect(forTouch('Gorti, içindeki tüm ruhların sahipliğini kaybetmişti.')).toBe('Gorti, içindeki tüm ruhların sahipliğini kaybetmişti.');
    expect(forTouch('Yalanlar sadece doğrular varken oluşur.')).toBe('Yalanlar sadece doğrular varken oluşur.');
  });

  it('leaves no raw key names in any caption', () => {
    const texts = Object.values(CAPTIONS);
    for (const t of texts) {
      const out = forTouch(t);
      expect(out, t).not.toMatch(/’ye bas|Q’yu|Boşluk|← →|\(A, S, D\)|(^|[\s(])[EQRF](?=[\s.:,)]|$)/);
    }
  });
});
