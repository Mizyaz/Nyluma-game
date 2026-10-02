# Ajan istemleri

Bu klasörde, kullanıcı "başlat" deyince sırayla çalışacak ajanların istemleri
var. Her dosya kendi başına eksiksiz bir istemdir. Lider oturum başlatırken
yalnızca commit imza satırlarını ve kullanıcının değiştirdiği kararları ekler.

| Sıra | İstem | İş | Dal | Çalışma kopyası | Portlar |
| --- | --- | --- | --- | --- | --- |
| 1 | [1-yatak.md](1-yatak.md) | Yaşayan yatak: dallanıp çiçek açan, Gorti'yi kaldıran yatak; daha sanatlı bir uyanış | `living-bed` | `/home/user/kd-bed` | 5451, 5611–5613 |
| 2 | [2-balinalar.md](2-balinalar.md) | Dinamik balinalar: bükülen gövde, kuyruk vuruşu, topraktan sıçrama, dalış, türüne özgü nefes | `whale-motion` | `/home/user/kd-whales` | 5461, 5621–5623 |
| 3 | [3-dusmanlar.md](3-dusmanlar.md) | Haylazlar (düşmanlar) ve Gorti'nin yeni aksiyon hareketleri | `rascals` | `/home/user/kd-foes` | 5471, 5631–5633 |

Düşmanlar sona kondu: kullanıcı önce tasarımı konuşmak istedi. Kullanıcı
isterse sıra değişir.

## Düşman tasarımının varsayılanları (kullanıcı değiştirebilir)

- **Ad:** Oyunda "haylaz" deniyor. Kötü değil, yaramazlar. Ölüm, can barı ya da
  oyun sonu yok. Sakinleştirilen her haylaz güzel bir şeye dönüşüyor.
- **Damga Böceği:** Komite'nin memurları.
  - Zıplayıp "DEVREDİLDİ" damgası vuruyor.
  - Sırtüstü kalınca sakinleştirilebiliyor.
  - Kâğıt kayığa ya da kâğıt kuşa dönüşüyor.
- **Tik-Tak:** Gorti'nin gençliğindeki kurmalı saat askeri.
  - Ritimle yürüyor, alarm halkası yayıyor.
  - Ritmi bozulunca ya da anahtarı koparılınca sakinleşiyor.
  - Müzik kutusuna, sonra teneke kuşa dönüşüyor.
- **Yalan Gölgesi:** Gorti'nin biraz yanlış bir kopyası olan mürekkep lekesi.
  - Yerde ve duvarda kayıyor, lambaları karartıyor.
  - Işıkla sakinleşiyor.
  - Daldaki bir meyveye dönüşüyor.
- **Dokunulunca:** Gorti biraz geri itiliyor ve başındaki tomurcuklardan biri
  kapanıyor. Üçü de kapanırsa iki saniye sersemleyip oturuyor, sonra tomurcuklar
  yeniden açılıyor.
- **Gorti'nin yeni hareketleri:**
  - **Sarmaşık Uzanışı:** yakalayıp çiçekli sarmaşıkla sarar.
  - **Kâğıt Kaçış:** kâğıt gibi yan dönüp içinden geçirir.
  - **Kök Dalgası:** havadan inip yerde kristal halka yayar.
  - **Gerçek Ad:** her haylazın üç notalık adını söyleyince sakinleşir.
- **Nerede:** İlk turda yalnızca 6. bölümde yeni bir talim odası (`b05`
  "Haylazlar Odası"). Hikâye odalarına kullanıcı gördükten sonra karar verilir.

## Başlatma (lider için)

Her ajan için, sırası gelince:

```
cd /home/user/kristaller-dunyasi
git worktree add -b living-bed /home/user/kd-bed paper-engine
ln -s /home/user/kristaller-dunyasi/node_modules /home/user/kd-bed/node_modules
mkdir -p /home/user/kd-shots/bed/
```

Ajana istemin tamamı verilir. Sonuna şunlar eklenir:

- iki commit imza satırı;
- kullanıcının değiştirdiği kararlar.

Ajan bitince:

1. İş incelenir, raporu ve ekran görüntüleri açılıp bakılır.
2. Dal `paper-engine`'e `--no-ff` ile birleştirilir.
3. Bütün kontroller ve iki kampanya koşulur.
4. `QA_REPORT.md`'ye bölüm yazılır ve iş yayınlanır.
5. Sonra sıradaki ajan başlar.
