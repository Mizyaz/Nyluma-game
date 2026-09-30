# Bölüm inşası

Bölümler ve odalar JSON dosyalarıdır; kod yazmadan oda yapılır.

| Dosya | Ne |
|---|---|
| `chapters.json` | Bölümler: numara, ad, Ay/Güneş, odaların sırası |
| `rooms/<id>.json` | Bir oda: yer, dekor, NPC'ler, kapılar, tetikler, çıkışlar |
| `room.schema.json`, `chapters.schema.json` | Editörün yardım metni ve otomatik tamamlama (`npm run kd -- schema` üretir) |

VS Code gibi bir editörde dosyanın başındaki `"$schema"` sayesinde her alan
yazılırken açıklaması ve seçenekleri görünür.

## Komutlar

```
npm run kd -- new b03 --chapter c6 --title "Ayna Odası" --theme hill
npm run kd -- check          # her şeyi denetler (yanlış oda adı, bozuk koşul, olmayan çizim...)
npm run kd -- show b01       # odada ne olduğunu düz yazıyla anlatır
npm run kd -- list props     # kullanılabilen çizimler (cast, themes, grounds, music, abilities, rooms, chapters)
npm run kd -- shot b01 700 1500   # odanın ekran görüntüleri: shots/b01-700.png ...
npm run dev                  # sonra tarayıcıda ?room=b01
```

## Bir oda

```json
{
  "$schema": "../room.schema.json",
  "id": "b01", "chapter": "c6", "title": "Form Kapısı", "theme": "surface",
  "width": 2600, "spawn": { "x": 240 }, "form": "root",
  "npcs": [{ "id": "ayBasli", "who": "moonMan", "x": 900,
             "talk": [{ "who": "moonMan", "text": "İnsan ol." }],
             "then": [{ "unlock": "form" }] }],
  "gates": [{ "id": "kapi", "x": 1500, "open": "form:human", "hint": "İnsan formuna açılır. (R)" }],
  "triggers": [{ "id": "gecti", "x": 1800, "do": [{ "word": "OLDU!" }, { "flag": "b01.passed" }] }],
  "exits": [{ "to": "b02", "when": "b01.passed" }]
}
```

Yer düzdür; zıplama yok. Bulmacalar **form değiştirme**, konuşma ve bayraklarla kurulur.

## Koşullar

`when`, `unless`, `open` ve `if` alanları bir koşul alır:

| Yazım | Anlamı |
|---|---|
| `b01.told` | bu bayrak konmuş |
| `form:human` | Gorti insan formunda (`form:root` kök formu) |
| `room:b01` | şu an bu odada |
| `!a`, `a & b`, `a \| b`, `( … )` | değil, ve, veya, gruplama |

Kapılar koşul değişince kendiliğinden açılıp kapanır (form değişince de).

## Olaylar

`enter` (ilk girişte), NPC'nin `then`'i (ilk konuşmadan sonra) ve tetiklerin `do`'su sırayla çalışan olaylardır:

| Olay | Ne yapar |
|---|---|
| `{ "say": [ { "who": "gorti", "text": "…" } ] }` | konuşma balonları (`who` yoksa anlatıcı kutusu) |
| `{ "flag": "x" }` / `{ "unflag": "x" }` | bayrak koy / kaldır (kayda geçer) |
| `{ "form": "human" }` | Gorti dönüşür |
| `{ "unlock": "form" }` | yetenek açılır (R ile form değiştirme) |
| `{ "sky": { "sun": "laugh" } }` | Ay/Güneş değişir |
| `{ "word": "OLDU!" }` | çizgi roman sesi |
| `{ "wait": 800 }` | bekle (ms) |
| `{ "go": "b02" }` | başka odaya geç |
| `{ "if": "koşul", "then": [ … ], "else": [ … ] }` | koşula göre |

Bir oda kendiliğinden şu bayrakları koyar: `<oda>.entered`, `<oda>.<npc>.talked`, `<oda>.<tetik>.done`.

## Ay ve Güneş

Her bölümün `sky`'ı sol üstteki Ay'ı (`baby`, `old`, `none`) ve sağ üstteki
Güneş'i (`calm`, `laugh`, `none`) seçer. Bir oda kendi `sky`'ı ile, bir olay da
`{ "sky": … }` ile değiştirebilir.

## Araçlar

- **Odalar**: bu JSON'lar (elle ya da `kd` ile). İleride Tiled (`.tmj`) haritalarından da okunacak.
- **Diyalog**: `say` satırları. Uzun, dallanan konuşmalar için Ink (inkjs) desteği sırada.
- **Karakter çizimi**: Inkscape (SVG, her parça ayrı grup); `content/characters/` ve `kd list cast`.
