# QA raporu — Kristaller Dünyası — 14. Oda

Bu rapor yalnızca gerçekten çalıştırılan kontrolleri ve bunların sonuçlarını
listeler. Ölçümler aşağıdaki test ortamında alınmıştır; gerçek cihaz
performansını temsil etmez.

## Test ortamı

| | |
| --- | --- |
| İşletim sistemi | Linux x86_64 (bulut kapsayıcısı), 4 vCPU, 16 GB RAM, **GPU yok** |
| Node.js / npm | 22.22.2 / 10.9.7 |
| Tarayıcı | Playwright 1.56.1 ile Chromium 141.0.7390.37 (headless shell) |
| WebGL | ANGLE + SwiftShader (yazılımsal); gerçek bir GPU yok |
| Cihaz emülasyonu | Masaüstü 1280×720; telefon: 915×412 yatay, `isMobile`, `hasTouch`, DPR 2 |

Gerçek telefon/tablet, Safari, Firefox ve fiziksel dokunmatik ekran bu
ortamda **test edilmedi**.

## Özet

| Kontrol | Sonuç |
| --- | --- |
| `npm run typecheck` (TypeScript strict) | Hatasız |
| `npm test` (Vitest) | 7 dosya, 49 test — hepsi geçti |
| `npm run build` | Başarılı (boyutlar aşağıda) |
| Tarayıcı testleri (`--grep-invert @campaign`) | 13/13 geçti, 2,7 dk |
| Tam kampanya — yalnızca klavye (masaüstü 1280×720) | **Geçti**, 11,9 dk |
| Tam kampanya — yalnızca dokunmatik (telefon 915×412) | **Geçti**, 11,6 dk |
| Referans ekran görüntüleri (WebGL) | 8/8 alındı (`qa/screenshots/`) |
| Temiz klon: `npm ci` → typecheck → test → build | Geçti (ayrıntı aşağıda) |

Tüm sonuçlar aynı son kaynak ağacı üzerinde alındı.

## Temiz klon

Commit edilmiş depo yeni bir dizine klonlandı ve sırayla çalıştırıldı:
`npm ci` (kilit dosyasından 50 paket), `npm run typecheck` (hatasız),
`npm test` (7 dosya, 49 test geçti), `npm run build` (başarılı). Üretilen
dosya adları (içerik özetleri) çalışma dizinindeki derlemeyle aynıydı:
`index-DcJhQoAH.js` 490,83 kB (gzip 171,65 kB), `phaser-DOFALNY7.js`
1.207,94 kB (gzip 332,12 kB), `index-Dh0_ky7F.css` 18,89 kB (gzip 4,54 kB).

## Tarayıcı testleri

`npx playwright test --grep-invert @campaign` (üretim derlemesi `dist/` ve
e2e derlemesi `dist-e2e/` yerel HTTP sunucularından):

| Test | Proje | Süre |
| --- | --- | --- |
| Alan adı kökünde açılış: eksik dosya, konsol hatası, 4xx yok | webgl | 6,2 sn |
| `/kristaller-dunyasi/` alt yolunda açılış (GitHub Pages proje sitesi gibi) | webgl | 9,5 sn |
| İlk odada yürüme, değişken yükseklikte zıplama, inceleme | desktop | 8,0 sn |
| Duraklatma/devam; pencere odağı kaybında tutulan tuşların bırakılması | desktop | 5,9 sn |
| Kontrol noktasında kayıt, yeniden yükleme ve Devam Et | desktop | 13,2 sn |
| Ana menü ve duraklatma menüsündeki her düğme | desktop | 8,1 sn |
| Ayarların yeniden yüklemeden sonra korunması | desktop | 5,6 sn |
| Bozuk kayıttan kurtulma; depolama olmadan oynama | desktop | 8,1 sn |
| Bölüm seçimiyle açık bir bölümü başlatma | desktop | 4,7 sn |
| Son ofis: satış belgesi ve sabit son cümle | desktop | 51,7 sn |
| İki parmakla aynı anda yürüme + zıplama; iptal her şeyi bırakır | desktop | 6,8 sn |
| Yeniden boyutlandırmada DOM katmanı ile tuvalin hizalı kalması | desktop | 7,1 sn |
| Telefon ekranında yalnızca dokunmatikle ilk oda (menü, oyun, duraklatma) | desktop | 24,6 sn |

`webgl` projesi WebGL için SwiftShader bayraklarıyla, `desktop` projesi
Chromium'un varsayılan ayarlarıyla ve oyunun Canvas çizicisiyle (`?canvas=1`)
çalışır.

## Tam kampanya koşuları

Her iki koşu da Yeni Oyun'dan son karta kadar oynar; oda atlama ya da durum
yazma yoktur. Bot, e2e derlemesindeki salt okunur durum sondasını okuyarak
yalnızca normal girdiler gönderir: klavye koşusunda tuş olayları, dokunmatik
koşuda Chrome DevTools Protokolü üzerinden gerçek dokunma olayları (ekrandaki
yön düğmeleri, Zıpla/Eylem/Nefes/Biçim/Şarkı düğmeleri, şarkı ve anı
panellerine, diyaloğa ve belgeye doğrudan dokunma). Son koşularda bot hiçbir
aşamayı yeniden denemek zorunda kalmadı.

| Oda | Klavye | Dokunmatik |
| --- | --- | --- |
| 01 — 14. Oda | 42 sn | 19 sn |
| 02 — Fosil Kökler | 62 sn | 67 sn |
| 03 — Kristal Ağacın Odası | 57 sn | 73 sn |
| 04 — İlk Rüzgâr | 144 sn | 145 sn |
| 05 — Hatırlanan Bir Hayatın Ağırlığı | 48 sn | 35 sn |
| 06 — Orman Cevap Veriyor | 34 sn | 39 sn |
| 07 — Çiçeklenen Yolculuk (mor at) | 96 sn | 97 sn |
| 08 — Güneş | 91 sn | 75 sn |
| 09 — Serçe Açıklığı | 24 sn | 25 sn |
| 10 — Meşale ve Ters Anılar (iç koğuş) | 38 sn | 38 sn |
| 11 — Anahtar ve Kilit | 28 sn | 32 sn |
| 12 — Boş Masa | 40 sn | 42 sn |
| **Toplam test süresi** | **11,9 dk** | **11,6 dk** |

Her iki koşuda da son kartta sabit cümle ("Gorti, içindeki tüm ruhların
sahipliğini kaybetmişti.") doğrulandı; klavye koşusunda kayıttaki profil
(`endingSeen`, açılan bölümler 1–5), dokunmatik koşuda son karttan ana menüye
dönüş de doğrulandı. Konsol hatası, sayfa hatası ya da başarısız istek yoktu.

## Referans ekran görüntüleri

`SHOTS=1 npx playwright test screenshots` (WebGL, SwiftShader), son derleme:

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

## Performans (bu ortamda)

`dist-e2e` derlemesi, 1280×720, sayfa açılışından ölçüldü:

| | Canvas çizici, Chromium varsayılan | WebGL, SwiftShader (yazılımsal GL) |
| --- | --- | --- |
| Çizimlerin atlasa dönüştürülmesi | 1,25–1,29 sn | 1,5–1,8 sn |
| Odanın oynanabilir olması (r03, r06) | 3,2–3,5 sn | 5,0 sn |
| Kare hızı (boşta / yürürken) | 45–53 / 44–55 fps | 14–18 / 10 fps |
| Oyun zamanı / gerçek zaman | 1,0 | 0,48–0,68 (yazılımsal GL sınırı) |

WebGL sütunu GPU'suz bir kapsayıcıdaki yazılımsal GL'yi gösterir; gerçek bir
GPU'daki performansı temsil etmez. `dist/` toplam 1,7 MB (boyutlar
yukarıda, "Temiz klon").

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

Yükleme düzeltmelerinin etkisi (aynı ölçüm betiği, SwiftShader bayraklarıyla,
Canvas çizici, r03): odanın oynanabilir olması ~30 sn'den ~3 sn'ye indi.

## Test düzeneğinde yapılan değişiklikler (oyunu etkilemez)

- Oynanış testleri artık SwiftShader olmadan çalışıyor: SwiftShader'ın
  yazılımsal birleştiricisi telefon emülasyonunda düzenli 250–450 ms'lik kare
  boşlukları yaratıyordu (18 fps, oyun zamanı gerçek zamanın ~%70'i);
  varsayılan ayarlarla 48 fps ve boşluk yok.
- Bot zıplama tuşunu sabit bir süre yerine yükseliş bitene kadar (oyun
  zamanına göre) tutuyor, dar çıkıntılarda kenara yakın kalkış yapıyor,
  wisp'i zıplamadan önce Rezonans ile dağıtıyor ve dokunmatik modda sabit
  düğmelerin konumunu önbellekte tutuyor.

## Test edilmeyenler ve bilinen sınırlamalar

- Gerçek telefon/tablet, iOS Safari, Android Chrome, Firefox ve fiziksel
  dokunmatik ekran; gerçek bir GPU ile WebGL performansı.
- Sesler ve müzik Web Audio ile sentezlenir; kulakla kalite kontrolü
  yapılmadı (yalnızca hatasız çalıştıkları doğrulandı).
- Ekran okuyucularla erişilebilirlik testi yapılmadı.
- Tam ekran ve yatay yöne kilitleme gerçek bir mobil tarayıcıda denenmedi
  (headless tarayıcı bunları desteklemez; oyun desteklenmediğinde normal
  pencerede devam eder).
- Canvas yedek çizicisinde kristal tünelinin halka çizgileri çizilmez.
- GitHub Pages yayını yapılmadı: hedef depo bu oturumdan oluşturulamadı ya da
  erişilemedi (bkz. README, "GitHub Pages").
