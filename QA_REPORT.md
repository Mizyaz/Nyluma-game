# QA raporu — Kristaller Dünyası — 14. Oda

Bu rapor yalnızca gerçekten çalıştırılan kontrolleri ve bunların sonuçlarını
listeler. Ölçümler aşağıdaki test ortamında alınmıştır; gerçek cihaz
performansını temsil etmez. Sonuçlar `48c4778` commit'indeki oyun kodu
içindir. Sonraki commit'ler (`07d0303` ve bu rapor) oyunun kendisini
değiştirmez: yalnızca test aracını (Vitest 4.1.11), testleri, ekran
görüntülerini ve belgeleri değiştirir. Derleme çıktısı bayt bayt aynıdır.

## Test ortamı

| | |
| --- | --- |
| İşletim sistemi | Linux x86_64 (bulut kapsayıcısı), 4 vCPU, 16 GB RAM, **GPU yok**, ses çıkışı yok |
| Node.js / npm | 22.22.2 / 10.9.7 |
| Tarayıcı | Playwright 1.56.1 ile Chromium 141.0.7390.37 (headless shell) |
| WebGL | ANGLE + SwiftShader (yazılımsal); gerçek bir GPU yok |
| Cihaz emülasyonu | Masaüstü 1280×720; telefon yatay 915×412 ve dik 412×915 (`isMobile`, `hasTouch`, DPR 2); düzen testlerinde 320×568'den 1600×900'e 13 ekran boyutu |

Gerçek telefon/tablet, Safari, Firefox, fiziksel dokunmatik ekran ve
hoparlörden dinleme bu ortamda **test edilmedi**.

## Özet

| Kontrol | Sonuç |
| --- | --- |
| `npm run typecheck` (TypeScript strict) | Hatasız |
| `npm test` (Vitest) | 8 dosya, 73 test — hepsi geçti |
| `npm run build` | Başarılı (boyutlar aşağıda) |
| Tarayıcı testleri (`--grep-invert @campaign`) | 17/17 geçti, 3,1 dk (11 test atlandı: 10 ekran görüntüsü testi `SHOTS`, 1 geliştirici rota testi `DEV_ROUTE` olmadan çalışmaz) |
| Tam kampanya — yalnızca klavye (masaüstü 1280×720) | **Geçti**, 11,5 dk |
| Tam kampanya — yalnızca dokunmatik, telefon yatay (915×412) | **Geçti**, 10,7 dk |
| Tam kampanya — yalnızca dokunmatik, telefon dik (412×915) | **Geçti**, 10,5 dk |
| Referans ekran görüntüleri (WebGL) | 10/10 alındı (`qa/screenshots/`) |
| Temiz klon: `npm ci` → typecheck → test → build | Geçti (ayrıntı aşağıda) |
| GitHub Pages yayını | `48c4778` için "Deploy to GitHub Pages" (#4) ve "pages build and deployment" (#4) iş akışları başarılı; site bu kapsayıcıdan açılamadı (ağ politikası) |

## Temiz klon

Commit edilmiş depo (`07d0303`) yeni bir dizine klonlandı. CI ile aynı npm
sürümüyle (10.9.7) sırayla şunlar çalıştırıldı:

- `npm ci`: kilit dosyasından 51 paket; `npm audit` 0 açık buldu.
- `npm run typecheck`: hatasız.
- `npm test`: 8 dosya, 73 test geçti.
- `npm run build`: başarılı.

Üretilen dosyalar çalışma dizinindeki derlemeyle bayt bayt aynıydı:

| Dosya | Boyut | gzip |
| --- | --- | --- |
| `index-C5iUrOcT.js` | 506,20 kB | 177,70 kB |
| `phaser-DOFALNY7.js` | 1.207,94 kB | 332,12 kB |
| `index-K4iKNe4n.css` | 21,91 kB | 5,21 kB |

`music/tracks.json` ve `index.html` de aynıydı. `dist/` toplam 1,7 MB.

Vitest 4.0.18 için `npm audit` iki uyarı veriyordu:
[GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp)
(kritik) ve [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9)
(orta). İkisi de yalnızca test aracını etkiliyordu; `npm audit --omit=dev`
zaten temizdi. Vitest 4.1.11'e yükseltildi.

## Tarayıcı testleri

`npx playwright test --grep-invert @campaign` (üretim derlemesi `dist/` ve
e2e derlemesi `dist-e2e/` yerel HTTP sunucularından):

| Test | Proje | Süre |
| --- | --- | --- |
| Alan adı kökünde açılış: eksik dosya, konsol hatası, 4xx yok | webgl | 6,1 sn |
| `/kristaller-dunyasi/` alt yolunda açılış (GitHub Pages proje sitesi gibi) | webgl | 7,3 sn |
| İlk odada yürüme, değişken yükseklikte zıplama, inceleme; oyuncak küplerin ve sandığın önünden zıplamadan pencereye yürüyüp inceleme | desktop | 11,9 sn |
| Duraklatma/devam; pencere odağı kaybında tutulan tuşların bırakılması | desktop | 5,4 sn |
| Kontrol noktasında kayıt, yeniden yükleme ve Devam Et | desktop | 12,2 sn |
| Ana menü ve duraklatma menüsündeki her düğme | desktop | 6,7 sn |
| Ayarların yeniden yüklemeden sonra korunması | desktop | 4,5 sn |
| Bozuk kayıttan kurtulma; depolama olmadan oynama | desktop | 6,8 sn |
| Bölüm seçimiyle açık bir bölümü başlatma | desktop | 4,2 sn |
| Son ofis: satış belgesi ve sabit son cümle | desktop | 50,4 sn |
| İki parmakla aynı anda yürüme + zıplama; iptal her şeyi bırakır | desktop | 5,6 sn |
| Müzik: ilk tuşla menü piyanosu, oda değişince müzik değişimi, her cue'nun seviyesi | desktop | 9,5 sn |
| Müzik: kütüphanedeki kaydın çalınması, açılamayan kaydın piyanoya dönmesi | desktop | 3,0 sn |
| Ekran düzeni: yatayda DOM katmanı tuvalle hizalı, dikte görüntü üstte ve yazılar altında (8 boyut) | desktop | 8,2 sn |
| Ana menüdeki her düğme 6 boyutta ekranda; dikte düğmeler resmin altında | desktop | 11,2 sn |
| Telefon ekranında yalnızca dokunmatikle ilk oda (menü, oyun, duraklatma) | desktop | 22,5 sn |
| Dokunmatik düğmeler 5 boyutta (dik ve yatay) çakışmıyor ve ekranda | desktop | 6,2 sn |

`webgl` projesi WebGL için SwiftShader bayraklarıyla, `desktop` projesi
Chromium'un varsayılan ayarlarıyla ve oyunun Canvas çizicisiyle (`?canvas=1`)
çalışır. Referans ekran görüntüsü testleri `SHOTS` ortam değişkeni olmadan
atlanır.

Ekran düzeni testleri şunları ölçer:

- tuvalin 16:9 kalması ve yatay kaydırma olmaması;
- dik ekranda oyun görüntüsünün tam genişlikte, 60 px'lik HUD bandının
  altında durması, altyazı ve bildirimlerin görüntünün altında kalması;
- yatayda DOM katmanının tuvalle hizalı olması;
- ana menüdeki her düğmenin 355×620, 412×915, 740×340, 915×412, 768×1024 ve
  1280×720 boyutlarında ekranın içinde kalması; dik ekranda hiçbir düğmenin
  resmin kenarına binmemesi;
- dokunmatik düğmelerin 915×412, 740×340, 412×915, 355×620 ve 320×568
  boyutlarında birbirine binmemesi ve ekranın içinde kalması.

## Tam kampanya koşuları

Üç koşu da Yeni Oyun'dan son karta kadar oynar; oda atlama ya da durum yazma
yoktur. Bot, e2e derlemesindeki salt okunur durum sondasını okuyarak yalnızca
normal girdiler gönderir:

- klavye koşusunda tuş olayları;
- dokunmatik koşularda Chrome DevTools Protokolü üzerinden gerçek dokunma
  olayları: ekrandaki yön düğmeleri; Zıpla, Eylem, Nefes, Biçim ve Şarkı
  düğmeleri; şarkı ve anı panellerine, diyaloğa ve belgeye doğrudan dokunma.

Koşular sırasında piyano müziği de çalıyordu.

| Oda | Klavye | Dokunmatik, yatay | Dokunmatik, dik |
| --- | --- | --- | --- |
| 01 — 14. Oda | 41 sn | 18 sn | 18 sn |
| 02 — Fosil Kökler | 56 sn | 41 sn | 40 sn |
| 03 — Kristal Ağacın Odası | 50 sn | 53 sn | 51 sn |
| 04 — İlk Rüzgâr | 144 sn | 145 sn | 144 sn |
| 05 — Hatırlanan Bir Hayatın Ağırlığı | 46 sn | 37 sn | 34 sn |
| 06 — Orman Cevap Veriyor | 30 sn | 35 sn | 32 sn |
| 07 — Çiçeklenen Yolculuk (mor at) | 96 sn | 96 sn | 97 sn |
| 08 — Güneş | 90 sn | 75 sn | 75 sn |
| 09 — Serçe Açıklığı | 20 sn | 22 sn | 23 sn |
| 10 — Meşale ve Ters Anılar (iç koğuş) | 37 sn | 37 sn | 37 sn |
| 11 — Anahtar ve Kilit | 27 sn | 29 sn | 29 sn |
| 12 — Boş Masa | 39 sn | 41 sn | 41 sn |
| **Toplam test süresi** | **11,5 dk** | **10,7 dk** | **10,5 dk** |

Her koşuda son kartta sabit cümle ("Gorti, içindeki tüm ruhların sahipliğini
kaybetmişti.") doğrulandı. Klavye koşusunda kayıttaki profil (`endingSeen`,
açılan bölümler 1–5), dokunmatik koşularda son karttan ana menüye dönüş de
doğrulandı. Konsol hatası, sayfa hatası ya da başarısız istek yoktu.

## Müzik

Arka plan müziği `src/music/` modülünden gelir: tarayıcıda bestelenen ve
sentezlenen piyano, ya da `music/` kütüphanesindeki lisanslı kayıtlar.

- **Birim testleri** (`tests/unit/music.test.ts`, 24 test) şunları denetler:
  - her cue'da iki tam biçim boyunca ölçü süreleri;
  - dizi dışı nota olmaması (armonik minörde V üzerindeki yeden hariç);
  - sol el ve melodi aralıkları;
  - güçlü vuruşlarda melodinin akor sesine düşmesi;
  - A · A′ · B · A″ · ara geçiş biçimi ve kadanslar;
  - açılış motifinin tekrarlanması;
  - aynı tohumun aynı notaları vermesi;
  - sol elde küçük dokuzlu renk olmaması;
  - kütüphane denetimi: izinsiz lisans, eksik lisans notu, eksik dosya,
    klasör dışı yol, `http` adresi, bilinmeyen cue ve aynı `id` reddedilir.
- **Tarayıcı testleri:**
  - Menüde ses ilk tuş basışına kadar kapalı kalır; ilk tuşla menü piyanosu
    başlar, Yeni Oyun'la Bölüm I müziğine geçilir.
  - Kütüphanedeki bir kayıt kendi cue'sunda çalar (test, iki saniyelik bir
    tonu kayıt yerine kullanır). Açılamayan bir kayıt, cue'sunu piyanoya
    bırakır.
- **Seviye ölçümü:** Her cue'dan 12 saniye, varsayılan müzik ses düzeyinde
  `OfflineAudioContext` ile çizildi. Kırpılma yok:

| Cue | Nerede | Tepe (1 = tam ölçek) | RMS |
| --- | --- | --- | --- |
| `menu` | Ana menü | 0,17 | −32,6 dBFS |
| `roots` | Bölüm I (01–03) | 0,15 | −35,5 dBFS |
| `forest` | Orman ve açıklık (04–06, 09) | 0,22 | −32,8 dBFS |
| `ride` | Mor at (07) | 0,26 | −28,8 dBFS |
| `sun` | Güneş (08) | 0,24 | −30,7 dBFS |
| `inner` | İç koğuş ve mekanizma (10–11) | 0,15 | −35,1 dBFS |
| `final` | Boş masa ve son (12) | 0,18 | −37,0 dBFS |

- **Dinleme:** Bu ortamda hoparlör yok; müzik kulakla değerlendirilmedi.
  Menü, Bölüm I ve orman için 30–32 saniyelik örnekler WAV olarak çizilip
  paylaşıldı.

## Referans ekran görüntüleri

`SHOTS=1 npx playwright test screenshots` (WebGL, SwiftShader):

| Dosya | İçerik |
| --- | --- |
| `qa/screenshots/01-menu.jpg` | Ana menü |
| `qa/screenshots/02-root-forest.jpg` | Kök biçimindeki Gorti ormanda |
| `qa/screenshots/03-human-puzzle.jpg` | İnsan biçimi, anı taşı bulmacası |
| `qa/screenshots/04-ride.jpg` | Mor atla yolculuk |
| `qa/screenshots/05-sun.jpg` | Güneş arenası |
| `qa/screenshots/06-dormitory.jpg` | İç koğuş (Korkak Form, meşale) |
| `qa/screenshots/07-final-document.jpg` | Son belge ("SATILDI") |
| `qa/screenshots/08-crystal-tunnel.jpg` | Bölüm geçişindeki kristal tüneli |
| `qa/screenshots/09-phone-menu.jpg` | Dik telefonda ana menü (başlık resmin üstünde, düğmeler altında) |
| `qa/screenshots/10-phone-game.jpg` | Dik telefonda ilk oda: altyazı görüntünün altında, kontroller en altta |

## Performans (bu ortamda)

Ölçüm `dist-e2e` derlemesiyle, 1280×720'de ve sayfa açılışından alındı.
r03 ve r06 odaları ikişer kez ölçüldü. Yürüme ölçümünde ilk tuşla açılan
piyano müziği de çalıyordu.

| | Canvas çizici, Chromium varsayılan | WebGL, SwiftShader (yazılımsal GL) |
| --- | --- | --- |
| Çizimlerin atlasa dönüştürülmesi | 0,92–1,13 sn | 1,05–1,15 sn |
| Odanın oynanabilir olması | 2,7–2,9 sn | 3,6–4,1 sn |
| Kare hızı: boşta / yürürken (müzikle) | 52–59 / 57–59 fps | 11–19 / 7–11 fps |
| Oyun zamanı / gerçek zaman: boşta / yürürken | 0,99–1,00 / 1,00–1,01 | 0,94–1,00 / 0,81–0,96 |

WebGL sütunu, GPU'suz bir kapsayıcıdaki yazılımsal GL'yi gösterir; gerçek bir
GPU'daki performansı temsil etmez. Oyun her fizik adımını en fazla 1/30 sn
ile sınırlar; kare hızı bunun altına düşünce oyun zamanı gerçek zamanın
gerisinde kalır. `dist/` toplam 1,7 MB.

## QA sırasında bulunan ve oyunda düzeltilen sorunlar

| Sorun | Düzeltme |
| --- | --- |
| Anı taşları (05) zeminden düşebiliyordu; ikinci taş rafı oluşmadan düşüyordu | Taşlar statik zeminle çarpışan gövdeler; ikinci taş rafı oluşana kadar bekler |
| 06'da ata sağ taraftan ulaşılamıyordu | Eksik basamak eklendi |
| 07'de at küçük bir tümsekte takılabiliyordu | Engelde otomatik küçük sıçrama |
| Anı istasyonu / şarkı / belge panelleri yavaş karelerde tuşları kaçırabiliyordu | Kare farkında tuş basışları ve sıralı panel tuş işleyicileri |
| 11'de ok tuşu iki kez sayılabiliyordu | Tek tüketim |
| 12'de son sayfa istemi başka bir istemin altında kalıyordu | İstem koşulu düzeltildi |
| İpucu düğmesi takılmalardan sonra erken görünebiliyordu | İlerleme saati oyun zamanına bağlandı |
| Canvas çizicisinde geçiş perdesi beyaz görünüyordu | Perde dolu bir dikdörtgen olarak çiziliyor |
| Yükleme: Phaser'ın `CanvasTexture`'ı her atlas sayfasının ve oda katmanının tüm piksellerini geri okuyordu (`getImageData`) | Tuvaller düz doku olarak ekleniyor |
| Yükleme: çizim tuvalleri GPU'da tutulduğundan yazılımsal GPU'da ilk kare ~13 sn donuyordu | Çizim tuvalleri bellekte (`willReadFrequently`) tutuluyor |
| Anı çizimlerinin arka planda PNG'ye çevrilmesi oyun sırasında 300–500 ms takılmalar yaratıyordu | Arka plan dönüştürmesi kaldırıldı |
| Yavaş karelerde kısa bir yön basışı hiç algılanmayabiliyordu (dönülemiyordu) | İki güncelleme arasında basılıp bırakılan yön, sonraki güncellemede bir kez sayılıyor (birim testi var) |
| "Rezonans" istemi tehlike 230 px içindeyken görünüyor, ama darbe yalnızca 115 px'e ulaşıyordu: istem görünürken basmak hiçbir şey yapmıyordu | İstem yalnızca darbe gerçekten bir şeyi dağıtacaksa görünüyor; saldıran wisp'lere erişim 55 px daha geniş |
| Kristal tünelinin halka çizgileri Canvas çizicisinde kare hızını ~%30 düşürüyordu | Halkalar yalnızca WebGL'de; Canvas'ta tünel yalnızca kristallerle çiziliyor |
| `blob:` görsellerini yasaklayan bir içerik güvenlik politikası (CSP) altında çizimler yüklenemezdi | `data:` URL yedeği; `img-src 'self' data:` politikasıyla yerelde denendi: menü tüm çizimlerle açıldı, sayfa hatası yok |
| Cihaz döndürülünce oyun görüntüsü yeni boyuta uymuyordu (Phaser'ın `refresh()`'i son ölçülen boyutu kullanıyor; düzen testi yakaladı) | Döndürmede önce kapsayıcı yeniden ölçülüyor |
| Dik ekranda diyalog kutusu altyazıların üstüne biniyordu | Diyalog açıkken altyazı ve bildirim yığını gizleniyor |
| Dik ekranda Anılar sayfası tek sütuna çöküyordu (genişlik kendine bağlıydı) | Genişlikler ekran genişliğinden hesaplanıyor |
| Dik ekranda ana menü resminin kenarı düğmelerin ortasından geçiyordu | Başlık resmin üstünde, düğmeler altında; resmin kenarları sayfaya yumuşakça karışıyor (test var) |
| Müzik: motifin son notası bir es olduğunda "değişiklik" esin üstüne eklenip melodiyi aralığın çok dışına atıyordu (birim testi yakaladı) | Değişiklik son çalınan notaya uygulanıyor; melodi her durumda aralığına sıkıştırılıyor |
| Müzik: bazı akorlarda sol ele eklenen "dokuzlu" küçük dokuzlu (ör. Mi üzerinde Fa) olup sert tınlıyordu | Yalnızca büyük dokuzlu ekleniyor (birim testi var) |
| Müzik: akor sesine yerleşirken melodi hareketin tersine dönüp aynı notayı tekrarlayabiliyordu | Yerleşme hareket yönünde yapılıyor |

Yükleme düzeltmelerinin etkisi (aynı ölçüm betiği, SwiftShader bayraklarıyla,
Canvas çizici, r03): odanın oynanabilir olması ~30 sn'den ~3 sn'ye indi.

## Kullanıcı geri bildirimiyle yapılan değişiklikler

| Geri bildirim | Değişiklik | Doğrulama |
| --- | --- | --- |
| Dik tutulan telefonda altyazılar görüntünün üstünde/ortasındaydı | Dik ekranda oyun görüntüsü üstte tam genişlikte; altyazı, bildirim, hedef ve diyalog hemen altında; kontroller en altta | Düzen testi (dikey boyutlar), ekran görüntüsü 10 |
| Yazılar bilgisayarda büyüktü; ekran yönü boyutu etkilememeli | Tek bir arayüz ölçeği: 1280×720'de 1, pencereyle orantılı, yönden bağımsız; başlık, düğme, altyazı ve panel yazıları küçültüldü | Ekran görüntüleri 01, 09, 10 |
| "Yeni Oyun" düğmesi bile ekrana sığmıyordu | Menüler her boyuta sığıyor: kısa ekranlarda iki sütun, gerektiğinde kaydırma; dik ekranda düğmeler resmin altında | Menü sığma testi (6 boyut) |
| "Cihazınızı yatay çevirin" uyarısı | Kaldırıldı; oyun iki yönde de oynanır, yatay kilit denenmez | Dik telefonda tam kampanya |
| 2.5D'de sandığın önünden zıplamadan geçilemiyordu (ilk oda) | İlk odadaki oyuncak küpler ve sandık arka duvarın önünde duruyor: Gorti önlerinden yürüyor, istenirse üstlerine çıkılabiliyor; pencere yerden incelenebiliyor | İlk oda testi (zıplamadan pencereye yürür), üç kampanya |
| Arka planda güzel bir piyano müziği; ayrı bir modül, açık kaynak üretici ve lisans klasörlü kütüphane | `src/music/` modülü: üretken piyano bestecisi ve sentez piyano; `music/` kütüphanesi (`tracks/`, `licenses/`, `tracks.json`), derlemede lisans denetimi | Müzik bölümü |

Diğer odalardaki basamak ve tepeler (ör. 06'daki yosunlu tepe, 11'deki
metal merdiven) arazinin parçası olan platform bölümleridir ve zıplama
gerektirmeye devam eder.

## Test düzeneğinde yapılan değişiklikler (oyunu etkilemez)

- Oynanış testleri SwiftShader olmadan çalışıyor. SwiftShader'ın yazılımsal
  birleştiricisi telefon emülasyonunda düzenli olarak 250–450 ms'lik kare
  boşlukları yaratıyordu: 18 fps, oyun zamanı gerçek zamanın ~%70'i.
  Varsayılan ayarlarla 48 fps ve boşluk yok.
- Bot:
  - zıplama tuşunu sabit bir süre yerine yükseliş bitene kadar (oyun
    zamanına göre) tutuyor;
  - dar çıkıntılarda kenara yakın kalkış yapıyor;
  - wisp'i zıplamadan önce Rezonans ile dağıtıyor;
  - dokunmatik modda sabit düğmelerin konumunu önbellekte tutuyor.
- `PHONE_UPRIGHT=1`, telefon testlerini ve dokunmatik kampanyayı telefon dik
  tutulmuş olarak (412×915) çalıştırır.
- İlk odanın bot rotası artık oyuncak küplerin ve sandığın önünden yürüyor.

## Test edilmeyenler ve bilinen sınırlamalar

- Gerçek telefon/tablet, iOS Safari, Android Chrome, Firefox ve fiziksel
  dokunmatik ekran; gerçek bir GPU ile WebGL performansı.
- Ses efektleri ve piyano Web Audio ile sentezlenir; kulakla kalite kontrolü
  yapılmadı. Yalnızca hatasız çalıştıkları ve seviyeleri ölçüldü.
- Kütüphane şu an boş. Kayıt çalma yolu tarayıcı testinde üretilmiş bir WAV
  tonuyla denendi; gerçek mp3 parçalar ve çevrimiçi (`url`) akış denenmedi.
- Ekran okuyucularla erişilebilirlik testi yapılmadı.
- Tam ekran gerçek bir mobil tarayıcıda denenmedi (headless tarayıcı
  desteklemez; oyun desteklenmediğinde normal pencerede devam eder).
- Canvas yedek çizicisinde kristal tünelinin halka çizgileri çizilmez.
- GitHub Pages sitesi (https://mizyaz.github.io/Nyluma-game/) bu kapsayıcıdan
  açılamadı (ağ politikası izin vermiyor). Yayının durumu GitHub Actions
  sonuçlarından okundu.
