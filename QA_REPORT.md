# QA raporu — Kristaller Dünyası — 14. Oda

Bu rapor yalnızca gerçekten çalıştırılan kontrolleri ve bunların sonuçlarını
listeler. Ölçümler aşağıdaki test ortamında alınmıştır; gerçek cihaz
performansını temsil etmez. Sonuçlar `22d984d` commit'indeki oyun kodu
içindir. Bu raporu ekleyen commit yalnızca bu dosyayı değiştirir.

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
| `npm run typecheck` (TypeScript strict, testler dahil) | Hatasız |
| `npm test` (Vitest) | 9 dosya, 82 test — hepsi geçti |
| `npm run build` | Başarılı (boyutlar aşağıda) |
| Tarayıcı testleri (`--grep-invert @campaign`) | 18/18 geçti, 3,4 dk (13 test atlandı: 12 ekran görüntüsü testi `SHOTS`, 1 geliştirici rota testi `DEV_ROUTE` olmadan çalışmaz) |
| Tam kampanya — yalnızca klavye (masaüstü 1280×720) | **Geçti**, 6,3 dk |
| Tam kampanya — yalnızca dokunmatik, telefon yatay (915×412) | **Geçti**, 7,2 dk |
| Tam kampanya — yalnızca dokunmatik, telefon dik (412×915) | **Geçti**, 6,6 dk |
| Referans ekran görüntüleri (WebGL) | 12/12 alındı, 2,8 dk (`qa/screenshots/`) |
| Temiz klon: `npm ci` → typecheck → test → build | Geçti (ayrıntı aşağıda) |
| GitHub Pages yayını | `22d984d` için "Deploy to GitHub Pages" (#6) ve "pages build and deployment" (#5, "Publish 22d984d") iş akışları başarılı; site bu kapsayıcıdan açılamadı (ağ politikası) |

## Bu sürümde değişenler

Oyun bir deneyime dönüştü (kullanıcı geri bildirimi, aşağıda):

- can değeri, tehlikeler (dikenler, kristal kırıkları, kırbaçlar, wisp'ler) ve
  hasar kaldırıldı;
- görevler, hedef kutusu, ipucu düğmesi, bulmacalar ve yetenekler (nefes,
  biçim değiştirme, balina dili şarkısı, köke uzanma) kaldırıldı;
- 12 odanın her sahnesi Gorti bir yere vardığında kendiliğinden başlıyor ve
  her oda hep geçilebiliyor;
- zıplama baştan sona canlandırıldı;
- Gorti daha ifadeli: şekil değiştiren siyah gözler ve ağız, kırpışma, yaylanan
  dal saçları, bekleme hareketleri, yakındaki şeylere bakma;
- arada bir kendiliğinden gelen renk bombardımanı eklendi.

Tarayıcı testleri bu tasarıma göre yeniden yazıldı. Kaldırılan özellikleri
denetleyen testler çıkarıldı; renk bombardımanı için yeni bir test ve
animasyon için yeni birim testleri eklendi.

## Temiz klon

Commit edilmiş depo (`22d984d`) yeni bir dizine klonlandı. CI ile aynı npm
sürümüyle (10.9.7) sırayla şunlar çalıştırıldı:

- `npm ci`: kilit dosyasından 51 paket; `npm audit` 0 açık buldu.
- `npm run typecheck`: hatasız.
- `npm test`: 9 dosya, 82 test geçti.
- `npm run build`: başarılı.

Üretilen 8 dosya, çalışma dizinindeki derlemeyle bayt bayt aynıydı (SHA-256):

| Dosya | Boyut | gzip |
| --- | --- | --- |
| `index-CODKHCv1.js` | 459,38 kB | 163,33 kB |
| `phaser-DOFALNY7.js` | 1.207,94 kB | 332,12 kB |
| `index-DLleC7pW.css` | 17,64 kB | 4,68 kB |

`dist/` toplam 1,7 MB. Oyun kodu, kaldırılan özellikler yüzünden önceki
sürümden (506,20 kB) küçüldü.

## Tarayıcı testleri

`npm run test:e2e` (üretim derlemesi `dist/` ve e2e derlemesi `dist-e2e/`
yerel HTTP sunucularından):

| Test | Proje | Süre |
| --- | --- | --- |
| Alan adı kökünde açılış: eksik dosya, konsol hatası, 4xx yok | webgl | 5,9 sn |
| `/kristaller-dunyasi/` alt yolunda açılış (GitHub Pages proje sitesi gibi) | webgl | 7,7 sn |
| İlk odada yürüme, değişken yükseklikte zıplama, inceleme; oyuncak küplerin ve sandığın önünden zıplamadan pencereye yürüyüp inceleme | desktop | 12,6 sn |
| Duraklatma/devam; pencere odağı kaybında tutulan tuşların bırakılması | desktop | 5,6 sn |
| Kontrol noktasında kayıt, yeniden yükleme ve Devam Et | desktop | 12,6 sn |
| Ana menü ve duraklatma menüsündeki her düğme (duraklatmada yalnızca Devam, Anılar, Ayarlar, Ana Menü) | desktop | 7,3 sn |
| Ayarların yeniden yüklemeden sonra korunması; kaldırılan "Nefes (odak)" ve "Hikâye yardımı" ayarlarının olmaması | desktop | 5,0 sn |
| Bozuk kayıttan kurtulma; depolama olmadan oynama | desktop | 7,7 sn |
| Bölüm seçimiyle açık bir bölümü başlatma | desktop | 4,8 sn |
| Son ofis: kapı Gorti yaklaşınca açılır, son sayfalar masanın sonunda kendiliğinden açılır, "SATILDI" ve sabit son cümle | desktop | 45,8 sn |
| Renk bombardımanı: kendiliğinden gelir, Gorti'yi durdurmaz, biter ve yeniden gelir | desktop | 12,5 sn |
| İki parmakla aynı anda yürüme + zıplama; iptal her şeyi bırakır | desktop | 6,6 sn |
| Müzik: ilk tuşla menü piyanosu, oda değişince müzik değişimi, her cue'nun seviyesi | desktop | 9,4 sn |
| Müzik: kütüphanedeki kaydın çalınması, açılamayan kaydın piyanoya dönmesi | desktop | 3,3 sn |
| Ekran düzeni: yatayda DOM katmanı tuvalle hizalı, dikte görüntü üstte ve yazılar altında (8 boyut) | desktop | 8,8 sn |
| Ana menüdeki her düğme 6 boyutta ekranda; dikte düğmeler resmin altında | desktop | 14,5 sn |
| Telefon ekranında yalnızca dokunmatikle ilk oda (menü, oyun, duraklatma); ekranda yalnızca yön, Zıpla ve Eylem düğmeleri | desktop | 21,5 sn |
| Dokunmatik düğmeler 5 boyutta (dik ve yatay) çakışmıyor ve ekranda | desktop | 6,6 sn |

`webgl` projesi WebGL için SwiftShader bayraklarıyla, `desktop` projesi
Chromium'un varsayılan ayarlarıyla ve oyunun Canvas çizicisiyle (`?canvas=1`)
çalışır. Referans ekran görüntüsü testleri `SHOTS` ortam değişkeni olmadan
atlanır.

Renk bombardımanı testi `?bursts=fast` ile çalışır: ilk bombardıman oyun
başladıktan ~2 sn sonra, sonrakiler ~6 sn arayla gelir. Test şunları
doğrular:

- bombardımanın kendiliğinden başlaması ve katmanın görünmesi;
- bu sırada Gorti'nin kontrolünün sürmesi (60 px'ten fazla yürür, zıplar);
- bitince katmanın kalkması ve ikincisinin kendiliğinden gelmesi;
- konsol ya da sayfa hatası olmaması.

Ekran düzeni testleri şunları ölçer:

- tuvalin 16:9 kalması ve yatay kaydırma olmaması;
- dik ekranda oyun görüntüsünün tam genişlikte, 60 px'lik HUD bandının
  altında durması, altyazı ve bildirimlerin görüntünün altında kalması;
- yatayda DOM katmanının tuvalle hizalı olması;
- ana menüdeki her düğmenin 355×620, 412×915, 740×340, 915×412, 768×1024 ve
  1280×720 boyutlarında ekranın içinde kalması; dik ekranda hiçbir düğmenin
  resmin kenarına binmemesi;
- dokunmatik düğmelerin (yön, Zıpla, Eylem) 915×412, 740×340, 412×915,
  355×620 ve 320×568 boyutlarında birbirine binmemesi ve ekranın içinde
  kalması.

## Tam kampanya koşuları

Üç koşu da Yeni Oyun'dan son karta kadar oynar; oda atlama ya da durum yazma
yoktur. Bot, e2e derlemesindeki salt okunur durum sondasını okuyarak yalnızca
normal girdiler gönderir:

- klavye koşusunda tuş olayları (yürü, zıpla, E, Enter, Esc);
- dokunmatik koşularda Chrome DevTools Protokolü üzerinden gerçek dokunma
  olayları: ekrandaki yön düğmeleri, Zıpla ve Eylem; diyaloğa ve belgeye
  doğrudan dokunma.

Bot yürür, zıplar ve sahnelerin kendiliğinden oynamasını bekler (sabırsız bir
oyuncu gibi geç düğmesini basılı tutar). Renk bombardımanı normal sıklığında
açıktı; koşular sırasında piyano müziği de çalıyordu.

| Oda | Klavye | Dokunmatik, yatay | Dokunmatik, dik |
| --- | --- | --- | --- |
| 01 — 14. Oda | 14 sn | 16 sn | 16 sn |
| 02 — Fosil Kökler | 33 sn | 36 sn | 36 sn |
| 03 — Kristal Ağacın Odası | 26 sn | 31 sn | 29 sn |
| 04 — İlk Rüzgâr | 23 sn | 26 sn | 26 sn |
| 05 — Hatırlanan Bir Hayatın Ağırlığı | 28 sn | 28 sn | 29 sn |
| 06 — Orman Cevap Veriyor | 19 sn | 22 sn | 20 sn |
| 07 — Çiçeklenen Yolculuk (mor at) | 96 sn | 96 sn | 96 sn |
| 08 — Güneş | 29 sn | 30 sn | 29 sn |
| 09 — Serçe Açıklığı | 20 sn | 58 sn | 22 sn |
| 10 — Meşale ve Ters Anılar (iç koğuş) | 25 sn | 25 sn | 25 sn |
| 11 — Anahtar ve Kilit | 20 sn | 22 sn | 22 sn |
| 12 — Boş Masa | 33 sn | 33 sn | 34 sn |
| **Toplam test süresi** | **6,3 dk** | **7,2 dk** | **6,6 dk** |

Yatay dokunmatik koşuda 09 bir kez 58 sn sürdü; koşu günlüğü nedenini
göstermiyor. Aynı oda rotası ardından dokunmatikle üç kez ayrıca koşturuldu:
25,8 / 26,0 / 26,1 sn. Önceki sürümde (görevler ve bulmacalarla) aynı
kampanyalar 10,5–11,5 dakika sürüyordu. Her koşuda son kartta sabit cümle ("Gorti, içindeki tüm ruhların
sahipliğini kaybetmişti.") doğrulandı. Klavye koşusunda kayıttaki profil
(`endingSeen`, açılan bölümler 1–5), dokunmatik koşularda son karttan ana
menüye dönüş de doğrulandı. Konsol hatası, sayfa hatası ya da başarısız istek
yoktu.

Tek tek oda rotaları (`DEV_ROUTE=rNN npx playwright test devroute`) bu
sürümün testleri yazılırken 12 oda için hem klavyeyle hem dokunmatikle ayrıca
çalıştırıldı ve hepsi geçti.

## Animasyon ve ifade

- **Birim testleri** (`tests/unit/animation.test.ts`, 9 test) şunları
  denetler:
  - zıplamanın evreleri: çömelme (dizler bükük, kalça aşağıda), itiş (bacaklar
    düz, kollar yukarıda), yükselirken dizlerin giderek çekilmesi, tepede
    toplanma, düşerken bacakların uzanıp kolların kalkması;
  - inişin düşüşün sertliğiyle derinleşmesi ve sonra doğrulması;
  - duygulara göre göz ve ağız şekilleri (sevinç, şaşkınlık, kaygı), kırpışma,
    takımlı Gorti'nin yorgun yüzü, tepede sevinç, uzun düşüşte açılan gözler;
  - bekleme hareketlerinin bir süre durunca başlaması ve sırayla gelmesi;
  - her iskeletin her parçasının çizimde bulunması, Gorti'nin ve Korkak formun
    her göz ve ağız şeklinin var olması, dal saçlarının yaylı olması.
- **Görsel kontrol:**
  - Zıplamalar ekran görüntüsü akışı olarak kare kare incelendi: kök biçim
    (durarak ve koşarak) ve Mekanik form.
  - Yüz ifadeleri ve bekleme hareketleri geliştirici önizlemesinde yakından
    incelendi; 10–12. odalardaki formlar oyun içinde de incelendi.
  - Referans ekran görüntüsü 12, tepeye yakın bir zıplamayı gösterir.
- **Kare hızı:** Yeni iskelet parçaları ve yaylar Canvas çizicisinde kare
  hızını değiştirmedi (aşağıda).

## Müzik

Bu sürümde müzik modülü değişmedi. Arka plan müziği `src/music/`
modülünden gelir: tarayıcıda bestelenen ve sentezlenen piyano, ya da `music/`
kütüphanesindeki lisanslı kayıtlar.

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
- **Seviye ölçümü** (önceki sürümde, aynı modülle): Her cue'dan 12 saniye,
  varsayılan müzik ses düzeyinde `OfflineAudioContext` ile çizildi. Kırpılma
  yok:

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

## Referans ekran görüntüleri

`SHOTS=1 npx playwright test screenshots` (WebGL, SwiftShader; 11 dışında
renk bombardımanı kapalı, `?bursts=0`):

| Dosya | İçerik |
| --- | --- |
| `qa/screenshots/01-menu.jpg` | Ana menü |
| `qa/screenshots/02-root-forest.jpg` | Kök biçimindeki Gorti ormanda |
| `qa/screenshots/03-human-stones.jpg` | İnsan biçimi, anı taşlarının yanında |
| `qa/screenshots/04-ride.jpg` | Mor atla yolculuk |
| `qa/screenshots/05-sun.jpg` | Güneş arenası |
| `qa/screenshots/06-dormitory.jpg` | İç koğuş (Korkak Form, meşale) |
| `qa/screenshots/07-final-document.jpg` | Son belge ("SATILDI") |
| `qa/screenshots/08-crystal-tunnel.jpg` | Bölüm geçişindeki kristal tüneli |
| `qa/screenshots/09-phone-menu.jpg` | Dik telefonda ana menü (başlık resmin üstünde, düğmeler altında) |
| `qa/screenshots/10-phone-game.jpg` | Dik telefonda ilk oda: altyazı görüntünün altında, kontroller en altta |
| `qa/screenshots/11-colour-storm.jpg` | Renk bombardımanı: renk dalgası, yağan kristaller, şaşıran Gorti |
| `qa/screenshots/12-jump.jpg` | Zıplamanın tepesine yakın: dizler çekili, kollar açık, gözler sevinçle kavisli |

## Performans (bu ortamda)

Ölçüm `dist-e2e` derlemesiyle, 1280×720'de ve sayfa açılışından alındı;
makinede başka iş çalışmıyordu. r03 ve r06 odaları ikişer kez ölçüldü.
Yürüme ölçümünde ilk tuşla açılan piyano müziği de çalıyordu. Ölçümler,
duraklatmada parçacıkları da donduran son küçük değişiklikten hemen önceki
derlemeyle alındı; kare hızını etkileyen kod aynıdır.

Renk bombardımanı kapalıyken (`?bursts=0`):

| | Canvas çizici, Chromium varsayılan | WebGL, SwiftShader (yazılımsal GL) |
| --- | --- | --- |
| Çizimlerin atlasa dönüştürülmesi | 0,98–1,06 sn | 1,18–1,35 sn |
| Odanın oynanabilir olması | 2,7–2,9 sn | 3,7–4,1 sn |
| Kare hızı: boşta / yürürken (müzikle) | 54–59 / 55–59 fps | 10–20 / 8–11 fps |
| Oyun zamanı / gerçek zaman: boşta / yürürken | 1,00 / 1,00–1,01 | 0,87–1,03 / 0,87–0,97 |

Yeni iskelet parçaları (göz, ağız, dal saçları), yaylar ve zıplama evreleri
Canvas'ta önceki sürümle aynı aralıkta kaldı (önceki ölçüm: 52–59 / 57–59
fps).

Renk bombardımanı sık gelirken (`?bursts=fast`: ~6 sn'de bir, her biri
3,6 sn; ölçüm süresinin yarısından fazlasında bombardıman vardı):

| | Canvas çizici | WebGL, SwiftShader |
| --- | --- | --- |
| Kare hızı: boşta / yürürken | 43–54 / 43–53 fps | 10–20 / 8–12 fps |
| Oyun zamanı / gerçek zaman: boşta / yürürken | 1,00–1,01 / 1,00–1,01 | 0,58–0,65 / 0,74–0,82 |

Canvas'ta bombardımanın parçaları tek tek gizlenerek ölçüldü (r03, 14 sn,
0,25 sn'de bir okunan fps ortalaması):

| Durum | Ortalama | En düşük |
| --- | --- | --- |
| Hepsi | 49,6 fps | 44 fps |
| DOM katmanı (bulutlar ve dalga) olmadan | 55,1 fps | 53 fps |
| Renk dalgası olmadan | 52,1 fps | 50 fps |
| Bulutlar olmadan | 54,5 fps | 52 fps |

WebGL sütunları, GPU'suz bir kapsayıcıdaki yazılımsal GL'yi gösterir; gerçek
bir GPU'daki performansı temsil etmez. Bu ortamda WebGL'de bombardıman
sırasında oyun zamanı gerçek zamanın gerisinde kalıyor (oyun yavaşlıyor).
Oyun her fizik adımını en fazla 1/30 sn ile sınırlar; kare hızı bunun altına
düşünce oyun zamanı gerçek zamanın gerisinde kalır.

## QA sırasında bulunan ve oyunda düzeltilen sorunlar

Bu sürümde:

| Sorun | Düzeltme |
| --- | --- |
| Kesintisiz oynanan bir oyunda Gorti, 04'te insan olduktan sonra 05'e kök biçiminde giriyordu (yetenekler artık görevlerle kazanılmadığından; yeni oda rotaları yazılırken bulundu) | Odaya girerken hikâyenin o ana kadar ulaştığı yerin gerektirdiği yetenekler veriliyor; biçim korunuyor |
| Renk bulutları tek katmanda birleştirilince katmanın dikdörtgen kenarı görünüyordu (görsel kontrol) | Her renk bulutu katmanın içinde sönüyor |
| Renk bombardımanı Canvas çizicisinde kare hızını düşürüyordu; en büyük pay, görüntüyle ayrı ayrı karışan 10 bulut katmanınındı (katmanlar tek tek gizlenerek ölçüldü) | Bulutlar iki katmanda toplandı, parçacıklar azaltıldı (son ölçüm yukarıda) |

Önceki sürümlerde:

| Sorun | Düzeltme |
| --- | --- |
| 06'da ata sağ taraftan ulaşılamıyordu | Eksik basamak eklendi |
| 07'de at küçük bir tümsekte takılabiliyordu | Engelde otomatik küçük sıçrama |
| Belge paneli yavaş karelerde tuşları kaçırabiliyordu | Kare farkında tuş basışları ve sıralı panel tuş işleyicileri |
| Canvas çizicisinde geçiş perdesi beyaz görünüyordu | Perde dolu bir dikdörtgen olarak çiziliyor |
| Yükleme: Phaser'ın `CanvasTexture`'ı her atlas sayfasının ve oda katmanının tüm piksellerini geri okuyordu (`getImageData`) | Tuvaller düz doku olarak ekleniyor |
| Yükleme: çizim tuvalleri GPU'da tutulduğundan yazılımsal GPU'da ilk kare ~13 sn donuyordu | Çizim tuvalleri bellekte (`willReadFrequently`) tutuluyor |
| Anı çizimlerinin arka planda PNG'ye çevrilmesi oyun sırasında 300–500 ms takılmalar yaratıyordu | Arka plan dönüştürmesi kaldırıldı |
| Yavaş karelerde kısa bir yön basışı hiç algılanmayabiliyordu (dönülemiyordu) | İki güncelleme arasında basılıp bırakılan yön, sonraki güncellemede bir kez sayılıyor (birim testi var) |
| Kristal tünelinin halka çizgileri Canvas çizicisinde kare hızını ~%30 düşürüyordu | Halkalar yalnızca WebGL'de; Canvas'ta tünel yalnızca kristallerle çiziliyor |
| `blob:` görsellerini yasaklayan bir içerik güvenlik politikası (CSP) altında çizimler yüklenemezdi | `data:` URL yedeği; `img-src 'self' data:` politikasıyla yerelde denendi: menü tüm çizimlerle açıldı, sayfa hatası yok |
| Cihaz döndürülünce oyun görüntüsü yeni boyuta uymuyordu (Phaser'ın `refresh()`'i son ölçülen boyutu kullanıyor; düzen testi yakaladı) | Döndürmede önce kapsayıcı yeniden ölçülüyor |
| Dik ekranda diyalog kutusu altyazıların üstüne biniyordu | Diyalog açıkken altyazı ve bildirim yığını gizleniyor |
| Dik ekranda Anılar sayfası tek sütuna çöküyordu (genişlik kendine bağlıydı) | Genişlikler ekran genişliğinden hesaplanıyor |
| Dik ekranda ana menü resminin kenarı düğmelerin ortasından geçiyordu | Başlık resmin üstünde, düğmeler altında; resmin kenarları sayfaya yumuşakça karışıyor (test var) |
| Müzik: motifin son notası bir es olduğunda "değişiklik" esin üstüne eklenip melodiyi aralığın çok dışına atıyordu (birim testi yakaladı) | Değişiklik son çalınan notaya uygulanıyor; melodi her durumda aralığına sıkıştırılıyor |
| Müzik: bazı akorlarda sol ele eklenen "dokuzlu" küçük dokuzlu (ör. Mi üzerinde Fa) olup sert tınlıyordu | Yalnızca büyük dokuzlu ekleniyor (birim testi var) |
| Müzik: akor sesine yerleşirken melodi hareketin tersine dönüp aynı notayı tekrarlayabiliyordu | Yerleşme hareket yönünde yapılıyor |

Önceki sürümlerde bulunup düzeltilen ama o özellikler kaldırıldığı için artık
geçerli olmayan sorunlar (tehlikeler, Rezonans istemi, ipucu düğmesi, şarkı ve
anı bulmacası panelleri, 11'deki anahtar konsolu, 12'deki son sayfa istemi)
bu tablodan çıkarıldı.

## Kullanıcı geri bildirimiyle yapılan değişiklikler

| Geri bildirim | Değişiklik | Doğrulama |
| --- | --- | --- |
| "Zıplarken tam bir animasyon yok" | Zıplama baştan sona canlandırıldı. Evreler: çömelme ve itiş, yükselirken dizleri çekme, tepede kolları açıp süzülme, düşerken bacakları yere uzatma, inişte sertliğe göre derinleşen çökme. Gövde yaylı bir esneme ve basıklıkla sallanıyor; kalkışta toz ve kristal filizleri çıkıyor. Fizik aynı kaldı | Birim testleri; oyun içi kare kare ekran görüntüleri; ekran görüntüsü 12; üç kampanya |
| "Diken vb. gerek yok, can değerine de gerek yok" | Tehlikeler, hasar ve can (tutarlılık) göstergesi kaldırıldı. Düşünce Gorti son kontrol noktasında yeniden belirir | Üç kampanya; oda verisi testleri |
| "Gorti'nin karakter modelini daha ifadeli yap" | Şekil değiştiren siyah gözler: kırpışma, sevinç kavisi, şaşkınlıkta büyüme, yorgun göz kapağı, sıkıca kapanma. Ağız: konuşma, gülümseme, "o", sırıtma, diş sıkma, somurtma. Yaylanan dal saçları. Bekleme hareketleri: etrafa bakma, gerinip esneme, mırıldanıp sallanma, baş kaşıma. Yakındaki anılara ve incelenebilecek şeylere bakma; bombardımanda yukarı bakıp dans etme; at sıçrarken sevinme. Korkak form da aynı yüzü aldı; meşale alevi hareketi gecikerek izliyor | Birim testleri; önizleme ve oyun içi görsel kontrol |
| "Bir görev de olmasın, hep ilerleyebilelim" | Hedef kutusu, ipucu düğmesi, duraklatma menüsündeki "Hedef" ve görev metinleri kaldırıldı. 12 odanın her sahnesi Gorti bir yere vardığında kendiliğinden başlıyor; kapılar ve köprüler kendiliğinden açılıyor | Üç kampanya; menü testi (duraklatmada yalnızca Devam, Anılar, Ayarlar, Ana Menü) |
| "Random renk bombardımanı olsun bazen" | 30–70 sn'de bir (azaltılmış harekette 70–120 sn) kendiliğinden gelen bombardıman: renk bulutları, bir renk dalgası, her renkte yağan kristaller, çanlar. Yanıp sönme yok; her değişim en az üçte bir saniye sürüyor. Oyun duraklatılınca donuyor. E ile "Parılda" da rastgele renkte kristaller saçıyor | Renk bombardımanı testi; ekran görüntüsü 11; WebGL ve Canvas'ta görsel kontrol |
| "Bulmaca da yok, deneyim bu" | Balina dili şarkısı, anı istasyonu bulmacası, taş itme, nefes, biçim değiştirme ve köke uzanma kaldırıldı. Taşlar yerinde; ağaç, havuz, Güneş, anılar, anahtar ve kilit sahneleri kendiliğinden oynuyor; son sayfalar masanın sonunda kendiliğinden açılıyor. Ayarlardan "Nefes (odak)" ve "Hikâye yardımı" çıkarıldı | Üç kampanya; ayarlar testi; son ofis testi |
| Dik tutulan telefonda altyazılar görüntünün üstünde/ortasındaydı | Dik ekranda oyun görüntüsü üstte tam genişlikte; altyazı, bildirim ve diyalog hemen altında; kontroller en altta | Düzen testi (dikey boyutlar), ekran görüntüsü 10 |
| Yazılar bilgisayarda büyüktü; ekran yönü boyutu etkilememeli | Tek bir arayüz ölçeği: 1280×720'de 1, pencereyle orantılı, yönden bağımsız | Ekran görüntüleri 01, 09, 10 |
| "Yeni Oyun" düğmesi bile ekrana sığmıyordu | Menüler her boyuta sığıyor: kısa ekranlarda iki sütun, gerektiğinde kaydırma; dik ekranda düğmeler resmin altında | Menü sığma testi (6 boyut) |
| 2.5D'de sandığın önünden zıplamadan geçilemiyordu (ilk oda) | İlk odadaki oyuncak küpler ve sandık arka duvarın önünde; Gorti önlerinden yürüyor | İlk oda testi, üç kampanya |
| Arka planda güzel bir piyano müziği; ayrı bir modül, açık kaynak üretici ve lisans klasörlü kütüphane | `src/music/` modülü ve `music/` kütüphanesi | Müzik bölümü |

## Test düzeneğinde yapılan değişiklikler (oyunu etkilemez)

- Oda rotaları yeniden yazıldı. Bot yalnızca yürüyor, zıplıyor, isterse E ile
  inceliyor ve sahneleri bekliyor. Bir yüzey zincirinde kalkış ve hedef
  noktalarıyla sıçrıyor; düşerse bulunduğu yerden yeniden planlıyor.
- `?bursts=0` renk bombardımanını kapatır (ekran görüntüleri), `?bursts=fast`
  sık getirir (bombardıman testi). E2E sondası bombardıman sayısını ve
  durumunu da raporlar.
- `SHOTS_DIR`, ekran görüntülerini başka bir klasöre yazar. `DEV_FORM`, tek
  oda rotasını belirli bir biçimle başlatır.
- Oynanış testleri SwiftShader olmadan çalışıyor (yazılımsal birleştirici
  telefon emülasyonunda kare boşlukları yaratıyordu).
- `PHONE_UPRIGHT=1`, telefon testlerini ve dokunmatik kampanyayı telefon dik
  tutulmuş olarak (412×915) çalıştırır.

## Test edilmeyenler ve bilinen sınırlamalar

- Gerçek telefon/tablet, iOS Safari, Android Chrome, Firefox ve fiziksel
  dokunmatik ekran; gerçek bir GPU ile WebGL performansı.
- Renk bombardımanı yanıp sönmeden kaçınacak biçimde tasarlandı (her renk
  değişimi en az üçte bir saniye); ışığa duyarlılık açısından bir uzman
  değerlendirmesi yapılmadı. Azaltılmış hareket açıkken daha seyrek ve sakin.
- Renk bombardımanı sırasında GPU'suz bu ortamda kare hızı düşüyor (yukarıda).
  GPU'lu cihazlarda ölçülmedi.
- Ses efektleri ve piyano Web Audio ile sentezlenir; kulakla kalite kontrolü
  yapılmadı. Yalnızca hatasız çalıştıkları ve seviyeleri ölçüldü.
- Müzik kütüphanesi şu an boş. Kayıt çalma yolu tarayıcı testinde üretilmiş
  bir WAV tonuyla denendi; gerçek mp3 parçalar ve çevrimiçi (`url`) akış
  denenmedi.
- Ekran okuyucularla erişilebilirlik testi yapılmadı.
- Tam ekran gerçek bir mobil tarayıcıda denenmedi (headless tarayıcı
  desteklemez; oyun desteklenmediğinde normal pencerede devam eder).
- Canvas yedek çizicisinde kristal tünelinin halka çizgileri çizilmez.
- GitHub Pages sitesi (https://mizyaz.github.io/Nyluma-game/) bu kapsayıcıdan
  açılamadı (ağ politikası izin vermiyor). Yayının durumu GitHub Actions
  sonuçlarından okundu.
