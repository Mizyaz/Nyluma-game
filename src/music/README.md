# Müzik modülü (`src/music`)

Oyunun müziği bu klasördeki bağımsız modülden gelir. Modül Phaser'a ya da
oyunun geri kalanına bağlı değildir: bir `AudioContext` ve bir çıkış düğümü
verilir, o da müziği çalar.

```ts
import { MusicPlayer, loadLibrary } from './music';

const player = new MusicPlayer(audioContext, musicBus);
player.setLibrary(await loadLibrary()); // music/tracks.json
player.play('forest');                  // bölüm değişince yeni cue, geçiş yumuşak
```

## İki kaynak

1. **Kütüphane (kayıtlar):** `music/tracks.json` bir cue için parça
   listeliyorsa o parça çalar. Parçalar ve lisans notları `music/` klasöründe
   durur. Nasıl ekleneceği `music/README.md` dosyasında anlatılıyor.
2. **Üretilen piyano:** Kütüphanede parça yoksa müzik tarayıcıda anlık
   bestelenir ve çalınır. Kayıt ya da örnek ses (sample) kullanılmaz; kod bu
   proje için yazıldı ve dış bir bağımlılığı yoktur.

Bir kayıt çalamazsa (dosya bozuk, çevrimdışı, izin yok) o cue piyanoya döner.

## Dosyalar

| Dosya | Ne yapar |
| --- | --- |
| `types.ts` | Cue adları, nota/ölçü, "mood" ve parça tipleri |
| `theory.ts` | Diziler, dizi içi akorlar, perde yardımcıları |
| `moods.ts` | Her cue'nun karakteri: ton, tempo, ölçü, akor dizileri, sol el figürü, melodi aralığı, yoğunluk, pedal |
| `composer.ts` | Besteci: sonsuz bir parçayı ölçü ölçü yazar (ses üretmez, saf fonksiyon) |
| `piano.ts` | Web Audio ile sentez piyano: iki telli akort, çekiç sesi, perdeye göre sönüm, pedal/damper, oda yankısı |
| `library.ts` | Kütüphane listesinin denetimi, yüklenmesi, izinli lisanslar |
| `player.ts` | Cue'ya göre kaynak seçer, piyanoyu zamanlar, kayıtları akıtır, geçişleri yapar |

## Besteci nasıl çalışır

- **Biçim:** A · A′ · B · A″ · ara geçiş (8 + 8 + 8 + 8 + 2 ölçü), sonra yeni
  motiflerle baştan.
- **Armoni:** Her bölümde dört akorluk bir dizi, ölçü başına bir akor. Son
  cümle bir kadansla kapanır (V→I ya da modal VII→i).
- **Sol el:** Akor üzerinde arpej, kırık akor, blok akor, nabız ya da
  ostinato. Kök sesler bir ölçüden diğerine en yakın konumda kalır. Bazen
  dizinin dokuzlusu eklenir.
- **Sağ el:** İki ölçülük bir motif. Motif önce söylenir, sonra yeni akorlara
  taşınır, değiştirilir ve kapanır. Güçlü vuruşlar akor seslerine düşer,
  aradaki sesler adım adım ilerler. Ara sıra atlama yapılır ve ardından ters
  yöne dönülür.
- **İfade:**
  - cümle boyunca yükselip alçalan gürlük,
  - küçük zamanlama esnemeleri (rubato),
  - bölüm sonlarında hafif yavaşlama,
  - pedalın ölçü ya da yarım ölçü boyunca tutulması.
- **Tohum:** Aynı cue ve tohum her zaman aynı notaları verir. Oyun her
  ziyarette tohumu değiştirir, müzik de her seferinde biraz farklı akar.

Bir bölümün havasını değiştirmek için `moods.ts` içindeki değerleri
değiştirmek yeterlidir, örneğin `bpm`, `tonic`, `scale`, `progressions`,
`lh`, `melody`, `rest`, `motion` ve `vel`.

## Başka bir üretici eklemek

`player.ts` içindeki `pianoSession` her ölçüde bestecinin `next()` çağrısından
nota alır ve piyanoya çaldırır. Başka bir açık kaynak üretici ya da model
eklemek için şu iki yoldan biri yeterlidir:

- aynı `Bar` / `NoteEvent` biçiminde nota döndüren bir sınıf yazıp
  `Composer` yerine vermek;
- sesi doğrudan üreten yeni bir oturum türü eklemek.

## Testler

- `tests/unit/music.test.ts` şunları denetler:
  - bestecinin kurallarına uyulması: ölçü süreleri, dizi dışı nota olmaması,
    güçlü vuruşta akor sesi, melodi aralığı, biçim ve kadans;
  - aynı tohumun aynı sonucu vermesi;
  - kütüphane denetimi.
- Tarayıcı testleri, piyanonun menüde ilk dokunuştan sonra çaldığını
  doğrular. Ayrıca birkaç saniyelik müziği `OfflineAudioContext` ile çizip
  seviyesini ölçer: sessiz olmamalı ve kırpılmamalı.

## Lisans

Bu modülün kodu bu depo için yazıldı; üçüncü taraf kod ya da ses içermez.
Deponun lisansı (şu an seçilmemiş) bu kod için de geçerlidir. Modülü ayrı
bir açık kaynak paket olarak paylaşmak isterseniz bu klasöre bir lisans
dosyası (ör. MIT) eklemeniz yeterlidir.
