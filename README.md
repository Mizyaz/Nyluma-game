# Kristaller Dünyası — 14. Oda

Tarayıcıda oynanan, el çizimi / cel-shaded görünümlü, 2D yan kaydırmalı
gerçeküstü bir macera. Beş bölüm ve on iki oda boyunca Gorti Evaskinan'ın
382. Dünya'daki yolculuğu: 14. Oda'dan yüzeye, mor atla Güneş'e, iç koğuşa ve
boş masadaki hak aktarımına.

> **Oyna:** https://mizyaz.github.io/Nyluma-game/

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
| Diyaloğu ilerlet | Boşluk / E | Diyalog kutusuna dokun |
| Ara sahneyi geç | Boşluk / E / Enter basılı tut | Eylem ya da diyalog kutusunu basılı tut |
| Anı istasyonu (bulmaca) | ← → ile seç, E ile değiştir | Parçaya dokun, sonra yer değiştireceği parçaya dokun (ya da sürükle) |
| Tam ekran | — | Sağ üstteki ⛶ (dokunmatik cihazlarda oyun başlarken otomatik denenir) |

**Mobil:** Oyun baştan sona yalnızca dokunmatikle oynanabilir. Sol altta yön
düğmeleri, sağ altta Zıpla ve Eylem; Nefes, Biçim ve Şarkı düğmeleri gerektiği
yerde belirir. Birden çok parmak aynı anda kullanılabilir (ör. yürürken zıplamak
ya da nefes tutarken zıplamak). Dokunmatik cihazlarda ekrandaki yönergeler tuş
adları yerine bu düğmelerin adlarıyla gösterilir. Cihaz dik ya da yatay
tutulabilir: dik tutulduğunda oyun görüntüsü üstte tam genişlikte, altyazılar
ve diyaloglar hemen altında, kontroller en altta durur; yatay tutulduğunda oyun
ekranı doldurur ve altyazılar görüntünün altında gösterilir. Tarayıcı
destekliyorsa oyun başlarken tam ekrana geçer.

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
| `npm run test` | Birim testleri (Vitest): kayıt, durum normalizasyonu, girdi bağlamları, yetenekler, Güneş karşılaşması, oda verisi doğrulaması, müzik bestecisi ve müzik kütüphanesi |
| `npm run music:check` | Yalnızca müzik testleri: bestecinin kuralları ve `music/tracks.json` ile lisans notlarının denetimi |
| `npm run test:e2e` | Üretim ve e2e derlemelerini alır, Playwright tarayıcı testlerini çalıştırır: kök ve `/kristaller-dunyasi/` alt yolunda açılış (WebGL), oynanış akışları (hareket, etkileşim, duraklatma, odak kaybı, kontrol noktası + Devam Et, ayarlar, bozuk/erişilemeyen kayıt, bölüm seçimi, son), çoklu dokunma, dikey ve yatay ekran düzeni, menülerin her boyutta ekrana sığması, dokunmatik düğmelerin çakışmaması ve telefon boyutlu ekranda yalnızca dokunmatikle ilk oda (`PHONE_UPRIGHT=1` ile telefon dik tutulmuş olarak) |
| `npm run test:campaign` | Yeni Oyun'dan son karta kadar tüm kampanyayı oynayan iki uzun test: masaüstünde yalnızca klavyeyle ve yatay tutulan telefon boyutlu ekranda yalnızca dokunmatikle (bu depodaki ölçümde her biri yaklaşık 12 dakika). `PHONE_UPRIGHT=1 npx playwright test mobile --grep @campaign` dokunmatik koşuyu telefon dik tutulmuş olarak oynar |
| `npm run package` | Kaynak ve `dist` arşivlerini `release/` altına üretir |

Tarayıcı testleri için Chromium gerekir (`npx playwright install chromium`).
Açılış testleri ve referans ekran görüntüleri (`SHOTS=1 npx playwright test
screenshots`, çıktı: `qa/screenshots/`) WebGL için SwiftShader ile çalışır;
oynanış testleri Canvas çiziciyle (`?canvas=1`) ve Chromium'un varsayılan
ayarlarıyla çalışır.

## GitHub Pages

Oyun https://mizyaz.github.io/Nyluma-game/ adresinde yayınlanır.
`.github/workflows/deploy.yml`, varsayılan dala (`main`) her gönderimde ve
elle tetiklemede şunları yapar: `npm ci` → typecheck → birim testleri → üretim
derlemesi → `dist/` içeriğini `gh-pages` dalına yazma. GitHub Pages bu dalı
sunar ("pages build and deployment" iş akışı).

Pages kapalıysa ya da başka bir kaynağa ayarlıysa: depo → **Settings → Pages →
Build and deployment → Source → Deploy from a branch → `gh-pages` / `(root)`**.
Resmî Pages eylemleriyle (Source → GitHub Actions) yayınlamak isterseniz iş
akışının son adımını `actions/configure-pages`, `actions/upload-pages-artifact`
ve `actions/deploy-pages` ile değiştirebilirsiniz.

Vite `base: './'` ile derlenir; bu yüzden aynı `dist/` hem alan adı kökünde
hem de `https://<kullanıcı>.github.io/<depo>/` gibi bir alt yolda çalışır.
İstemci tarafı yönlendirme (router) yoktur; bölüm seçimi oyun içi durumdur.

Çekme istekleri (`pull_request`) yalnızca salt okunur `ci.yml` iş akışını
çalıştırır; yayın izinleri almaz.

### Elle yayın

Actions kullanmadan da yayınlanabilir: `npm run build` çıktısını (`dist/`
klasörünün **içeriğini**) `gh-pages` dalının köküne koyup gönderin. `dist/.nojekyll`
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
src/music/                  Bağımsız müzik modülü: üretken piyano bestecisi, sentez piyano, lisanslı parça kütüphanesi, oynatıcı
music/                      Müzik kütüphanesi: tracks.json, tracks/ (ses dosyaları), licenses/ (her parçanın lisans notu)
tests/unit, tests/e2e       Vitest ve Playwright testleri
scripts/                    Test sunucusu, paketleme ve geliştirme yardımcıları
dev/                        Geliştirici önizlemeleri (npm run dev ile /dev/preview.html, /dev/props.html, /dev/creatures.html, /dev/memories.html)
```

Çizimlerin tamamı koddan üretilir: karakter parçaları ve proplar SVG olarak
yazılır, açılışta bir kez rasterleştirilip 2048×2048 atlas sayfalarına
paketlenir; karakterler prosedürel iskelet (cutout) animasyonuyla oynatılır.
Ses efektleri Web Audio ile sentezlenir.

## Müzik

Arka plan müziği piyanodur ve ayrı bir modülden (`src/music/`) gelir:

- **Üretilen piyano:** Müzik oyun sırasında tarayıcıda bestelenir ve çalınır;
  kayıt ya da örnek ses kullanılmaz. Her bölümün kendi karakteri vardır, örneğin
  menü Re majör, Bölüm I La minör vals, ormanlar Fa lidya, at yolculuğu Re
  miksolidya, Güneş Do armonik minör. Besteci her bölümde tanınır bir motifle
  başlar, sonra her seferinde biraz farklı akar. Nasıl çalıştığı ve nasıl
  ayarlanacağı `src/music/README.md` dosyasında anlatılıyor.
- **Parça kütüphanesi:** `music/` klasörüne mp3 (ya da ogg, m4a, wav) ve her
  parça için bir lisans notu eklenir, parça `music/tracks.json` listesinde
  hangi bölümlerde çalacağıyla birlikte tanımlanır. Kütüphanede parçası olan
  bölümde kayıt çalar, olmayan bölümde piyano. İzinli lisanslar CC0, kamu malı
  ve CC BY'dir; atıf gerekenler Katkıda Bulunanlar ekranında gösterilir.
  Lisansı izinli olmayan ya da lisans notu eksik bir parça derlemeyi durdurur.
  Ayrıntılar `music/README.md` dosyasında.

Tarayıcılar sesi ancak bir dokunuş ya da tuş basışından sonra açar. Müzik
menüde ilk dokunuşla başlar. Ses düzeyi Ayarlar → Müzik'ten değiştirilir.

Görünüm 2.5D'dir: platformların üst yüzeyi derinlikli çizilir, arka katmanlar
farklı hızlarda kayar, ön planda odak dışı siluetler geçer ve karakter yere
gölge düşürür. Her odanın arkasında, kristal halkalarının bükülerek izleyiciye
doğru aktığı bir tünel katmanı vardır; oda ve bölüm geçişleri aynı tünelin tam
ekran, hızlanan bir sürümüyle yapılır. Her adımda zeminden parlayan kristaller
filizlenir, inişlerde kristal bir taç açılır. Oynanan her formun (Gorti'nin kök
ve insan biçimleri, Korkak ve Mekanik form) gözleri siyahtır; Mekanik formun
anahtar ve kilit gözleri de siyah silüetlerdir. Duygular, ayrı birer parça olan
ve her harekete, darbeye, keşfe ve konuşmaya tepki veren kaşlarla taşınır.

## Haklar ve lisanslar

- "Kristaller Dünyası" hikâyesi ve dünyası özgün metnin yazarına aittir; tüm
  hakları saklıdır. Bu depo için açık kaynak lisansı seçilmemiştir.
- Üçüncü taraf bağımlılıkların lisansları: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Test ve doğrulama notları: [QA_REPORT.md](QA_REPORT.md).

---

**English summary.** A complete Turkish-language 2D surreal adventure built
with Phaser 3.90, TypeScript (strict) and Vite. Run `npm ci && npm run dev`
(Node 22). `npm run build` produces a static `dist/` that works at a domain
root or any sub-path (GitHub Pages project sites). The included workflow
tests every push to `main` and publishes `dist/` to the `gh-pages` branch,
which GitHub Pages serves (*Settings → Pages → Source → Deploy from a branch →
`gh-pages`*); live at https://mizyaz.github.io/Nyluma-game/. Playable with a
keyboard, a mouse for menus, or touch alone, held upright or sideways. The
background music is piano composed live in the browser by a separate module
(`src/music/`), with an optional library of recorded pieces (`music/`) that
only ships with an allowed license and a license note per piece. Serve
over HTTP(S); `file://` is not supported. Story rights remain with the
original author.
