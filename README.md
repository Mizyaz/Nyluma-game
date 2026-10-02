# Kristaller Dünyası — 14. Oda

Tarayıcıda oynanan, el çizimi / cel-shaded görünümlü, 2.5B yan kaydırmalı
gerçeküstü bir macera: her oda önü yırtık bir kâğıt kutudur ve oyunun kendi
çizimleri bu kutuda, kendi derinliklerinde duran kartonlar olarak sahnelenir. Beş bölüm ve on iki oda boyunca Gorti Evaskinan'ın
382. Dünya'daki yolculuğu: 14. Oda'dan yüzeye, mor atla Güneş'e, iç koğuşa ve
boş masadaki hak aktarımına.

> **Oyna:** https://mizyaz.github.io/Nyluma-game/

Tüm oyun içi metinler Türkçedir. Oyun tamamen statik dosyalardan çalışır:
sunucu, hesap, çevrim içi hizmet ya da dış kaynak (CDN, yazı tipi, ses) yoktur.

## Deneyim

Oyun bir deneyimdir: can değeri, diken ya da tehlike, görev, hedef ya da
bulmaca yoktur; her odada hep ilerlenebilir. Yürümek yeter: her oda tek bir
zeminde baştan sona yürünür, zıplamak hiçbir yerde gerekmez (ama keyfe göre
zıplanır); hikâyenin sahneleri Gorti bir yere vardığında kendiliğinden başlar. Bazı
şeylerin yanında E ile incelemek mümkündür ama zorunlu değildir.

Başka bir yerde E, **Rezonans** hareketini yapar. Hareket Gorti'nin biçimine
göre değişir ve hikâye ilerledikçe büyür:

- Kök biçimindeki Gorti topraktan çiçekler açtırır, çiçeklerden kuşlar uçar.
  İlk odada bir çiçek ve bir kuştur. Ay ile Güneş'in ağacından (Bölüm I'in
  sonu) itibaren bir çiçek yelpazesi ve küçük bir sürü olur. Mor atın doğduğu
  ormandan (Bölüm II'nin sonu) itibaren bir çiçek tarhı, büyük bir sürü ve
  renkli kristaller olur.
- Sivaslı amca biçimindeki Gorti yere basar: zemin sarsılır, parlayan
  çatlaklar yayılır. Ulu Ay'ın odasından itibaren arkasında Ay yükselir ve
  ona bakar. Mor atın doğduğu ormandan itibaren yerden bir mor at çıkar,
  şahlanır ve dörtnala uzaklaşır.
- Diğer formlar etrafa her renkte kristaller saçar.

Her bölümün başında duvarda ya da bir şövalede Gorti'nin hayatından bir
**tablo** durur (at yolculuğu durmadığı için Bölüm III'te Güneş'in alanında):

- yer altındaki 14. Oda (House of The Stranger);
- Sivaslı amcanın ay hâli;
- ergenliği (Late to Work);
- savaşçı hâli.

Son bölümde dördü birden ofis koridorunun duvarında asılıdır. Tablonun
önünde E'ye basınca resim büyük gösterilir. Altında "Gorti geleceğine ve
geçmişine bakış attı." yazar.

Hikâyenin önemli konuşmaları **yüz animasyonlu sahnelerle** oynanır: siyah
bantlar kapanır, oda kararır ve konuşanlar diyalog kutusunun üstündeki
çerçevelerde yakından görünür. Konuşanın çerçevesi aydınlanır; ağzı, gözleri
ve kaşları sözlerle birlikte oynar, ünlemle biten satırlarda bağırır.
Dinleyenler karanlıkta kalır. Bu sahnelerde müzik gergin yaylılara döner
(bkz. Müzik).

Arada bir, kendiliğinden bir **renk bombardımanı** başlar: görüntü birkaç
saniye renk bulutları ve bir renk dalgasıyla dolar, her renkte kristaller
yağar, Gorti yukarı bakar ve sevinçle dans eder. (Ani yanıp sönme yoktur; her
renk değişimi en az üçte bir saniye sürer. Azaltılmış hareket açıkken daha
seyrek ve daha sakindir.)

Gorti istediği an zıplar (Boşluk, dokunmatikte Zıpla, oyun kumandasında alt
düğme). Zıplaması baştan sona canlandırılmıştır: çömelir, itilir ve gerilir,
yükselirken dizlerini çeker, tepede bir an kollarını açıp süzülür, düşerken
bacaklarını yere uzatır ve inişte düşüşün sertliğine göre esneyip toparlanır;
kalkışta ve inişte toz kalkar, hafif bir hop ve yumuşak bir tok ses duyulur.
Kenardan az önce düşmüşken basılan ya da yere inmeden az önce basılan zıplama
yine sayılır; tuş erken bırakılırsa zıplama kısalır. Derinlikte zıplarken
gölgesi kendi derinliğinde yerde kalır ve yükseldikçe küçülüp silikleşir. Her
beden (çocuk, genç, savaşçı, Sivaslı amca, korkak, mekanik) kendi
iskeletiyle zıplar; takım elbise zıplamaz. Zıplama hiçbir kapıyı, olayı ya da
sahneyi atlatmaz: kapalı bir kapı tavana kadar duvardır, havada geçilen bir
olay iniş anında başlar. Bütün sayıları `src/tuning.ts` dosyasındadır
(`JUMP.enabled` ile kapatılabilir).
Yüzü de canlıdır: siyah gözleri kırpışır, sevinçte kavislenir, şaşkınlıkta
büyür, yorgunlukta ağırlaşır; ağzı konuşur, gülümser, dişlerini sıkar. Dal
saçları hareketle yaylanıp sallanır. Bir süre durduğunda etrafına bakar,
gerinip esner, mırıldanarak sallanır ya da başını kaşır; yakındaki anılara ve
incelenebilecek şeylere göz atar.

## Kontroller

| Eylem | Klavye | Dokunmatik | Oyun kumandası |
| --- | --- | --- | --- |
| Yürü | A / D ya da ← / → | Sol alttaki yön kolunu sağa / sola it | Sol çubuk ya da yön tuşları |
| Derinlikte yürü (uzaklaş / yaklaş) | W / S ya da ↑ / ↓ | Yön kolunu yukarı / aşağı it | Sol çubuk ya da yön tuşları |
| Zıpla | Boşluk | Sağ alttaki Zıpla | Alt düğme (A / ✕) |
| İncele, Konuş, Yık (yakında bir şey varsa) / Rezonans | E | Zıpla'nın yanındaki eylem düğmesi | Sağ ya da sol düğme (B / ○, X / □) |
| Biçim değiştir (öğrenildikten sonra) | R | Biçim | Üst düğme (Y / △) |
| Duraklat / geri | Esc | Sağ üstteki ⏸ | Start |
| Anılar | M | Duraklatma menüsü | Select |
| Menü seçimi | Enter | Dokun | Alt düğme |
| Diyaloğu ilerlet | Boşluk / E | Diyalog kutusuna dokun | Alt düğme |
| Ara sahneyi geç | Boşluk / E / Enter basılı tut | Zıpla, eylem düğmesi ya da diyalog kutusunu basılı tut | Alt düğmeyi basılı tut |
| Tam ekran | — | Sağ üstteki ⛶ (dokunmatik cihazlarda oyun başlarken otomatik denenir) | — |

Tuşlar, oyun kumandası düğmeleri, ölü bölgeler ve dokunmatik kontrollerin
boyutları da `src/tuning.ts` dosyasındadır.

**Mobil:** Oyun baştan sona yalnızca dokunmatikle oynanabilir. Sol altta
kâğıttan bir yön kolu durur: başparmak kadranın üstünde kaydıkça topuz onu
izler; sağa sola itmek yürütür, yukarı aşağı itmek (biraz daha kararlı bir
itişle) derinlikte yürütür, bırakınca topuz yerine yaylanır. Sağ altta,
başparmağın altında Gorti'nin zıplayışı çizili büyük Zıpla düğmesi, yanında
eylem düğmesi durur: yakında bir şey varsa büyüteç (İncele), konuşma balonu
(Konuş) ya da yarık kristal (Yık), yoksa yıldız (Rezonans) gösterir. Biçim
gibi düğmeler hikâyede öğrenildikçe aynı yayın üzerinde belirir. İki
başparmak aynı anda kullanılabilir (ör. yürürken zıplamak ya da incelemek);
destekleyen cihazlarda düğmeler hafifçe titreşir (azaltılmış harekette
titremez). Ayarlar'daki **Dokunmatik düzen** (Sağlak / Solak) kontrolleri
aynalar. Dokunmatik cihazlarda ekrandaki yönergeler tuş adları yerine bu
kontrollerin adlarıyla gösterilir.
Cihaz dik ya da yatay tutulabilir: dik tutulduğunda oyun görüntüsü üstte tam
genişlikte, altyazılar ve diyaloglar hemen altında, kontroller en altta durur;
yatay tutulduğunda oyun ekranı doldurur ve altyazılar görüntünün altında
gösterilir. Tarayıcı destekliyorsa oyun başlarken tam ekrana geçer.

Menüler klavyeyle (↑ ↓, Enter, Esc) ve fareyle kullanılabilir. Ayarlar'da ses
seviyeleri, azaltılmış hareket, ekran sarsıntısı, metin hızı (anında dahil),
dokunmatik kontroller (otomatik / açık / kapalı) ve dokunmatik düzen (sağlak /
solak) bulunur.

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
| `npm run test` | Birim testleri (Vitest): kâğıt motorunun objektifi ve lambaları, kayıt, durum normalizasyonu, girdi bağlamları, yetenekler, Güneş karşılaşması, oda verisi doğrulaması, animasyon, Rezonans hareketlerinin büyümesi, tabloların yerleri, yüz sahnelerinin kadrosu, müzik bestecileri (piyano, yaylılar), diyalog müziğine geçiş ve müzik kütüphanesi |
| `npm run music:check` | Yalnızca müzik testleri: bestecilerin kuralları, diyalog müziğine geçiş ve `music/tracks.json` ile lisans notlarının denetimi |
| `npm run test:e2e` | Üretim ve e2e derlemelerini alır, Playwright tarayıcı testlerini çalıştırır: kök ve `/kristaller-dunyasi/` alt yolunda açılış (WebGL), oynanış akışları (hareket, etkileşim, duraklatma, odak kaybı, kontrol noktası + Devam Et, ayarlar, bozuk/erişilemeyen kayıt, bölüm seçimi, son), tabloyu inceleme, Rezonans hareketleri (çiçek ve kuşlar, yeri sarsma, Ay ve mor at), yüz animasyonlu diyalog sahnesi ve yaylılar, çoklu dokunma, dikey ve yatay ekran düzeni, menülerin her boyutta ekrana sığması, dokunmatik düğmelerin çakışmaması ve telefon boyutlu ekranda yalnızca dokunmatikle ilk oda (`PHONE_UPRIGHT=1` ile telefon dik tutulmuş olarak) |
| `npm run test:campaign` | Yeni Oyun'dan son karta kadar tüm kampanyayı oynayan iki uzun test: masaüstünde yalnızca klavyeyle ve yatay tutulan telefon boyutlu ekranda yalnızca dokunmatikle (bu depodaki ölçümde her biri yaklaşık 11 dakika). `PHONE_UPRIGHT=1 npx playwright test mobile --grep @campaign` dokunmatik koşuyu telefon dik tutulmuş olarak oynar |
| `npm run package` | Kaynak ve `dist` arşivlerini `release/` altına üretir |

### Kâğıt motoru (2.5B sahne)

Dünya, Phaser 4 üzerinde yazılmış kendi kâğıt motorumuzla çizilir
(`src/paper/`; üç boyut kütüphanesi kullanılmaz). Her oda önü yırtık bir
kâğıt kutudur: arka duvarı, zemini, tavanı ve yan duvarları kutunun kendi
gölgelendiricisi çizer. Kutudaki her şey izleyiciye dönük bir kartondur ve
kendi derinliğinde (`z`) durur. Göz dümdüz bakar; kutuya yukarıdan bakış,
mimarların kaydırmalı objektifinde olduğu gibi resim kaydırılarak verilir.
Bu yüzden bir karton derinliğinde yalnızca ölçeklenir (`f / (göz.z − z)`),
biçimi hiç bozulmaz. Her karton ekranda göründüğü ölçekte, cihazın kendi
pikselleriyle yeniden basılır: 2B çizimler pikseli pikseline aynen görünür.
Her derinliğin kendi kamerası vardır ve kameralar arkadan öne çizilir.

- Işık ve hava: odanın lambaları kartonları köşelerinden boyar. Aktörlerin
  arkasında derinlikle koyulaşan bir sis, önde siluetler, ekran kenarlarında
  hafif bir kararma ve havada süzülen toz zerreleri vardır. Varsayılan hava
  masalsıdır; `?mood=nightmare` daha karanlık ve soğuk, `?mood=day` aydınlık
  bir havayı karşılaştırmak için açar.
- Gölgeler: karakterler en güçlü lambanın gölgesini arka duvara ve zemine
  düşürür. Karakter lambanın önünden geçerken gölgesi döner ve uzar.
- Kâğıt kukla: karakter dönerken bir kâğıt gibi çevrilir; yakın ve uzak kolu,
  bacağı ayrı derinliklerde durur.
- `?canvas=1`: Phaser'ın Canvas çizicisi (oynanış testleri bunu kullanır).
  Işıklar, gölgeler ve kutunun gölgelendiricisi yalnızca WebGL'de çizilir.
- `?dpr=`: cihaz piksel oranını sabitler (en çok 4).
- Oda verisinde bir prop ya da katmana `z` verilirse o derinlikte durur
  (bkz. `PropDef.z`).

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
src/engine/config.ts          Cihaz pikselli tuval (ölçekleme yok), Arcade Physics (60 Hz sabit adım)
src/engine/scenes/            BootScene (çizimleri bir kez rasterleştirir), MenuScene, WorldScene, EndingScene
src/gameplay/actors/          Oyuncu, iskelet (cutout) çalışma zamanı ve pozlar (zıplama, yüz, bekleme hareketleri), at, yaratıklar, Ay/Güneş yüzleri, anı taşı, tablo
src/gameplay/moves/             Rezonans hareketleri: hareket arayüzü, bölümlere göre büyüme tablosu, efektler (çiçek, çatlak, Ay, at) ve hareket sistemi
src/engine/cinematics/        Yüz animasyonlu diyalog sahneleri: portreler (iskelet, Ay/Güneş yüzü, resim), kadro ve sahne yöneticisi
src/engine/world/             Kendi etkileşimini yöneten nesneler için arayüz, tablo galerisi, zemin geometrisi
src/render/2d/fx/                Pastel mücevher tüneli (çizim, çerçeve düzeni, bölüm görünümleri) ve adım efektleri, renk patlamaları ve renk bombardımanı
src/paper/                  Kâğıt motoru: göz ve objektif, derinlik kameraları, birebir ölçekte baskı, kâğıt kutu, ışık ve hava, gölgeler, ekran
src/engine/systems/           Girdi bağlamları, kayıt, ses (Web Audio), anlatı/ara sahne
src/content/data/              12 odanın verisi, diyaloglar, anılar, Güneş karşılaşması durum makinesi
src/engine/rooms/             Oda kurucu (arazi, kapılar/bayraklar) ve oda betikleri
src/render/2d/               Palet, SVG çizim araçları, karakter/prop/anı çizimleri, arazi ve arka plan ressamları, atlas üretimi
src/ui/                     DOM arayüzü: menüler, HUD, diyalog, belge ve tablo görünümü, renk bombardımanı katmanı, dokunmatik kontroller
src/assets/paintings/       Tablolardaki dört resim (JPEG)
src/music/                  Bağımsız müzik modülü: piyano ve yaylılar bestecileri, sentez piyano ve yaylılar, lisanslı parça kütüphanesi, oynatıcı
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

Arka plan müziği ayrı bir modülden (`src/music/`) gelir. Odalarda piyano,
yüz animasyonlu diyalog sahnelerinde yaylılar çalar:

- **Üretilen piyano:** Müzik oyun sırasında tarayıcıda bestelenir ve çalınır;
  kayıt ya da örnek ses kullanılmaz. Her bölümün kendi karakteri vardır, örneğin
  menü Re majör, Bölüm I La minör vals, ormanlar Fa lidya, at yolculuğu Re
  miksolidya, Güneş Do armonik minör. Besteci her bölümde tanınır bir motifle
  başlar, sonra her seferinde biraz farklı akar. Nasıl çalıştığı ve nasıl
  ayarlanacağı `src/music/README.md` dosyasında anlatılıyor.
- **Diyalog müziği (yaylılar):** Diyalog sahnesi başlarken oda müziği kısa bir
  geçişle (`app.audio.setMusicOverride('tension')`) gergin bir yaylılar
  topluluğuna döner. Sahne bitince (`setMusicOverride(null)`) odanın müziği
  geri gelir. Bu müzik de tarayıcıda bestelenir ve sentezlenir. Re frig
  dizisindedir: alt yaylılarda hiç durmayan bir ostinato, üstte kabararak
  yükselen keman çizgileri, bir adım aşağı çözülen gecikmeler ve marcato
  vuruşlar. The Boys'taki Homelander müziğinin yalnızca karakteri örnek
  alındı; melodisi ya da motifi kullanılmadı.
- **Parça kütüphanesi:** `music/` klasörüne mp3 (ya da ogg, m4a, wav) ve her
  parça için bir lisans notu eklenir, parça `music/tracks.json` listesinde
  hangi bölümlerde çalacağıyla birlikte tanımlanır. Kütüphanede parçası olan
  bölümde kayıt çalar, olmayan bölümde piyano. İzinli lisanslar CC0, kamu malı
  ve CC BY'dir; atıf gerekenler Katkıda Bulunanlar ekranında gösterilir.
  Lisansı izinli olmayan ya da lisans notu eksik bir parça derlemeyi durdurur.
  Ayrıntılar `music/README.md` dosyasında.

Tarayıcılar sesi ancak bir dokunuş ya da tuş basışından sonra açar. Müzik
menüde ilk dokunuşla başlar. Ses düzeyi Ayarlar → Müzik'ten değiştirilir.

Görünüm 2.5D'dir: odalar kâğıt kutulardır (bkz. Kâğıt motoru), ön planda
siluetler geçer, karakterler lambaların gölgesini duvara ve zemine düşürür.
Oda ve bölüm geçişleri, iç içe kare çerçevelere dizilmiş, fırçayla boyanmış
pastel mücevherlerin yavaşça dönerek izleyiciye doğru aktığı tam ekran bir
tünelle yapılır; geçişin en yoğun anında tünelin ortasında boyanmış bir yüz (göz,
dudaklar, pembe bir girdap) belirir. Her adımda zeminden parlayan kristaller
filizlenir, inişlerde kristal bir taç açılır. Oynanan her formun (Gorti'nin kök
ve insan biçimleri, Korkak ve Mekanik form) gözleri siyahtır; Mekanik formun
anahtar ve kilit gözleri de siyah silüetlerdir. Duygular ayrı birer parça olan
kaşlarla, Gorti'de ve Korkak formda ayrıca şekil değiştiren gözler ve ağızla
taşınır; Gorti'nin dal saçları ve Korkak formun meşale alevi yay gibi
gecikerek hareketi izler.

## Haklar ve lisanslar

- "Kristaller Dünyası" hikâyesi ve dünyası özgün metnin yazarına aittir; tüm
  hakları saklıdır. Bu depo için açık kaynak lisansı seçilmemiştir.
- Tablolardaki dört resim (`src/assets/paintings/`) proje sahibinin sağladığı
  çizimlerdir; açık bir lisansla sunulmaz, tüm hakları sahiplerine aittir.
- Üçüncü taraf bağımlılıkların lisansları: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Test ve doğrulama notları: [QA_REPORT.md](QA_REPORT.md).

---

**English summary.** A complete Turkish-language 2D surreal adventure built
with Phaser 4.2.1, TypeScript (strict) and Vite. Run `npm ci && npm run dev`
(Node 22). `npm run build` produces a static `dist/` that works at a domain
root or any sub-path (GitHub Pages project sites). The included workflow
tests every push to `main` and publishes `dist/` to the `gh-pages` branch,
which GitHub Pages serves (*Settings → Pages → Source → Deploy from a branch →
`gh-pages`*); live at https://mizyaz.github.io/Nyluma-game/. Playable with a
keyboard, a mouse for menus, or touch alone, held upright or sideways. It is
an experience rather than a challenge: no health, hazards, quests or puzzles;
story scenes start as Gorti walks on, a colour bombardment breaks out now and
then, every room is walked on one floor (jumping is there for fun, never
needed; its feel is tuned in `src/tuning.ts`), and Gorti's face is fully
animated. The action key's
"Rezonans" move grows with the story: flowers that release birds, or, in
Gorti's human form, a ground stomp that raises the Moon and a purple horse.
Paintings of Gorti's life hang at the chapter starts, key conversations
play as face-animated close-up scenes, and room transitions fly through a
pastel tunnel of painted gems with a face at its centre. The
background music is piano composed live in the browser by a separate module
(`src/music/`); face-animated dialogue scenes switch to a tense, original
string-ensemble cue composed and synthesized the same way. An optional
library of recorded pieces (`music/`) only ships with an allowed license and
a license note per piece. Serve
over HTTP(S); `file://` is not supported. Story rights remain with the
original author.
