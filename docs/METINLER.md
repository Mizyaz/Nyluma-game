# Oyunun metinleri

Hikâyenin bütün yazıları `src/content/text/` klasöründeki JSON dosyalarındadır.
Kod yazmadan değiştirilir; geliştirme sunucusu (`npm run dev`) açıksa oyun
kaydettiğiniz anda yenilenir.

## Hangi dosyada ne var

| Dosya | Ne var |
|---|---|
| `names.json` | Kimin adı ne: konuşma balonlarında ve kartlarda görünen adlar |
| `captions.json` | Anlatımlar: ekranın altında beliren tek satırlık yazılar |
| `dialogue.json` | Konuşmalar ve sahnelerdeki anlatıcı satırları |
| `inspect.json` | 14. Oda'da incelenen şeylerin yazıları (yerdeki göz: `eyeleaf`) |
| `memories.json` | Bulunan anılar (`m1` … `m8`) ve İç Koğuş'ta geriye akan anılar (`reversed`) |
| `paintings.json` | Tabloların adları ve altlarındaki yazılar |
| `documents.json` | Boş Masa'daki kâğıtlar: görüntüler, Rusça sözleşme, maddeler, son sayfa |
| `sky.json` | Güneş ile Ay: her bölümde ve odada nasıl göründükleri, basılı tutunca ne dedikleri |

Başka yerlerde olanlar:

- Bölümlerin adları: `src/content/chapters/chapters.json` (`"title"`).
- JSON ile yapılan odaların (b01 …) konuşmaları kendi dosyalarında:
  `src/content/chapters/rooms/*.json` (bkz. `src/content/chapters/README.md`).
- Menüler, düğmeler ve tuş ipuçları kodda kalır.

## Bir satırı değiştirmek

Dosyayı açın, satırı bulun, **yalnızca tırnakların içindeki yazıyı** değiştirin.
Soldaki anahtarlara (`"r03enter"`, `"sun"` gibi) dokunmayın: kod satırı o adla ister.

```json
"sun": [
  { "who": "gorti", "text": "Bu yolda benim umudum nedir?" },
  { "who": "sun", "text": "Umudun bende değil, daha uzak yıldızlarda." }
]
```

- `who`: konuşan, `names.json`'daki anahtarıyla (`gorti`, `sun`, `babyMoon`, `oldMoon`…).
  Yazılmazsa satır anlatıcının kutusunda çıkar.
- `"whisper": true`: fısıltı (kesik çizgili balon).
- Bir konuşmaya satır eklemek için bir `{ … }` daha yazın; aralarına virgül koyun.
- Yazının içinde “ ” ve ’ rahatça kullanılır. Düz çift tırnak gerekirse `\"` yazın.

## Bir sayfanın Güneş'i ve Ay'ı (`sky.json`)

Üç katman vardır: `default` (her yerde), `chapters` (`c1` … `c6`), `rooms`
(`r01`, `b02` …). Her alan önce odadan, yoksa bölümden, yoksa varsayılandan
alınır. Yalnızca değiştirmek istediğinizi yazın.

```json
"rooms": {
  "r02": {
    "moon": { "mood": "grumpy", "wear": ["nightcap"], "tilt": -10 },
    "sun": { "place": "peek", "size": 0.8 }
  }
}
```

| Alan | Ne | Değerler |
|---|---|---|
| `mood` | Ruh hali | `calm` sakin, `sleepy` uykulu, `curious` meraklı, `worried` endişeli, `delighted` neşeli, `grumpy` huysuz, `proud` gururlu, `teary` ağlamaklı |
| `wear` | Üstündekiler (liste) | `nightcap` takke, `bandage` yara bandı, `freckles` çil, `scarf` atkı, `crown` kristal taç, `sweat` ter, `flowers` çiçekler, `zzz` uyku, `notes` notalar; `[]` bölümdekileri kaldırır |
| `tilt` | Başının eğikliği | derece, −25 … 25 (sola eksi) |
| `size` | Boyu | 0.7 … 1.25 (1 olağan) |
| `place` | Köşedeki yeri | `corner` köşede, `peek` kenardan bakıyor, `high` yukarıda, `low` aşağıda, `inward` içeri doğru |
| `lines` | Basılı tutunca söyledikleri | `"söz"` ya da `{ "text": "söz", "answer": "Gorti'nin cevabı" }` |

Önce odanın sözleri gelir; üçten azsa bölümün ve varsayılanın sözleriyle
tamamlanır. Aynı söz iki kez üst üste söylenmez. `answer` yazılan sözlere Gorti
bazen cevap verir.

Oyunda Güneş'e ya da Ay'a bir kez dokununca parlar. Üç saniye basılı tutunca
çevresinde bir halka dolar, sonra bu sayfanın sözlerinden birini bir konuşma
balonunda söyler. Bir konuşma, ara sahne ya da duraklatma menüsü açıkken
yalnızca parlar.

## Denetlemek

```
npm run kd -- check
```

Her dosyayı ve kodun istediği her anahtarı denetler. Bozuk bir şey varsa
dosyasını ve anahtarını söyler:

```
  HATA   src/content/text/sky.json › rooms.r03.sun.mood: "angry" diye bir ruh hali yok (calm, sleepy, …)
  HATA   src/content/text/captions.json › r03enter: kod bu anahtarı istiyor (src/content/scripts/r03.ts) ama dosyada yok
  uyarı  src/content/text/sky.json › rooms.r99: "r99" diye bir oda yok
```

- `HATA`: oyun o satırın yerine “…” (ya da varsayılan görünüşü) koyar. Düzeltin.
- `uyarı`: olduğu gibi kullanılır ama bir bakın.
- Virgül ya da tırnak hatası (`JSON yazım hatası`) satırı ve sütunuyla söylenir.
  Böyle bir dosyayla oyun açılmaz; önce onu düzeltin.

Oyun bozuk bir satırda durmaz: yerine “…” gösterir ve geliştirirken tarayıcı
konsoluna `[metin]` ile başlayan bir uyarı yazar.

VS Code gibi bir editörde her dosyanın başındaki `"$schema"` satırı sayesinde
alanların açıklaması ve seçenekleri yazarken görünür. Seçenekler değişirse
`npm run kd -- schema` bu yardım dosyalarını yeniden yazar.
