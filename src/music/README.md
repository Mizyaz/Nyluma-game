# Müzik modülü (`src/music`)

Oyunun müziği bu klasördeki bağımsız modülden gelir. Modül Phaser'a ya da
oyunun geri kalanına bağlı değildir: bir `AudioContext` ve bir çıkış düğümü
verilir, o da müziği çalar.

```ts
import { MusicPlayer, loadLibrary } from './music';

const player = new MusicPlayer(audioContext, musicBus);
player.setLibrary(await loadLibrary()); // music/tracks.json
player.play('forest');                  // bölüm değişince yeni cue, geçiş yumuşak (1,6 sn)
player.play('tension', 0.8);            // daha hızlı geçiş (saniye)
```

Oyunda cue'ları `AudioSystem` seçer. Odalar kendi cue'sunu `music(id)` ile
ister. Yüz animasyonlu bir diyalog sahnesi ise odanın müziğinin üstüne
geçici olarak kendi cue'sunu koyar:

```ts
app.audio.setMusicOverride('tension'); // sahne başlarken: ~0,8 sn'lik geçiş
app.audio.setMusicOverride(null);      // sahne bitince: odanın müziğine dönüş
```

Override sürerken `music(id)` çağrıları yalnızca odanın cue'sunu günceller.
Override kalkınca o cue çalmaya başlar. `currentMusic()` her zaman odanın
cue'sunu, `musicState()` ise gerçekten çalanı verir.

## İki kaynak

1. **Kütüphane (kayıtlar):** `music/tracks.json` bir cue için parça
   listeliyorsa o parça çalar. Parçalar ve lisans notları `music/` klasöründe
   durur. Nasıl ekleneceği `music/README.md` dosyasında anlatılıyor. `*` ile
   işaretli parçalar oda cue'larında çalar. Diyalogların `tension` cue'su
   için ise parçanın bu cue'yu adıyla listelemesi gerekir.
2. **Üretilen müzik:** Kütüphanede parça yoksa müzik tarayıcıda anlık
   bestelenir ve çalınır. Oda cue'ları piyanoyla, `tension` ise bir yaylılar
   topluluğuyla çalınır. Kayıt ya da örnek ses (sample) kullanılmaz; kod bu
   proje için yazıldı ve dış bir bağımlılığı yoktur.

Bir kayıt çalamazsa (dosya bozuk, çevrimdışı, izin yok) o cue üretilen
müziğe döner.

## Dosyalar

| Dosya | Ne yapar |
| --- | --- |
| `types.ts` | Cue adları, nota/ölçü, çalgı ve çalış biçimi (artikülasyon), "mood" ve parça tipleri |
| `theory.ts` | Diziler (frig dahil), dizi içi akorlar, perde yardımcıları |
| `moods.ts` | Her cue'nun karakteri: piyano cue'ları için `MOODS` (ton, tempo, akor dizileri, sol el figürü, melodi aralığı, pedal), yaylılar için `STRING_MOODS` (`tension`) |
| `composer.ts` | Piyano bestecisi: sonsuz bir parçayı ölçü ölçü yazar (ses üretmez, saf fonksiyon) |
| `stringComposer.ts` | Yaylılar bestecisi: aynı biçimde, alt ve üst yaylılar için yazar (saf fonksiyon) |
| `cues.ts` | Hangi cue'yu hangi bestecinin yazdığı (`SCORES`) |
| `instrument.ts` | Çalgıların ortak arayüzü `Instrument`: `note(t, midi, vel, off, art?)`, `output`, `struck`, `dispose()` |
| `piano.ts` | Web Audio ile sentez piyano: iki telli akort, çekiç sesi, perdeye göre sönüm, pedal/damper, oda yankısı |
| `strings.ts` | Web Audio ile sentez yaylılar: alt (çello, kontrbas) ve üst (keman, viyola) bölümler |
| `ensemble.ts` | Bir parçanın çalgıları: notanın istediği çalgıyı ilk kullanımda kurar, yaylılara ortak bir oda yankısı verir |
| `room.ts` | Oda yankısı: üretilen dürtü yanıtı (her ses bağlamında bir kez hesaplanır) ve konvolüsyon |
| `library.ts` | Kütüphane listesinin denetimi, yüklenmesi, izinli lisanslar |
| `player.ts` | Cue'ya göre kaynak seçer, üretilen müziği zamanlar, kayıtları akıtır, geçişleri yapar |

## Piyano bestecisi nasıl çalışır

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

## Diyalog müziği: yaylılar (`tension`)

Yüz animasyonlu diyalog sahnelerinde daha yoğun, keman ağırlıklı bir müzik
çalar. Kullanıcı örnek olarak The Boys dizisindeki Homelander müziğini
verdi. Bu müzikten yalnızca karakteri alındı. Bestecisi Christopher
Lennertz, müziği sert ve özensizce çalınan klasik bir keman, yer yer
perdeden kayan sesler ve büyüdükçe uyumsuzlaşan yaylılar olarak anlatıyor.
Melodisi, motifi ya da akor dizisi kullanılmadı: `tension` özgündür ve her
seferinde tohumdan yeniden bestelenir.

**Besteci (`stringComposer.ts`, ayarları `STRING_MOODS.tension`):**

- **Ton ve tempo:** Re frig, yani ikinci derecesi pesleşmiş bir minör. Tonun
  yarım ses üstündeki karanlık bII akoru bu dizinin rengidir. 92 BPM, 4/4.
- **Biçim:** Piyanoyla aynı: A · A′ · B · A″ · ara geçiş. Her turda yeni akor
  dizisi ve yeni çizgiler gelir. Son cümle bII → i ile kapanır; bu kadansta
  bütün sesler birer adım aşağı iner.
- **Alt yaylılar (çello, kontrbas):** Akorun kökünde, oktavlı ve hiç
  durmayan bir ostinato. Figürü bölüme göre değişir: A'da düz sekizlikler,
  A′ ve A″'de 3+3+2 vurgulu sekizlikler, B'de onaltılıklar, ara geçişte
  kalp atışı.
- **Üst yaylılar (keman, viyola):** Dört ölçülük cümlelerde alçaktan başlayıp
  zirveye tırmanan, sonra biraz inen uzun çizgiler. B'de ve A″'de bu çizgiler
  oktavlıdır. Altlarında iç sesler tutulur: A'da uzun notalar, sonra tremolo.
- **Gecikmeler (suspension):** Çizginin uzun son notası bazen ölçü çizgisinin
  ötesine bağlanır. Yeni akorla çatışırsa zayıf zamanda bir adım aşağı
  çözülür. Güçlü zamanlar hep akor sesine düşer.
- **Vuruşlar:** Tüm topluluk marcato vurur: parça başlarken (sahne
  açılırken), köprü girerken, kadansta ve bazı cümle sonlarında.
- **Dinamik:** Her bölüm ilk ölçüsünden son ölçüsüne kabarır. Köprü en güçlü
  yerdir, ara geçiş nefes alır.

**Çalgı (`strings.ts`):**

- Her notayı birkaç "çalgıcı" çalar. İkisinin tınısı yaya benzer: testere
  dişi bir tayf, yayın değdiği noktanın düğümlerindeki harmonikler
  zayıflatılmış. Üçüncüsü daha oyuk bir darbe dalgasıdır. Çalgıcıların
  akordu birbirinden biraz farklıdır, ses güçleri eşit değildir, her birinin
  kendi gecikmeli vibratosu vardır.
- Yay gürültülü ve parlak bir girişle başlar. Artikülasyonlar:
  - `legato`: uzun notalar kabarır ve parlaklaşır;
  - `tremolo`: hızlı yay değişimleri;
  - `marcato`: vurgulu, ısıran bir giriş;
  - `ostinato`: kısa, sürükleyici vuruşlar.

  Bazı yüksek sesli uzun notalar perdeye aşağıdan kayarak girer.
- Gövde rezonansları (hava, tahta, köprünün parlaklığı), topluluk korosu
  (chorus) ve orkestradaki oturma düzenine göre stereo yayılım vardır:
  kemanlar solda, viyolalar ve çellolar sağa doğru. İki bölüm aynı oda
  yankısında çalar.
- Alt ve üst bölümün tınısı, aralığı ve yeri ayrı ayarlanır: `LOW_STRINGS`,
  `HIGH_STRINGS`.
- Ses düzeyi diğer cue'larla aynı aralıktadır. İşlemci yükü piyanonun
  yaklaşık iki katıdır.

## Yeni bir çalgı ya da üretici eklemek

- **Çalgı:** `Instrument` arayüzünü uygulayan bir sınıf yazılır ve
  `ensemble.ts` içindeki `MAKERS` listesine bir `InstrumentId` ile eklenir.
  Notalar o çalgıyı `inst` alanıyla ister, nasıl çalınacağını da `art`
  alanıyla belirtir. Alan boşsa nota piyanoyla çalınır.
- **Besteci:** `BarSource` (`next(): Bar`) uygulayan bir sınıf yazılır ve
  `cues.ts` içindeki `SCORES` listesinde bir cue'ya bağlanır. Başka bir açık
  kaynak üretici ya da model de bu yolla eklenebilir.
- Sesi doğrudan üreten bir kaynak için `player.ts` içine yeni bir oturum türü
  eklenir.

## Testler

- `tests/unit/music.test.ts` şunları denetler:
  - piyano bestecisinin kuralları: ölçü süreleri, dizi dışı nota olmaması,
    güçlü vuruşta akor sesi, melodi aralığı, biçim ve kadans;
  - yaylılar bestecisinin kuralları:
    - ölçü süreleri, dizi dışı nota olmaması, her bölümün kendi aralığında
      kalması;
    - iki bölümün de her ölçüde çalması, alt ostinatonun hiç durmaması ve
      akorun kökünü çalması;
    - güçlü zamanda akor sesi, her gecikmenin bir adım aşağı çözülmesi;
    - artikülasyonlar, biçim ve frig kadansı, bölümlerin kabarması;
    - aynı tohumun aynı sonucu vermesi, turdan tura değişim;
  - cue kaydı: piyano cue'larının eskisi gibi yazılması;
  - kütüphane denetimi (`tension` dahil);
  - `AudioSystem.setMusicOverride`: override, oda değişikliği ve dönüş.
- Tarayıcı testleri, piyanonun menüde ilk dokunuştan sonra çaldığını
  doğrular. Ayrıca birkaç saniyelik müziği `OfflineAudioContext` ile çizip
  seviyesini ölçer: sessiz olmamalı ve kırpılmamalı. Test sondası
  (`renderMusic`, `musicWav`) her cue'yu çizebilir, yaylılar dahil.

## Lisans

Bu modülün kodu bu depo için yazıldı; üçüncü taraf kod ya da ses içermez.
Deponun lisansı (şu an seçilmemiş) bu kod için de geçerlidir. Modülü ayrı
bir açık kaynak paket olarak paylaşmak isterseniz bu klasöre bir lisans
dosyası (ör. MIT) eklemeniz yeterlidir.
