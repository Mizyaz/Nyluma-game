# Kristaller Dünyası — 14. Oda

Tarayıcıda oynanan, el çizimi / cel-shaded görünümlü, 2D yan kaydırmalı
gerçeküstü bir macera. Beş bölüm ve on iki oda boyunca Gorti Evaskinan'ın
382. Dünya'daki yolculuğu: 14. Oda'dan yüzeye, mor atla Güneş'e, iç koğuşa ve
boş masadaki hak aktarımına.

> **Oyna:** GitHub Pages bağlantısı depo yayınlandığında burada yer alır
> (`https://<kullanıcı>.github.io/<depo>/`). Aşağıdaki "GitHub Pages" bölümüne
> bakın.

Tüm oyun içi metinler Türkçedir. Oyun tamamen statik dosyalardan çalışır:
sunucu, hesap, çevrim içi hizmet ya da dış kaynak (CDN, yazı tipi, ses) yoktur.

## Kontroller

| Eylem | Klavye | Dokunmatik |
| --- | --- | --- |
| Yürü | A / D ya da ← / → | Sol alttaki yön tuşları |
| Zıpla (bırakınca kısa zıplar) | Boşluk | Zıpla |
| Etkileşim / köke uzan / rezonans | E (ekranda hangisi yazıyorsa) | Eylem |
| Nefes (odak) | Q basılı tut (Ayarlar'dan aç/kapa yapılabilir) | Nefes |
| Biçim değiştir (işaretli dairede) | R | Biçim |
| Balina dili (tomurcuğun yanında) | F; notalar ← ↓ → ya da A S D | Şarkı + büyük nota düğmeleri |
| Duraklat / geri | Esc | Sağ üstteki ⏸ |
| Anılar | M | Duraklatma menüsü |
| Menü seçimi | Enter | Dokun |
| Ara sahneyi geç | Boşluk / E / Enter basılı tut | Eylem ya da diyalog kutusunu basılı tut |

Menüler klavyeyle (↑ ↓, Enter, Esc) ve fareyle kullanılabilir. Ayarlar'da ses
seviyeleri, azaltılmış hareket, ekran sarsıntısı, metin hızı (anında dahil),
nefes için basılı tut / aç-kapa, hikâye yardımı (daha az hasar, daha yavaş
karşılaşmalar, şarkılarda "Tamamla") ve dokunmatik kontroller (otomatik / açık /
kapalı) bulunur.

İlerleme tarayıcının `localStorage` alanına kaydedilir (kontrol noktalarında ve
önemli etkileşimlerden sonra). Depolama kullanılamıyorsa oyun yine oynanır ve
"Bu oturumda kayıt kullanılamıyor" notu gösterilir.

## Yerel olarak çalıştırma

Gereksinim: Node.js 22 LTS (`.nvmrc`), npm.

```bash
npm ci            # bağımlılıkları kilit dosyasına göre kur
npm run dev       # geliştirme sunucusu: http://localhost:5173/
npm run build     # üretim derlemesi: dist/
npm run preview   # dist/ klasörünü yerel olarak sun
```

`dist/index.html` dosyası **HTTP(S) üzerinden** sunulmak içindir; `file://`
olarak doğrudan açılırsa tarayıcılar modül betiklerini engeller. Hızlı bir
yerel sunucu için: `npx serve dist` ya da `node scripts/serve.mjs dist 4173 /`.

### Diğer betikler

| Komut | Ne yapar |
| --- | --- |
| `npm run typecheck` | TypeScript (strict) denetimi |
| `npm run test` | Birim testleri (Vitest): kayıt, durum normalizasyonu, girdi bağlamları, yetenekler, Güneş karşılaşması, oda verisi doğrulaması |
| `npm run test:e2e` | Üretim ve e2e derlemelerini alır, Playwright tarayıcı testlerini çalıştırır: kök ve `/kristaller-dunyasi/` alt yolunda açılış, oynanış akışları (hareket, etkileşim, duraklatma, odak kaybı, kontrol noktası + Devam Et, ayarlar, bozuk/erişilemeyen kayıt, bölüm seçimi, son), çoklu dokunma, yeniden boyutlandırma |
| `npm run test:campaign` | Yeni Oyun'dan son karta kadar tüm kampanyayı yalnızca normal klavye girdileriyle oynayan uzun test (yaklaşık 25–35 dakika) |
| `npm run package` | Kaynak ve `dist` arşivlerini `release/` altına üretir |

Tarayıcı testleri için Chromium gerekir (`npx playwright install chromium`).

## GitHub Pages

Depo `.github/workflows/deploy.yml` ile resmî Pages eylemlerini kullanır
(`actions/configure-pages`, `actions/upload-pages-artifact`,
`actions/deploy-pages`). Varsayılan dala (`main`) her gönderimde ve elle
tetiklemede: `npm ci` → typecheck → birim testleri → üretim derlemesi →
`dist/` yükleme → yayın.

Bir kereliğine yapılması gereken ayar:

1. GitHub'da depo → **Settings → Pages → Build and deployment → Source →
   GitHub Actions**.
2. `main` dalına gönderin ya da **Actions → Deploy to GitHub Pages → Run
   workflow**.
3. Yayın adresi iş akışının `deploy` adımında görünür.

Vite `base: './'` ile derlenir; bu yüzden aynı `dist/` hem alan adı kökünde
hem de `https://<kullanıcı>.github.io/<depo>/` gibi bir alt yolda çalışır.
İstemci tarafı yönlendirme (router) yoktur; bölüm seçimi oyun içi durumdur.

Çekme istekleri (`pull_request`) yalnızca salt okunur `ci.yml` iş akışını
çalıştırır; yayın izinleri almaz.

### Alternatif: dal üzerinden statik yayın

Actions kullanmak istemezseniz `npm run build` çıktısını (`dist/` klasörünün
**içeriğini**) ayrı bir dalın köküne (örn. `gh-pages`) koyup Settings → Pages →
Source → **Deploy from a branch** ile o dalı seçebilirsiniz. `dist/.nojekyll`
dosyası Jekyll işlemesini kapatır.

## Proje yapısı

```
index.html                  Giriş sayfası
src/main.ts                 Hizmetlerin kurulumu ve Phaser oyunu
src/game/config.ts          1280×720 tasarım alanı, FIT ölçekleme, Arcade Physics (60 Hz sabit adım)
src/game/scenes/            BootScene (çizimleri bir kez rasterleştirir), MenuScene, WorldScene, EndingScene
src/game/entities/          Oyuncu, iskelet (cutout) çalışma zamanı, at, yaratıklar, Ay/Güneş yüzleri, tehlikeler, anı taşı
src/game/systems/           Girdi bağlamları, kayıt, ses (Web Audio), anlatı/ara sahne, yetenek mantığı
src/game/data/              12 odanın verisi, diyaloglar, hedefler, anılar, Güneş karşılaşması durum makinesi
src/game/rooms/             Oda kurucu (arazi, kapılar/bayraklar) ve oda betikleri
src/game/art/               Palet, SVG çizim araçları, karakter/prop/anı çizimleri, arazi ve arka plan ressamları, atlas üretimi
src/ui/                     DOM arayüzü: menüler, HUD, diyalog, şarkı paneli, anı bulmacası, belge görünümü, dokunmatik kontroller
tests/unit, tests/e2e       Vitest ve Playwright testleri
scripts/                    Test sunucusu, paketleme ve geliştirme yardımcıları
dev/                        Geliştirici önizlemeleri (npm run dev ile /dev/preview.html, /dev/props.html, /dev/creatures.html, /dev/memories.html)
```

Çizimlerin tamamı koddan üretilir: karakter parçaları ve proplar SVG olarak
yazılır, açılışta bir kez rasterleştirilip 2048×2048 atlas sayfalarına
paketlenir; karakterler prosedürel iskelet (cutout) animasyonuyla oynatılır.
Ses efektleri ve müzik Web Audio ile sentezlenir.

## Haklar ve lisanslar

- "Kristaller Dünyası" hikâyesi ve dünyası özgün metnin yazarına aittir; tüm
  hakları saklıdır. Bu depo için açık kaynak lisansı seçilmemiştir.
- Üçüncü taraf bağımlılıkların lisansları: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Test ve doğrulama notları: [QA_REPORT.md](QA_REPORT.md).

---

**English summary.** A complete Turkish-language 2D surreal adventure built
with Phaser 3.90, TypeScript (strict) and Vite. Run `npm ci && npm run dev`
(Node 22). `npm run build` produces a static `dist/` that works at a domain
root or any sub-path (GitHub Pages project sites). Deploy with the included
GitHub Actions workflow after setting *Settings → Pages → Source → GitHub
Actions*. Serve over HTTP(S); `file://` is not supported. Story rights remain
with the original author.
