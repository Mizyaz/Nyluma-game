# Müzik kütüphanesi

Bu klasör oyunda çalınacak **kayıtlı müzikleri** (mp3 ve benzeri) ve her
parçanın **lisans notunu** tutar. Kütüphanede bir bölüm için parça yoksa oyun
o bölümde kendi ürettiği müziği çalar: odalarda piyano, diyaloglarda yaylılar
(bkz. `src/music/README.md`).

```
music/
├── tracks.json        parça listesi
├── tracks/            ses dosyaları (.mp3, .ogg, .m4a, .wav, .flac, .opus)
└── licenses/          her parça için bir lisans notu: <id>.txt
```

## Parça ekleme

1. Ses dosyasını `music/tracks/` klasörüne koyun, örneğin
   `music/tracks/sakin-piyano.mp3`.
2. `music/licenses/sakin-piyano.txt` adında bir lisans notu yazın. Dosya adı,
   parçanın `id` değeriyle aynı olmalı. İçine şunları yazın:
   - eserin adı, besteci ve icracı,
   - parçayı indirdiğiniz sayfanın tam adresi,
   - lisansın adı ve adresi,
   - indirme tarihi.

   Parça sayfasında lisansın göründüğü kısmı kopyalamanız ya da ekran
   görüntüsünü saklamanız önerilir.
3. `music/tracks.json` dosyasındaki listeye parçayı ekleyin:

```json
{
  "tracks": [
    {
      "id": "sakin-piyano",
      "title": "Parçanın adı",
      "artist": "Besteci / icracı",
      "file": "tracks/sakin-piyano.mp3",
      "license": "CC0-1.0",
      "source": "Parçanın indirildiği sayfanın adresi",
      "cues": ["menu", "roots"],
      "volume": 0.9
    }
  ]
}
```

4. `npm run music:check` ile kontrol edin, sonra `npm run build` ile derleyin.

### Alanlar

| Alan | Açıklama |
| --- | --- |
| `id` | Küçük harf, rakam ve tire (ör. `sakin-piyano`). Lisans notunun adı da budur. |
| `title`, `artist` | Parça adı ve sanatçı; atıf gerektiren lisanslarda oyunun Katkıda Bulunanlar ekranında gösterilir. |
| `file` | `music/` içindeki yol (ör. `tracks/sakin-piyano.mp3`). |
| `url` | `file` yerine, çevrimiçi bir kütüphaneden akış için `https://` adresi. Adres, tarayıcıdan çalınmaya (CORS) izin vermelidir; izin vermezse oyun o bölümde piyanoya döner. |
| `license` | Aşağıdaki izinli lisanslardan biri. |
| `source` | Parçanın ve lisansının bulunduğu sayfa. |
| `cues` | Parçanın çalacağı yerler: `menu`, `roots` (Bölüm I), `forest` (orman ve açıklık), `ride` (at yolculuğu), `sun` (Güneş), `inner` (iç koğuş ve mekanizma), `final` (boş masa ve son), `tension` (yüz animasyonlu diyalog sahneleri). `*` bütün oda cue'ları demektir; `tension` için parça bu cue'yu adıyla listelemelidir, yoksa diyaloglarda üretilen yaylılar çalar. Bir yerde birden çok parça varsa sırayla çalınır. |
| `volume` | İsteğe bağlı ses düzeyi, 0–1.5 (varsayılan 1). |

## İzinli lisanslar

| Kimlik | Lisans | Atıf |
| --- | --- | --- |
| `CC0-1.0` | Creative Commons CC0 1.0 (kamu malı adanışı) | Gerekmez |
| `PDM-1.0` | Public Domain Mark 1.0 (kamu malı) | Gerekmez |
| `CC-BY-4.0` | Creative Commons Atıf 4.0 | Gerekir; oyun Katkıda Bulunanlar ekranında gösterir |
| `CC-BY-3.0` | Creative Commons Atıf 3.0 | Gerekir; oyun Katkıda Bulunanlar ekranında gösterir |

"NC" (ticari olmayan), "ND" (türetilemez) ve "SA" (aynı lisansla paylaş)
koşullu lisanslar ile sitelerin kendi özel lisansları bilerek listeye
alınmamıştır. Böyle bir parça kullanmak isterseniz koşullarını okuyup
`src/music/library.ts` içindeki `ALLOWED_LICENSES` listesine bilinçli olarak
ekleyin.

Bir sitenin genel olarak "ücretsiz müzik" sunması yeterli değildir: her
parçanın **kendi sayfasındaki** lisansı geçerlidir. Klasik eserlerde bestenin
kamu malı olması kaydın da serbest olduğu anlamına gelmez; kaydın (icranın)
lisansına bakın.

## Denetim

- `npm run music:check` ve `npm test`, listeyi ve dosyaları denetler.
- `npm run build`, hatalı bir parça varsa (izinsiz lisans, eksik lisans notu,
  eksik ses dosyası, bilinmeyen `cues`) derlemeyi durdurur. Böylece lisans
  notu olmayan bir parça yayına çıkamaz.
- Derleme, listedeki parçaları ve lisans notlarını `dist/music/` altına
  kopyalar.
